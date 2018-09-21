'use strict';
// import { combineReducers } from 'redux-immutable';
import { combineReducers } from 'redux';

import shoppingItemsReducer from './ShoppingItems/reducer';
import ShoppingItemsInitialState, { ShoppingItem } from './ShoppingItems/initialState';
import couponItemsReducer from './CouponItems/reducer';
import CouponItemsInitialState, { CouponItem, CouponUsage } from './CouponItems/initialState';
import dropBoxReducer from './DropBox/reducer';
import DropBoxInitialState from './DropBox/initialState';

const rootInitialState = {
    shopping: new ShoppingItemsInitialState(),
    coupons: new CouponItemsInitialState(),
    dropbox: new DropBoxInitialState(),
};

const reducer = combineReducers({
    shopping: shoppingItemsReducer,
    coupons: couponItemsReducer,
    dropbox: dropBoxReducer,
});

export { rootInitialState, ShoppingItemsInitialState, ShoppingItem, CouponItemsInitialState, CouponItem, CouponUsage, DropBoxInitialState};
export default reducer;