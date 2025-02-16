package dev.lovable.fb91051d9e4d4510aeeb63638d3a9575;

import android.util.Log;
import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONObject;

@CapacitorPlugin(name = "NFCTransaction")
public class NFCTransactionPlugin extends Plugin {

    @PluginMethod
    public void handleNFCTransaction(PluginCall call) {
        String eventType = call.getString("eventType");
        String amount = call.getString("amount");

        if (eventType == null) {
            call.reject("Missing eventType parameter");
            return;
        }

        getBridge().executeOnMainThread(() -> {
        String jsCall = "handleNFCTransaction('" + eventType + "', { amount: '" + (amount != null ? amount : "") + "' })";

        getBridge().getWebView().evaluateJavascript(jsCall, result -> {
        try {
            JSONObject responseJson = new JSONObject(result);
            String transactionId = responseJson.optString("transactionId", "000000000000000000000");
            JSObject response = new JSObject();
            response.put("transactionId", transactionId);
            call.resolve(response);
        } catch (Exception e) {
            Log.e("NFCTransactionPlugin", "Error processing transaction", e);
            call.reject("Transaction processing error");
        }
    });
    });
    }
}
