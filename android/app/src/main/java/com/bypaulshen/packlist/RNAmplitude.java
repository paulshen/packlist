package com.bypaulshen.packlist;
import com.amplitude.api.Amplitude;
import android.app.Activity;
import android.app.Application;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.Map;
import java.io.*;
public class RNAmplitude extends ReactContextBaseJavaModule {
 private Activity mActivity = null;
 private Application mApplication = null;
 public RNAmplitude(ReactApplicationContext reactContext,
 Application mApplication) {
   super(reactContext);
   this.mActivity = getCurrentActivity();
   this.mApplication = mApplication;
 }
 @Override
 public String getName() {
   return "RNAmplitude";
 }

 @ReactMethod
 public void initialize(String apiKey) {
  Amplitude.getInstance().initialize(getCurrentActivity(),
  apiKey).enableForegroundTracking(this.mApplication);
 }
 @ReactMethod
 public void logEvent(String identifier, ReadableMap properties) {
   try {
      JSONObject jProperties =
      convertReadableToJsonObject(properties);
      Amplitude.getInstance().logEvent(identifier, jProperties);
   } catch (JSONException e) {
      return;
   }
 }
 @ReactMethod
 public void setUserId(String id) {
   Amplitude.getInstance().setUserId(id);
 }
 public static JSONObject convertReadableToJsonObject(ReadableMap
 map) throws JSONException {
   JSONObject jsonObj = new JSONObject();
   ReadableMapKeySetIterator it = map.keySetIterator();
   while (it.hasNextKey()) {
      String key = it.nextKey();
      ReadableType type = map.getType(key);
      switch (type) {
         case Map:
            jsonObj.put(key,
            convertReadableToJsonObject(map.getMap(key)));
            break;
         case String:
            jsonObj.put(key, map.getString(key));
            break;
         case Number:
            jsonObj.put(key, map.getString(key));
            break;
         case Boolean:
            jsonObj.put(key, map.getString(key));
            break;
         case Null:
            jsonObj.put(key, map.getString(key));
            break;
       }
   }
   return jsonObj;
 }
}
