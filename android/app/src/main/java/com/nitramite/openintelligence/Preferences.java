package com.nitramite.openintelligence;

import android.Manifest;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.preference.EditTextPreference;
import android.preference.Preference;
import android.preference.PreferenceManager;
import android.preference.SwitchPreference;
import android.support.v4.app.ActivityCompat;
import android.widget.Toast;

import com.nitramite.ui.FileDialog;

import java.io.File;

public class Preferences extends com.fnp.materialpreferences.PreferenceActivity {

    // Variables
    private SharedPreferences sharedPreferences;

    // App camera permissions
    private static final int READ_EXTERNAL_STORAGE_REQUEST_CODE = 2;
    private final String permissionReadStorage = Manifest.permission.READ_EXTERNAL_STORAGE;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        MyPreferenceFragment myPreferenceFragment = new MyPreferenceFragment();
        setPreferenceFragment(myPreferenceFragment);

        // Shared preferences
        sharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);

        // Activity result back to menu
        setResult(RESULT_OK, null);

        // Exec pending transactions
        myPreferenceFragment.getFragmentManager().executePendingTransactions();


        // Find preference views
        final Preference sshPrivateKeyFileLocationEditTextPreference = myPreferenceFragment.findPreference(Constants.SP_SSH_PRIVATE_KEY_FILE_LOCATION);


        sshPrivateKeyFileLocationEditTextPreference.setOnPreferenceClickListener(preference -> {
            if (hasPermissions(Preferences.this, new String[]{permissionReadStorage})) {
                File mPath = new File(Environment.getExternalStorageDirectory() + "//DIR//");
                final FileDialog fileDialog = new FileDialog(Preferences.this, mPath, "");
                fileDialog.addFileListener(file -> {
                    Toast.makeText(Preferences.this, "Saving path: " + file.toString(), Toast.LENGTH_SHORT).show();
                    SharedPreferences setSharedPreferences = PreferenceManager.getDefaultSharedPreferences(getBaseContext());
                    SharedPreferences.Editor editor = setSharedPreferences.edit();
                    editor.putString(Constants.SP_SSH_PRIVATE_KEY_FILE_LOCATION, file.toString());
                    editor.apply();
                });
                fileDialog.showDialog();
            } else {
                ActivityCompat.requestPermissions(Preferences.this, new String[]{permissionReadStorage}, READ_EXTERNAL_STORAGE_REQUEST_CODE);
            }
            return true;
        });

    }

    public static class MyPreferenceFragment extends com.fnp.materialpreferences.PreferenceFragment {
        @Override
        public int addPreferencesFromResource() {
            return R.xml.preferences; // Your preference file
        }
    }


    // Check for required permissions
    private static boolean hasPermissions(Context context, String[] permissions) {
        if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && context != null && permissions != null) {
            for (String permission : permissions) {
                if (ActivityCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                    return false;
                }
            }
        }
        return true;
    }


} // End of class