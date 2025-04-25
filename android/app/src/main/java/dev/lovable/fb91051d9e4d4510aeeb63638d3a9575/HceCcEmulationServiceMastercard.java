package dev.lovable.fb91051d9e4d4510aeeb63638d3a9575;

import static android.content.ContentValues.TAG;
import static dev.lovable.fb91051d9e4d4510aeeb63638d3a9575.Utils.bytesToHexNpe;
import static dev.lovable.fb91051d9e4d4510aeeb63638d3a9575.Utils.concatenateByteArrays;
import static dev.lovable.fb91051d9e4d4510aeeb63638d3a9575.Utils.hexStringToByteArray;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.cardemulation.HostApduService;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.PluginCall;
import com.getcapacitor.JSObject;
import dev.lovable.fb91051d9e4d4510aeeb63638d3a9575.NFCTransactionPlugin;
import kotlin.text.HexFormat;

import com.getcapacitor.JSObject;


import org.bouncycastle.util.encoders.Hex;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.Keys;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.core.methods.response.EthEstimateGas;
import org.web3j.protocol.core.methods.response.EthGasPrice;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.http.HttpService;
import org.web3j.utils.Numeric;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.text.DecimalFormat;
import java.util.Arrays;
import java.util.Collections;
import java.util.Scanner;
import java.util.UUID;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;


/**
 * This service class uses a static approach to serve the data (command and response data) of a
 * sample MasterCard.
 * 
 * The provided data are from an outdated Visa Card that is no longer in use and the card is 
 * blocked by the bank. The data was recorded with the app "Talk to your Credit Card" 
 * available here: https://github.com/AndroidCrypto/TalkToYourCreditCardG8
 * 
 * Please make sure that the AID A0000000041010 is included in the apduservice.xml file or the
 * service will not called by Android, the card will not get selected and the workflow stops.
 * 
 */

public class HceCcEmulationServiceMastercard extends HostApduService {

    private static final String TAG = "HCE_Service";


    private static final int TIMEOUT = 10;  // Timeout in seconds
    private final BlockingQueue<String> transactionQueue = new ArrayBlockingQueue<>(1);

    // this is a static approach to serve the byte arrays to the service
    private static final String BASE_RPC_URL = "https://mainnet.base.org";  // Replace with your Base RPC URL
    private static final BigInteger GAS_LIMIT = BigInteger.valueOf(10000); // Higher gas limit for token transfers
    private static final BigInteger GAS_PRICE = BigInteger.valueOf(20000);  // Set appropriate gas price for Base
    private static final String PRIVATE_KEY = "0xc9f8292d37d14f50b5593ee1f743c73478de904f6b06bff1b9c05bade88f9e52";  // Replace with your actual private key
    private static final String USDC_CONTRACT_ADDRESS = Keys.toChecksumAddress("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913");  // Replace with the USDC contract address on Base
    private static final byte[] RESPONSE_OK_SW = hexStringToByteArray("9000");

    private static final byte[] RESPONSE_SECURITY_SW = hexStringToByteArray("6985");

    // Note: the responses does not include the 0x9000h terminator
    private static final byte[] SELECT_PPSE_COMMAND = hexStringToByteArray("00a404000e325041592e5359532e444446303100");
    private static final byte[] SELECT_PPSE_RESPONSE = hexStringToByteArray("6f3c840e325041592e5359532e4444463031a52abf0c2761254f07a000000004101050104465626974204d6173746572436172648701019f0a0400010101");
    private static final byte[] READ_PPSE_RECORD_RESPONSE = hexStringToByteArray("702B61294F08A000000004101001500A4D43454E4742524742508701019F120D6D6320656E2067627220676270");


    private static final byte[] SELECT_AID_COMMAND = hexStringToByteArray("00a4040007a000000004101000");
    private static final byte[] SELECT_AID_RESPONSE = hexStringToByteArray("6F3B8407A0000000041010A530500A4D43454E4742524742505F2D02656E8701019F1101019F120D6D6320656E2067627220676270BF0C059F4D020B0A");

    // this needs to be dynamic as the response from the real NFC reader is not predictable (e.g. different amounts)
    private static final byte[] GET_PROCESSING_OPTONS_COMMAND_SHORTED = hexStringToByteArray("80a8");
    //
    private static final byte[] GET_PROCESSING_OPTONS_COMMAND_READER = hexStringToByteArray("80A80000028300");
    private static final byte[] GET_PROCESSING_OPTONS_RESPONSE = hexStringToByteArray("771682025880941008010100100101011801040020010200");

    private static final byte[] READ_FILE_08_01_COMMAND = hexStringToByteArray("00B2010C00");
    private static final byte[] READ_FILE_08_01_RESPONSE = hexStringToByteArray("70649F6C0200019F62060000003800009F630600000000E0E0562542353431333333303038393039393939395E202F5E323830323230313030303030303030309F6401059F6502000E9F660207F09F6B115413330089099999D2802206043950169F9F670103");

    private static final byte[] READ_FILE_10_01_COMMAND = hexStringToByteArray("00B2011400");
    private static final byte[] READ_FILE_10_01_RESPONSE = hexStringToByteArray("70225A0854133300890999999F0D05CC000000009F0E0500000000009F0F05CC00000000");

    private static final byte[] READ_FILE_20_01_COMMAND = hexStringToByteArray("00B2011C00");
    private static final byte[] READ_FILE_20_01_RESPONSE = hexStringToByteArray("70817E5F3401215F280208269F4202082657115413330089099999D2802206043950169F5F2002202F5F24032802295F25031701018C249F02069F03069F1A0295055F2A029A039C019F35019F45029F4C089F34039F21039F7C148D0C910A8A0295059F37049F4C088E0C000000000000000042031F039F0702FFC09F08020002");

    private static final byte[] READ_FILE_20_02_COMMAND = hexStringToByteArray("00B2021C00");
    private static final byte[] READ_FILE_20_02_RESPONSE = hexStringToByteArray("70118F01FA9F4A01829F3201039204D3524107");


    private static final byte[] READ_FILE_20_03_COMMAND = hexStringToByteArray("00B2031C00");
    private static final byte[] READ_FILE_20_03_RESPONSE = hexStringToByteArray("7081939081907829BCB6B77F1F2C40506625BE583969BFBCE4B0A6CD286E1ECF1406621A8D049E7AF39508277CFA7BAAF8722C31132D448ACA826B7759F893CC9B4A3A2880985D5E77ADA087B51A24ABF54FB2E8187703C484D1A651B952753DECFA88A6957ED5E3422A2BA4E46390067864F0623314AFE8F749D2C8FB4B7C2F6F11722AA6915E8548FFE548DE1CB6CB8208BB71A056");

    private static final byte[] READ_FILE_20_04_COMMAND = hexStringToByteArray("00B2041C00");
    private static final byte[] READ_FILE_20_04_RESPONSE = hexStringToByteArray("707293702ED5DBA18BF5B92AACA923E24B058E520BAB16B32F2B6A2BA95FCCDBD1BF051B66C7BDF885951C16E105619549E556A5A9861ABC2529D58D1BC3239AE50D8B3164CEF3D70ECF71364A4CAEABEFDD87DD5D7196B131DD066D49456890B355A066A5554FC5115F1FE7BE3DEA5802CE665E");

    private static final byte[] READ_FILE_20_05_COMMAND = hexStringToByteArray("00B2012400");
    private static final byte[] READ_FILE_20_05_RESPONSE = hexStringToByteArray("70219F4701039F481A0000000000000006600000000000000000000000000000000055");

    private static final byte[] READ_FILE_20_06_COMMAND = hexStringToByteArray("00B2022400");
    private static final byte[] READ_FILE_20_06_RESPONSE = hexStringToByteArray("70739F4670220F1737027852EFF83F6DC708DEF028CEC03FE7892518E1536D628B59D24A05F37F46FD0917813D331EBF97B00FA6F52F66D9FC11DB051D107DDE76FE86BC066A528903932D64C1BA893F7A0A43B6648D5E6EEAF0B4A8BA2EC9DF0DF093D26FBB965F5BE607FEF34260DA245EBF3844");

    private static final byte[] INTERNAL_AUTHENTICATE_COMMAND = hexStringToByteArray("00880000");
    private static final byte[] INTERNAL_AUTHENTICATE_RESPONSE = hexStringToByteArray("70739F4670220F1737027852EFF83F6DC708DEF028CEC03FE7892518E1536D628B59D24A05F37F46FD0917813D331EBF97B00FA6F52F66D9FC11DB051D107DDE76FE86BC066A528903932D64C1BA893F7A0A43B6648D5E6EEAF0B4A8BA2EC9DF0DF093D26FBB965F5BE607FEF34260DA245EBF3844");

    private static final byte[] GET_CHALLENGE_COMMAND = hexStringToByteArray("00840000");
    private static final byte[] GET_CHALLENGE_RESPONSE = hexStringToByteArray("0102030405060708");


    private static final byte[] GENERATE_AC = hexStringToByteArray("80AE");
    //80AE40002F00000010000000000000000000000000000978090730218A57CEFC16EBFE25BA3B61E3E62B141E8C8BC89B72D4140D


    private static final Logger log = LoggerFactory.getLogger(HceCcEmulationServiceMastercard.class);

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Example of sending a broadcast with data
        Intent broadcastIntent = new Intent("com.yourapp.SHOW_TOAST");
        broadcastIntent.putExtra("message", "Payment Successful");
        broadcastIntent.putExtra("details", "Payment of amount has been processed");
        sendBroadcast(broadcastIntent);

        return START_NOT_STICKY;
    }


    @Override
    public byte[] processCommandApdu(byte[] commandApdu, Bundle bundle) {
        sendMessageToActivity("------------------------", "----");
        sendMessageToActivity("# Mastercard #", bytesToHexNpe(commandApdu));

        // step 01
        if (Arrays.equals(commandApdu, SELECT_PPSE_COMMAND)) {
            // step 01 selecting the PPSE
            sendMessageToActivity("step 01 Select PPSE Command ", bytesToHexNpe(commandApdu));
            sendMessageToActivity("step 01 Select PPSE Response", bytesToHexNpe(SELECT_PPSE_RESPONSE));
            return concatenateByteArrays(SELECT_PPSE_RESPONSE, RESPONSE_OK_SW);
        }


       /* if (Arrays.equals(commandApdu, SELECT_PSE_COMMAND)) {
            // step 01 selecting the PPSE
            sendMessageToActivity("step 01 Select PSE Command ", bytesToHexNpe(commandApdu));
            sendMessageToActivity("step 01 Select PSE Response", bytesToHexNpe(SELECT_PSE_RESPONSE));
            return concatenateByteArrays(SELECT_PSE_RESPONSE, RESPONSE_OK_SW);
        }*/

        /*if (Arrays.equals(commandApdu, READ_PPSE_RECORD)) {
            // step 01 selecting the PPSE
            sendMessageToActivity("read record ppse ", bytesToHexNpe(commandApdu));
            sendMessageToActivity("read record ppse response", bytesToHexNpe(READ_PPSE_RECORD_RESPONSE));
            return concatenateByteArrays(READ_PPSE_RECORD_RESPONSE, RESPONSE_OK_SW);
        }*/

        // step 02
        if (Arrays.equals(commandApdu, SELECT_AID_COMMAND)) {
            // step 02 selecting the AID
            sendMessageToActivity("step 02 Select AID Command ", bytesToHexNpe(commandApdu));
            sendMessageToActivity("step 02 Select AID Response", bytesToHexNpe(SELECT_AID_RESPONSE));
            return concatenateByteArrays(SELECT_AID_RESPONSE, RESPONSE_OK_SW);
        }

        // step 03
        // dynamic - just compare the beginning of the commandApdu with the sample
        byte[] shortedCommandApdu = Arrays.copyOf(commandApdu, 2);
        if (Arrays.equals(shortedCommandApdu, GET_PROCESSING_OPTONS_COMMAND_SHORTED)) {
            sendMessageToActivity("step 03 Get Processing Options (GPO) Command", bytesToHexNpe(commandApdu));
            sendMessageToActivity("step 03 Get Processing Options (GPO) Response", bytesToHexNpe(GET_PROCESSING_OPTONS_RESPONSE));
            return concatenateByteArrays(GET_PROCESSING_OPTONS_RESPONSE, RESPONSE_OK_SW);
        }

        // step 04
        if (Arrays.equals(commandApdu, READ_FILE_08_01_COMMAND)) {
            // step 04 Read File 10/03 Command
            sendMessageToActivity("step 04 Read File 08/01 Command", bytesToHexNpe(commandApdu));
            sendMessageToActivity("step 04 Read File 08/01 Response", bytesToHexNpe(READ_FILE_08_01_RESPONSE));
            return concatenateByteArrays(READ_FILE_08_01_RESPONSE, RESPONSE_OK_SW);
        }

        // step 05
        if (Arrays.equals(commandApdu, READ_FILE_10_01_COMMAND)) {
            // step 05 Read File 10/04 Command
            sendMessageToActivity("step 05 Read File 10/01 Command", bytesToHexNpe(commandApdu));
            sendMessageToActivity("step 05 Read File 10/01 Response", bytesToHexNpe(READ_FILE_10_01_RESPONSE));
            return concatenateByteArrays(READ_FILE_10_01_RESPONSE, RESPONSE_OK_SW);
        }

        // step 06
        if (Arrays.equals(commandApdu, READ_FILE_20_01_COMMAND)) {
            // step 06 Read File 10/05 Command
            sendMessageToActivity("step 06 Read File 20/01 Command", bytesToHexNpe(commandApdu));
            sendMessageToActivity("step 06 Read File 20/01 Response", bytesToHexNpe(READ_FILE_20_01_RESPONSE));
            return concatenateByteArrays(READ_FILE_20_01_RESPONSE, RESPONSE_OK_SW);
        }

        // step 07
        if (Arrays.equals(commandApdu, READ_FILE_20_02_COMMAND)) {
            // step 07 Read File 10/06 Command
            sendMessageToActivity("step 0 Read READ_FILE_20_02_COMMAND", bytesToHexNpe(commandApdu));
            sendMessageToActivity("step 08 Read File 20/02 Response", bytesToHexNpe(READ_FILE_20_02_RESPONSE));
            return concatenateByteArrays(READ_FILE_20_02_RESPONSE, RESPONSE_OK_SW);
        }


        if (Arrays.equals(commandApdu, READ_FILE_20_03_COMMAND)) {
            // step 07 Read File 10/06 Command
            sendMessageToActivity("step 08 READ_FILE_20_03_COMMAND", bytesToHexNpe(commandApdu));
            sendMessageToActivity("step 08 Read File 20/02 Response", bytesToHexNpe(READ_FILE_20_03_RESPONSE));
            return concatenateByteArrays(READ_FILE_20_03_RESPONSE, RESPONSE_OK_SW);
        }

        if (Arrays.equals(commandApdu, READ_FILE_20_04_COMMAND)) {
            // step 07 Read File 10/06 Command
            sendMessageToActivity("step READ_FILE_20_04_COMMAND", bytesToHexNpe(commandApdu));
            sendMessageToActivity("step 08 Read File 20/02 Response", bytesToHexNpe(READ_FILE_20_04_RESPONSE));
            return concatenateByteArrays(READ_FILE_20_04_RESPONSE, RESPONSE_OK_SW);
        }
        if (Arrays.equals(commandApdu, READ_FILE_20_05_COMMAND)) {
            // step 07 Read File 10/06 Command
            sendMessageToActivity("step 08 Read FileREAD_FILE_20_05_COMMAND", bytesToHexNpe(commandApdu));
            sendMessageToActivity("step 08 Read File 20/02 Response", bytesToHexNpe(READ_FILE_20_05_RESPONSE));
            return concatenateByteArrays(READ_FILE_20_05_RESPONSE, RESPONSE_OK_SW);
        }
        if (Arrays.equals(commandApdu, READ_FILE_20_06_COMMAND)) {
            // step 07 Read File 10/06 Command
            sendMessageToActivity("step 08 Read File READ_FILE_20_06_COMMAND", bytesToHexNpe(commandApdu));
            sendMessageToActivity("step 08 Read File 20/02 Response", bytesToHexNpe(READ_FILE_20_06_RESPONSE));
            return concatenateByteArrays(READ_FILE_20_06_RESPONSE, RESPONSE_OK_SW);
        }

        if (commandApdu.length >= GENERATE_AC.length &&
                Arrays.equals(Arrays.copyOfRange(commandApdu, 0, GENERATE_AC.length), GENERATE_AC)) {
            // commandApdu begins with GENERATE_AC

            // step 08

            sendMessageToActivity("generate AC", bytesToHexNpe(commandApdu));

            try {
                byte[] apduData = Arrays.copyOfRange(commandApdu, 5, commandApdu.length);


                String amount = new BigInteger(Utils.bytesToHexNpe(Arrays.copyOfRange(apduData, 0, 6))).toString();


                String transactionId = handleNFCTransaction(amount);
                byte[] generateAcResponse = hexStringToByteArray("77379F2701809F3602003A9F26088A63693BBF445EF29F1020");

// Get the SHA-1 hash as a byte array
                byte[] hashBytes = hashUUID(transactionId);

// Merge both byte arrays
                byte[] GENERATE_AC_RESPONSE = new byte[generateAcResponse.length + hashBytes.length];
                System.arraycopy(generateAcResponse, 0, GENERATE_AC_RESPONSE, 0, generateAcResponse.length);
                System.arraycopy(hashBytes, 0, GENERATE_AC_RESPONSE, generateAcResponse.length, hashBytes.length);
                return concatenateByteArrays(GENERATE_AC_RESPONSE, RESPONSE_OK_SW);
            } catch (Exception e) {
                return RESPONSE_SECURITY_SW;
            }

        }


        sendMessageToActivity("raw apdu command", bytesToHexNpe(commandApdu));


        // in any other case response an 'OK'
        return RESPONSE_OK_SW;
    }

    public static byte[] hashUUID(String uuid) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return digest.digest(uuid.getBytes(StandardCharsets.UTF_8)); // Returns raw byte array
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-1 algorithm not available", e);
        }
    }

    public String handleNFCTransaction(String amount) throws ExecutionException, InterruptedException {
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        Future<String> future = executorService.submit(new Callable<String>() {
            @Override
            public String call() throws Exception {
                try {
                    String accessToken = getTinkOAuthTokenForPayment();

                    System.out.println("Token generated: " + accessToken);

                    String consentId = "e0c2e9df-11ad-43b9-925e-6de8f1d4d63d";

                    if (amount == null || amount.isEmpty()) {
                        throw new IllegalArgumentException("Amount is required for the transaction.");
                    }

                    String transactionId = createTinkPayment(accessToken, amount, consentId);

                    if (transactionId.isEmpty()) {
                        throw new RuntimeException("Payment failed with status");
                    }


                    System.out.println("Transaction ID: " + transactionId);


                    return transactionId;
                } catch (Exception e) {
                    System.err.println("Payment error: " + e.getMessage());
                    return null;
                }  // Perform the network request in the background
            }
        });

        String transactionId= future.get();
        setPaymentAmount(amount);
        setShowPaymentSuccess(true);
        this.sendTransactionCompletionBroadcast(amount);
        return transactionId;
    }


private static String getTinkOAuthTokenForPayment() throws IOException {
    String url = "https://api.tink.com/api/v1/oauth/token";
    String clientId = "e5ca99078f154a58854f5505aebfc6ac";
    String clientSecret = "2c895e1d757c4377b57be9076e24d084";
    String grantType = "client_credentials";
    String scope = "mandate-payments,mandate-payments:readonly";

    try {
        URL apiUrl = new URL(url);
        HttpURLConnection connection = (HttpURLConnection) apiUrl.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        connection.setRequestProperty("Accept", "application/json");
        connection.setDoOutput(true);

        String data = "client_id=" + clientId + "&client_secret=" + clientSecret +
                "&grant_type=" + grantType + "&scope=" + scope;

        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = data.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        int responseCode = connection.getResponseCode();
        StringBuilder response = new StringBuilder();
        try (Scanner scanner = new Scanner(connection.getInputStream())) {
            while (scanner.hasNext()) {
                response.append(scanner.nextLine());
            }
        }

        if (responseCode == 200) {
            JSONObject jsonResponse = new JSONObject(response.toString());
            return jsonResponse.optString("access_token", null);        } else {
            System.out.println("Error: " + responseCode);
            return null;
        }
    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
}

private static String createTinkPayment(String accessToken, String amount, String consentId) throws IOException, JSONException {
    URL url = new URL("https://api.tink.com/payment/v1/mandate-payments");
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setRequestMethod("POST");
    conn.setRequestProperty("Authorization", "Bearer " + accessToken);

    byte[] key = new byte[16]; // 16 bytes = 128 bits
    SecureRandom random = new SecureRandom();
    random.nextBytes(key);
    conn.setRequestProperty("Idempotency-Key", Hex.toHexString(key));
    conn.setRequestProperty("Content-Type", "application/json");
    conn.setDoOutput(true);

    String jsonInputString = "{\"amount\":{\"currencyCode\":\"GBP\",\"value\":{\"scale\":\"2\",\"unscaledValue\":\"" + amount + "\"}},\"consentId\":\"" + consentId + "\",\"remittanceInformation\":{\"type\":\"REFERENCE\",\"value\":\"ReferenceString\"}}";
    try (OutputStream os = conn.getOutputStream()) {
        byte[] input = jsonInputString.getBytes("utf-8");
        os.write(input, 0, input.length);
    }

    int status = conn.getResponseCode();
    if (status == 201) {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            JSONObject jsonResponse = new JSONObject(response.toString());
            String transactionId= jsonResponse.optString("id", null);
            return transactionId; // Extract transaction ID properly
        }
    } else {

        return new PaymentResponse(false, "").getTransactionId();
    }



}


private static void setPaymentAmount(String amount) {
    // Placeholder method
}

private static void setShowPaymentSuccess(boolean success) {
    // Placeholder method
}

    private void sendTransactionCompletionBroadcast(String amount) {
        // Once the transaction is finished, send a broadcast with the result
        Intent broadcastIntent = new Intent("showToast");
        broadcastIntent.putExtra("message", amount +"EURO Success");
        broadcastIntent.putExtra("details", "Payment of amount has been processed successfully.");
        sendBroadcast(broadcastIntent);
    }
    public static byte[] hexStringToByteArray(String hex) {
        int length = hex.length();
        byte[] byteArray = new byte[length / 2];
        for (int i = 0; i < length; i += 2) {
            byteArray[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i+1), 16));
        }
        return byteArray;
    }
    @Override
    public void onDeactivated(int reason) {
        sendMessageToActivity("------------------------", "----");
        sendMessageToActivity("onDeactivated with reason", String.valueOf(reason));
    }

    /**
     * A utility method to send data with an Broadcast Intent from this service to the MainActivity class
     *
     * @param msg
     * @param data
     */
    private void sendMessageToActivity(String msg, String data) {
       System.out.println(msg +  data);
       // sendBroadcast(intent); // Use sendBroadcast instead of LocalBroadcastManager
    }

    private void sendMessageToActivityWithHash(String msg, String data , String hash ) {
        Intent intent = new Intent("transactions");
        intent.setPackage(getPackageName());
        // You can also include some extra data.
        intent.putExtra("Message", msg);
        intent.putExtra("Data", data);

        intent.putExtra("Hash" , hash );
        Context context = this;
       sendBroadcast(intent);
    }


    private String sendTransactionToWeb3(byte[] commandApdu) throws Exception {
        byte[] apduData= Arrays.copyOfRange(commandApdu , 5 ,commandApdu.length);

        String walletAdress= "0x0a5347c942c4985A3C6A89E79a59AA1b5BE794c3";

        BigInteger amountUSD= new BigInteger( Utils.bytesToHexNpe( Arrays.copyOfRange(apduData ,0 , 6 )));
        BigInteger amountUSDp = new BigInteger(amountUSD.toString()).multiply(new BigInteger("10000"));

        CompletableFuture<String> futureTransactionHash = CompletableFuture.supplyAsync(() -> {
            try {
                return sendUSDCToken(walletAdress, amountUSDp);
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        });

        // Block and wait for the transaction hash
        try {
            return futureTransactionHash.get();  // Waits until sendUSDCToken completes and returns the transaction hash
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }

    }







    public static String getUSDCBalance() throws Exception {
        Web3j web3j = Web3j.build(new HttpService(BASE_RPC_URL));
        String walletAddress = Keys.toChecksumAddress("0x2eb1E9D1990565374823Ae4ab2BBC462652a8580");

        // Prepare the balanceOf function call
        Function balanceOf = new Function(
                "balanceOf",
                Collections.singletonList(new Address(walletAddress)),
                Collections.singletonList(new org.web3j.abi.TypeReference<Uint256>() {})
        );

        // Encode the function call
        String encodedFunction = FunctionEncoder.encode(balanceOf);

        EthCall response;
        try {
            // Create the call request
            response = web3j.ethCall(
                    Transaction.createEthCallTransaction(
                            walletAddress, USDC_CONTRACT_ADDRESS, encodedFunction
                    ),
                    DefaultBlockParameterName.LATEST
            ).send();
        } catch (IOException e) {
            throw new RuntimeException("Error while calling the contract: " + e.getMessage(), e);
        }

        // Check if the response is valid
        if (response.hasError()) {
            throw new RuntimeException("Error fetching balance: " + response.getError().getMessage());
        }

        // Parse the result
        String balance = response.getValue();

        // Convert the balance from hex to decimal
        BigInteger decimalBalance = new BigInteger(balance.substring(2), 16);
        float balancef = decimalBalance.floatValue() / 1_000_000;

        // Format the float to 2 decimal places
        DecimalFormat df = new DecimalFormat("#.##");
        String strValue = df.format(balancef);
        return  strValue;
    }

    /**
         * Sends a USDC transfer on the Base chain.
         *
         * @param toAddress The recipient address
         * @param amountUSDC The amount to send in USDC
         * @return The transaction hash if successful; null otherwise
         * @throws Exception If there is an error during the transaction
         */
        public static String sendUSDCToken(String toAddress, BigInteger amountUSDC) throws Exception {
            // Initialize Web3j and credentials
            Web3j web3j = Web3j.build(new HttpService(BASE_RPC_URL));
            Credentials credentials = Credentials.create(PRIVATE_KEY);

            // Get the sender's address and transaction nonce
            String fromAddress = Keys.toChecksumAddress("0x2eb1E9D1990565374823Ae4ab2BBC462652a8580")   ;
            try {
                EthGetTransactionCount ethGetTransactionCount = web3j.ethGetTransactionCount(
                        fromAddress, DefaultBlockParameterName.LATEST).send();

            }
            catch (Exception e)
            {
                log.trace(e.getMessage());
            }
            EthGetTransactionCount ethGetTransactionCount = web3j.ethGetTransactionCount(
                    fromAddress, DefaultBlockParameterName.LATEST).send();
            BigInteger nonce = ethGetTransactionCount.getTransactionCount();

            // Convert USDC amount to smallest unit (10^6 for USDC decimals)
            BigInteger amountInSmallestUnit = amountUSDC;

            // Create the transfer function for the ERC-20 contract
            Function function = new Function(
                    "transfer",
                    Arrays.asList(new Address(toAddress), new Uint256(amountInSmallestUnit)),
                    Arrays.asList());

            String encodedFunction = FunctionEncoder.encode(function);

            // Step 1: Get the current gas price
            EthGasPrice ethGasPrice = web3j.ethGasPrice().send();
            BigInteger currentGasPrice = ethGasPrice.getGasPrice();

            // Optionally, increase gas price for a faster transaction
            BigInteger fastGasPrice = currentGasPrice.multiply(BigInteger.valueOf(2)); // 2x the current price for faster processing

            // Step 2: Estimate the gas limit for the transaction
            Transaction transaction = Transaction.createEthCallTransaction(
                    credentials.getAddress(), USDC_CONTRACT_ADDRESS, encodedFunction);

            EthEstimateGas ethEstimateGas = web3j.ethEstimateGas(transaction).send();

            BigInteger estimatedGasLimit = ethEstimateGas.getAmountUsed();
            if (ethEstimateGas.hasError()) {
                System.out.println("Error estimating gas: " + ethEstimateGas.getError().getMessage());
                return null ;
            }

            // Step 3: Create the raw transaction with estimated gas limit and current (or fast) gas price
            RawTransaction rawTransaction = RawTransaction.createTransaction(
                    nonce, fastGasPrice, estimatedGasLimit, USDC_CONTRACT_ADDRESS, encodedFunction);

            // Step 4: Sign and send the transaction
            byte[] signedMessage = TransactionEncoder.signMessage(rawTransaction, credentials);
            String hexValue = Numeric.toHexString(signedMessage);

            EthSendTransaction ethSendTransaction = web3j.ethSendRawTransaction(hexValue).send();
            String transactionHash = ethSendTransaction.getTransactionHash();
            if (transactionHash != null) {
                System.out.println("Transaction successful with hash: " + transactionHash);
            } else {
                System.err.println("Transaction failed: " + ethSendTransaction.getError().getMessage());
            }

            // Close Web3j connection
            web3j.shutdown();

            return transactionHash.substring(2);
        }

        
    





}
