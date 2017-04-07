package com.pack;

import com.facebook.react.ReactActivity;
import com.amplitude.api.Amplitude;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Pack";
    }

    public void onCreate() {
        Amplitude.getInstance().initialize(this, "795768d69b064258bb17d64f3cce3566");
    }
}
