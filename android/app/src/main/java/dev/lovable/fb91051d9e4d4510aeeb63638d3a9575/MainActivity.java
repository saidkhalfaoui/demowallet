package de.androidcrypto.android_hce_emulate_a_creditcard;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MainActivity extends AppCompatActivity {

    private static final Logger log = LoggerFactory.getLogger(MainActivity.class);
    private Handler handler = new Handler();
    private Runnable balanceRunnable;
    private static TextView tvHceServiceLog;
    private static TextView transactionHash;
    private static String hceServiceLog = "";
    public static  TextView balanceTextView;
    @SuppressLint("SourceLockedOrientationActivity")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.viewMainActivity), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        tvHceServiceLog = findViewById(R.id.tvHceServiceLog);
        transactionHash = findViewById(R.id.transactionHash);

        /**
         * Note on this setting: Do NOT remove this setting or the app will fail when the screen goes
         * from portrait to landscape and vice versa. The app will then run the onDestroy() method, but
         * the BroadcastReceiver is not registered yet. The only way to solve this issue would be to
         * use a STATIC BroadcastReceiver.
         */
        this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);


            LocalBroadcastManager.getInstance(MainActivity.this).registerReceiver(
                    mMessageReceiver, new IntentFilter("transactions"));





        balanceTextView = findViewById(R.id.balanceTextView);

        balanceRunnable = new Runnable() {
            @Override
            public void run() {
                // Fetch the balance and update UI
                new GetUsdcBalanceTask().execute();
                // Re-run this runnable in 5 seconds
                handler.postDelayed(this, 5000);
            }
        };

        // Execute the AsyncTask to get the USDC balance
        ;
    }



    @Override
    public void onResume() {

            LocalBroadcastManager.getInstance(MainActivity.this).registerReceiver(
                    mMessageReceiver, new IntentFilter("transactions"));
        MainActivity.tvHceServiceLog.setText(hceServiceLog);





        new GetUsdcBalanceTask().execute();
        super.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
    }

    @Override
    public void onStop() {
        super.onStop();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        this.unregisterReceiver(mMessageReceiver);
    }

    private void appendMessageToLog(String message, String data , String hash) {
        hceServiceLog += message + " | " + data + "\n";
        log.debug(hceServiceLog);
        MainActivity.tvHceServiceLog.setText(hceServiceLog);
        if (hash!=null)
        {
            MainActivity.transactionHash.setText("Transaction Hash :" +   hash);

        }


    }

    private void showAToast(Context context, String message) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
    }

    private  BroadcastReceiver mMessageReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            // Get extra data included in the Intent
            String message = intent.getStringExtra("Message");
            String data = intent.getStringExtra("Data");
            String hash=intent.getStringExtra ("Hash");


            appendMessageToLog(message, data , hash);
        }
    };

}