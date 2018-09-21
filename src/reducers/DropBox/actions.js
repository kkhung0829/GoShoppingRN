'use strict';

const {
    DROPBOX_SET_ACCESS_TOKEN,
} = require('../actionTypes').default;

import {
    downloadJSON,
    uploadJSON,
} from '../../lib/dropboxHelper';

export function dropboxSetAccessToken(accessToken) {
    return {
        type: DROPBOX_SET_ACCESS_TOKEN,
        data: accessToken,
    };
}