package  dev.lovable.fb91051d9e4d4510aeeb63638d3a9575;
import org.json.JSONObject;

class PaymentResponse {
    private String transactionId;
    private  boolean status;

    public PaymentResponse(boolean status , String json) {
        try {
            JSONObject jsonObject = new JSONObject(json);
            this.status= status;
            this.transactionId = jsonObject.optString("transactionId", "123345645777811");
        } catch (Exception e) {
            this.transactionId = "";
        }
    }

    public boolean isOk() {
        return status;
    }

    public String getTransactionId() {
        return transactionId;
    }
}
