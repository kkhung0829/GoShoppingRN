'use strict';

import { Record, List } from 'immutable';

import CouponUsage from './CouponUsage';

class CouponItem extends Record({
    id: '',
    name: '',
    numUnit: 1,
    startDateMS: null,
    endDateMS: null,
    usages: List(), // List of CouponUsage
}, 'CouponItem') {
    constructor(props) {
        super(Object.assign({}, props, {id: (props && props.id) || Math.random().toString()}));
    }
}

export { CouponItem, CouponUsage };