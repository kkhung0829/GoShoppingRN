'use strict';

import { Record, List } from 'immutable';
import { CouponItem, CouponUsage } from '../../models/CouponItem';

const InitialState = Record({
    items: List(), // <CouponItem>
}, 'CouponItemsInitialState');

export { CouponItem, CouponUsage };
export default InitialState;