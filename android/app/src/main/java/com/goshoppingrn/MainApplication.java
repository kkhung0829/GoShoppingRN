package com.goshoppingrn;

import android.app.Application;
import android.os.Build;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.microsoft.codepush.react.CodePush;
import com.reactlibrary.RNCalendarUtilPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfs.RNFSPackage;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      Log.d("MainApplication", "CODEPUSH.KEY: " + BuildConfig.CODEPUSH_KEY);

      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeConfigPackage(),
            new RNVersionNumberPackage(),
            new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
            new RNCalendarUtilPackage(),
            new RNFetchBlobPackage(),
            new VectorIconsPackage(),
            new RNFSPackage(),
            new RNCameraPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
