package dev.lovable.fb91051d9e4d4510aeeb63638d3a9575;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.webkit.WebView;

import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.JSObject;

public class MainActivity extends BridgeActivity {
    private WebView webView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = this.getBridge().getWebView();

        // Register BroadcastReceiver
        IntentFilter filter = new IntentFilter("showToast");
        registerReceiver(paymentReceiver, filter, Context.RECEIVER_EXPORTED);
    }

    private final BroadcastReceiver paymentReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String message = intent.getStringExtra("message");
            String details = intent.getStringExtra("details");
            //String amount = intent.getStringExtra("amount");

            if (webView != null) {
                String jsCode = "window.dispatchEvent(new CustomEvent(\"showToast\", { " +
                        "detail: JSON.stringify({message: \"" + message + "\", details: \"" + details + "\"})" +
                        "}));";
                webView.post(() -> webView.evaluateJavascript(jsCode, null));
            }
        }
    };
}

