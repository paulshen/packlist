package com.bypaulshen.packlist;
import android.app.Activity;
import android.app.Application;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.*;
import java.io.*;
public class RNAmplitudePackage implements ReactPackage {
   private Application mApplication = null;
   public RNAmplitudePackage(Application application) {
      mApplication = application;
   }

   @Override
   public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
      List<NativeModule> modules = new ArrayList<>();
      modules.add(new RNAmplitude(reactContext, this.mApplication));
      return modules;
   }
   @Override
   public List<Class<? extends JavaScriptModule>> createJSModules()
   {
        return Collections.emptyList();
   }
   @Override
   public List<ViewManager> createViewManagers(ReactApplicationContext reactContext)
   {
        return Collections.emptyList();
    }
}
