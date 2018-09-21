'use strict';

import { Record, List } from 'immutable';
import ShoppingItem from '../../models/ShoppingItem';

const InitialState = Record({
    items: List(),  // <ShoppingItem>
}, 'ShoppingItemsInitialState');

export { ShoppingItem };
export default InitialState;