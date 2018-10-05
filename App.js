import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { createMaterialBottomTabNavigator  } from 'react-navigation-material-bottom-tabs';
import codePush from "react-native-code-push";
import { Toast } from 'native-base';
import VersionNumber from 'react-native-version-number';

import { Root } from "native-base";

import createReduxStore from './src/lib/configureStore';
import ShoppingScreen from './src/containers/ShoppingScreen';
import CouponsScreen from './src/containers/CouponsScreen';

const RootStack = createMaterialBottomTabNavigator (
  {
    Shopping: { screen: ShoppingScreen },
    Coupons: { screen: CouponsScreen },
  },
  {
    initialRouteName: 'Shopping',
    shifting: true,
  }
);

class App extends Component {
  componentDidMount() {
    setTimeout(function() {
      Toast.show({
        text: "Version: " + VersionNumber.appVersion + "-" + VersionNumber.buildVersion,
        buttonText: "Okay",
        type: "success",
        duration: 1000,
      });

      // Check if there is currently a CodePush update running
      codePush.getUpdateMetadata().then((update) => {
        if (update) {
          console.log('[=== Code Push ===] Current Package Info: ' + JSON.stringify(update));
        }
      });

      // Check to see if there is still an update pending.
      codePush.getUpdateMetadata(codePush.UpdateState.PENDING).then((update) => {
        if (update) {
          console.log('[=== Code Push ===] PENDING Package Info: ' + JSON.stringify(update));
        }
      });
    }, 1000);

  }

  codePushStatusDidChange(status) {
    switch(status) {
        case codePush.SyncStatus.CHECKING_FOR_UPDATE:
            console.log("[=== Code Push ===] Checking for updates.");
            break;
        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            console.log("[=== Code Push ===] Downloading package.");
            break;
        case codePush.SyncStatus.INSTALLING_UPDATE:
            console.log("[=== Code Push ===] Installing update.");
            break;
        case codePush.SyncStatus.UP_TO_DATE:
            console.log("[=== Code Push ===] Up-to-date.");
            break;
        case codePush.SyncStatus.UPDATE_INSTALLED:
            console.log("[=== Code Push ===] Update installed.");
            break;
      }
  }

  codePushDownloadDidProgress(progress) {
      console.log("[=== Code Push ===] " + progress.receivedBytes + " of " + progress.totalBytes + " received.");
  }

  render() {
    const {store, persistor} = createReduxStore();

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Root>
            <RootStack />
          </Root>
        </PersistGate>
      </Provider>
    );
  }
}

export default codePush(App);