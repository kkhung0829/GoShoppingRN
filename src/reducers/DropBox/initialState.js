'use strict';

import { Record } from '../../../node_modules/immutable';

const InitialState = Record({
    accessToken: null,
}, 'DropBoxInitialState');

export default InitialState;