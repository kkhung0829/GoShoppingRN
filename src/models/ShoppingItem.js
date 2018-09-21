'use strict';

import { Record } from 'immutable';

class ShoppingItem extends Record({
    id: '',
    name: '',
    unitPrice: 0.0,
    numUnit: 1,
    uri: null,
}, 'ShoppingItem') {
    constructor(props) {
        super(Object.assign({}, props, {id: (props && props.id) || Math.random().toString()}));
    }
}

export default ShoppingItem;