package com.nitramite.openintelligence;

import android.webkit.WebView;
import android.webkit.WebViewClient;

public class WebViewController extends WebViewClient {

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        view.loadUrl(url);
        return true;
    }

}
