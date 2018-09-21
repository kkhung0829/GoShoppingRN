'use strict';

import InitialState, { ShoppingItem } from './initialState';
import { List } from 'immutable';

const {
    SHOPPING_ITEM_ADD,
    SHOPPING_ITEM_DEL,
    SHOPPING_ITEM_UPDATE,
    SHOPPING_ITEM_INC_UNIT,
    SHOPPING_ITEM_DEC_UNIT,
    SHOPPING_ITEM_CLEAR,
} = require('../actionTypes').default;

const initialState = new InitialState();

export default function(state = initialState, action) {
    switch (action.type) {
        case SHOPPING_ITEM_ADD:
            return state.updateIn(['items'], items => {
                const newItem = new ShoppingItem({
                    name: action.data.name,
                    unitPrice: action.data.unitPrice,
                    uri: action.data.uri,
                });

                return items.unshift(newItem);
            });

        case SHOPPING_ITEM_DEL:
            return state.updateIn(['items'], items => {
                return items.filter(item => {
                    return item.id !== action.data
                });
            });

        case SHOPPING_ITEM_UPDATE:
            return state.updateIn(['items'], items=> {
                return items.map(item => {
                    if (item.getIn(['id']) === action.data.id) {
                        return item.merge(action.data);
                    } else {
                        return item;
                    }
                });
            });

        case SHOPPING_ITEM_INC_UNIT:
            return state.updateIn(['items'], items => {
                return items.map(item => {
                    if (item.getIn(['id']) === action.data) {
                        return item.updateIn(['numUnit'], numUnit => {
                            return numUnit + 1;
                        });
                    } else {
                        return item;
                    }
                });
            });

        case SHOPPING_ITEM_DEC_UNIT:
            return state.updateIn(['items'], items => {
                return items.map(item => {
                    if (item.getIn(['id']) === action.data) {
                        return item.updateIn(['numUnit'], numUnit => {
                            return numUnit - 1;
                        });
                    } else {
                        return item;
                    }
                });
            });

        case SHOPPING_ITEM_CLEAR:
            return state.updateIn(['items'], items => List());
    }
    return state;
}
