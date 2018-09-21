'use strict';

import InitialState, { CouponItem, CouponUsage } from './initialState';
import {
    List,
    fromJS,
} from 'immutable';

const {
    COUPON_ITEM_ADD,
    COUPON_ITEM_DEL,
    COUPON_ITEM_UPDATE,
    COUPON_ITEM_DEC_UNIT,
    COUPON_ITEM_CLEAR,
    COUPON_ITEM_SYNC_FROM_SERVER,
} = require('../actionTypes').default;

const initialState = new InitialState();

export default function(state = initialState, action) {
    switch(action.type) {
        case COUPON_ITEM_ADD:
            return state.updateIn(['items'], items => {
                const newItem = new CouponItem({
                    name: action.data.name,
                    numUnit: action.data.numUnit,
                    startDateMS: action.data.startDateMS,
                    endDateMS: action.data.endDateMS,
                });

                return items.push(newItem);
            });
        
        case COUPON_ITEM_DEL:
            return state.updateIn(['items'], items => {
                return items.filter(item => {
                    return item.id !== action.data
                });
            });

        case COUPON_ITEM_UPDATE:
            return state.updateIn(['items'], items => {
                return items.map(item => {
                    if (item.getIn(['id']) === action.data.id) {
                        return item.merge(action.data);
                    } else {
                        return item;
                    }
                });
            });

        case COUPON_ITEM_DEC_UNIT:
            return state.updateIn(['items'], items => {
                return items.map(item => {
                    if (item.getIn(['id']) === action.data.id) {
                        var newItem = item.updateIn(['numUnit'], numUnit => {
                            return numUnit - action.data.numUnit;
                        }).updateIn(['usages'], usages => {
                            const newUsage = new CouponUsage({
                                usageDateMS: (new Date()).getTime(),
                                numUnit: action.data.numUnit,
                            });

                            return usages.unshift(newUsage);
                        });
                        console.log(newItem);
                        return newItem;
                    } else {
                        return item;
                    }
                });
            });

        case COUPON_ITEM_CLEAR:
            return state.updateIn(['items'], items => List());

        case COUPON_ITEM_SYNC_FROM_SERVER:
            return state.updateIn(['items'], items => {
                var newItemsJSON = action.data;
                var temp = [];

                for (var i = 0; i < newItemsJSON.length; i++) {
                    var newItemJSON = newItemsJSON[i];
                    var usages = [];

                    for (var j = 0; j < newItemJSON.usages.length; j++) {
                        usages.push(new CouponUsage(newItemJSON.usages[j]));
                    }
                    const newItemRecord = new CouponItem({
                        ...newItemJSON,
                        usages: List(usages),
                    });
    
                    temp.push(newItemRecord);
                }
                return List(temp);
            })
    }
    return state;
}