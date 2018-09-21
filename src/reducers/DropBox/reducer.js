'use strict';

import InitialState from './initialState';

const {
    DROPBOX_SET_ACCESS_TOKEN,
} = require('../actionTypes').default;

const initialState = new InitialState();

export default function(state = initialState, action) {
    switch (action.type) {
        case DROPBOX_SET_ACCESS_TOKEN:
            return state.updateIn(['accessToken'], accessToken => {
                return action.data;
            });
    }
    return state;
}
