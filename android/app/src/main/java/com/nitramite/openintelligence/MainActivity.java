package com.nitramite.openintelligence;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.StrictMode;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Base64;
import android.view.MenuItem;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import com.jcraft.jsch.HostKey;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;

public class MainActivity extends AppCompatActivity {

    // Logging
    private final static String TAG = "MainActivity";

    // View components
    private Session session = null;
    private WebView intelligenceWebView;

    // Variables
    private SharedPreferences sharedPreferences;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);

        // Override thread policy
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);

        // Shared preferences
        sharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);

        // Init webView
        intelligenceWebView = findViewById(R.id.intelligenceWebView);
        intelligenceWebView.getSettings().setJavaScriptEnabled(true);
        intelligenceWebView.setWebViewClient(new WebViewController());
        intelligenceWebView.getSettings().setDomStorageEnabled(true);
        intelligenceWebView.setWebChromeClient(new WebChromeClient());
        intelligenceWebView.getSettings().setLoadWithOverviewMode(true);
        intelligenceWebView.getSettings().setUseWideViewPort(true);
        intelligenceWebView.getSettings().setBuiltInZoomControls(true);
        intelligenceWebView.getSettings().setDisplayZoomControls(false);
        intelligenceWebView.getSettings().setSupportZoom(true);
        intelligenceWebView.getSettings().setDefaultTextEncodingName("utf-8");

        intelligenceWebView.setWebChromeClient(new WebChromeClient());
        intelligenceWebView.setWebViewClient(new WebViewClient());

        // this.intelligenceWebView.loadUrl("http://192.168.1.20:4300/");

        createSshTunnel();
    }

    // ---------------------------------------------------------------------------------------------


    /**
     * Handles connection creation
     */
    private void createSshTunnel() {
        Connection connection = getConnectionDetails();
        if (startSSHConnection(connection)) {
            openOpenIntelligenceWebInterface(connection);
        }
    }

    /**
     * Open web interface at web view
     * @param connection object
     */
    private void openOpenIntelligenceWebInterface(final Connection connection) {
        this.intelligenceWebView.loadUrl("http://localhost:" + connection.getTunnelServerPort());
    }


    /**
     * Create ssh connection
     * @param connection object
     * @return boolean
     */
    private Boolean startSSHConnection(final Connection connection) {
        if (connection.validRequirements()) {

            JSch sshClient = null;
            try {
                sshClient = new JSch();

                // Use private key
                sshClient.addIdentity(connection.getSshPrivateKeyLocation(), connection.getSshPrivateKeyPassphrase());
                session = sshClient.getSession(connection.getSshUserName(), connection.getSshAddress(), connection.getSshPort());

                session.setPortForwardingL(connection.getTunnelServerPort(),
                        connection.getTunnelServerAddress(), connection.getTunnelServerPort());

                if (!connection.getSshStrictHostKeyChecking()) {
                    session.setConfig("StrictHostKeyChecking", "no");
                    session.connect(5000);
                    session.openChannel("direct-tcpip");
                    return true;
                } else {
                    session.setConfig("StrictHostKeyChecking", "yes");
                    if (connection.getSshHostKey() != null) {
                        byte[] keyBytes = Base64.decode(connection.getSshHostKey(), Base64.DEFAULT);
                        sshClient.getHostKeyRepository().add(new HostKey(connection.getSshHostName(), keyBytes), null);
                    }
                    session.connect();
                    session.openChannel("direct-tcpip");
                    return true;
                }

            } catch (JSchException e) {
                if (e.toString().contains("reject HostKey")) {
                    askToTrustKey(
                            session.getHostKey().getHost(),
                            session.getHostKey().getFingerPrint(sshClient),
                            session.getHostKey().getKey()
                    );
                } else {
                    genericErrorDialog("Error", e.toString());
                }
                return false;
            } catch (NullPointerException e) {
                genericErrorDialog("Error", e.toString());
                return false;
            }
        } else {
            genericErrorDialog("Info", "Connection and tunnel properties are not yet set at settings.");
        }
        return false;
    }


    private Connection getConnectionDetails() {
        return new Connection(
                sharedPreferences.getString(Constants.SP_SSH_ADDRESS, null),
                Integer.parseInt(sharedPreferences.getString(Constants.SP_SSH_PORT, "-1")),
                sharedPreferences.getString(Constants.SP_SSH_USERNAME, null),
                sharedPreferences.getString(Constants.SP_SSH_PRIVATE_KEY_FILE_LOCATION, null),
                sharedPreferences.getString(Constants.SP_SSH_PRIVATE_KEY_FILE_PASSPHRASE, null),
                sharedPreferences.getBoolean(Constants.SP_SSH_STRICT_HOST_KEY_CHECKING, true),
                sharedPreferences.getString(Constants.SP_TUNNEL_SERVER_IP_ADDRESS, null),
                Integer.parseInt(sharedPreferences.getString(Constants.SP_TUNNEL_SERVER_PORT, "-1")),
                sharedPreferences.getString(Constants.SP_HOST_NAME, null),
                sharedPreferences.getString(Constants.SP_HOST_FINGER_PRINT, null),
                sharedPreferences.getString(Constants.SP_HOST_KEY, null)
        );
    }

    // ---------------------------------------------------------------------------------------------

    // Generic use error dialog
    private void genericErrorDialog(final String title, final String description) {
        new AlertDialog.Builder(MainActivity.this)
                .setTitle(title)
                .setMessage(description)
                .setPositiveButton("Close", (dialog, which) -> {
                })
                .setNeutralButton("Copy content", (dialog, which) -> {
                    try {
                        ClipboardManager clipboard = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
                        ClipData clip = ClipData.newPlainText("", description);
                        assert clipboard != null;
                        clipboard.setPrimaryClip(clip);
                        Toast.makeText(MainActivity.this, "Content copied to clipboard", Toast.LENGTH_SHORT).show();
                    } catch (IndexOutOfBoundsException e) {
                        Toast.makeText(MainActivity.this, "There was nothing to copy", Toast.LENGTH_LONG).show();
                    }
                })
                .setIcon(R.drawable.ic_error_small)
                .show();
    }


    // Generic use success dialog
    private void genericSuccessDialog(final String title, final String description) {
        new AlertDialog.Builder(MainActivity.this)
                .setTitle(title)
                .setMessage(description)
                .setPositiveButton("Close", (dialog, which) -> {
                })
                .setIcon(R.mipmap.ic_launcher_round)
                .show();
    }


    private void askToTrustKey(final String hostName, final String hostFingerPrint, final String hostKey) {
        runOnUiThread(() -> {
            new AlertDialog.Builder(MainActivity.this)
                    .setIcon(R.mipmap.ic_launcher)
                    .setMessage("Trust host " + hostName + " with following key finger print: " + "\n\n" + hostFingerPrint)
                    .setCancelable(false)
                    .setPositiveButton("Yes", (dialog, id) -> {
                        PreferenceManager.getDefaultSharedPreferences(MainActivity.this).edit().putString(Constants.SP_HOST_KEY, hostKey).apply();
                        SharedPreferences setSharedPreferences = PreferenceManager.getDefaultSharedPreferences(getBaseContext());
                        SharedPreferences.Editor editor = setSharedPreferences.edit();
                        editor.putString(Constants.SP_HOST_NAME, hostName);
                        editor.putString(Constants.SP_HOST_FINGER_PRINT, hostFingerPrint);
                        editor.putString(Constants.SP_HOST_KEY, hostKey);
                        editor.apply();
                        createSshTunnel();
                    })
                    .setNegativeButton("No", (dialog, id) -> genericSuccessDialog("Note", "You must either accept host fingerprint or disable strict host key checking from app settings"))
                    .show();
        });
    }

    // ---------------------------------------------------------------------------------------------

    @Override
    public boolean onCreateOptionsMenu(android.view.Menu menu) {
        getMenuInflater().inflate(R.menu.menu_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            startActivity(new Intent(MainActivity.this, Preferences.class));
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    // ---------------------------------------------------------------------------------------------

}
