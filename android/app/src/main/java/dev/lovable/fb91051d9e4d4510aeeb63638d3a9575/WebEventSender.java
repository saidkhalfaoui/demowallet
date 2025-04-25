package dev.lovable.fb91051d9e4d4510aeeb63638d3a9575;

import android.webkit.WebView;
import android.webkit.WebMessage;
import com.getcapacitor.Bridge;

public class WebEventSender {
    public static void sendShowToastEvent(Bridge bridge) {
        WebView webView = bridge.getWebView();
        String eventData = "{ \"message\": \"Success\", \"details\": \"Payment processed\", \"amount\": \"100 USD\" }";

        String webMessage = "{ \"event\": \"showToast\", \"detail\": " + eventData + " }";
        webView.postWebMessage(new WebMessage(webMessage), null);
    }
}
