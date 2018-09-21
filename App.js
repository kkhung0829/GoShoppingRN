import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { createMaterialBottomTabNavigator  } from 'react-navigation-material-bottom-tabs';

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

export default class App extends Component {
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