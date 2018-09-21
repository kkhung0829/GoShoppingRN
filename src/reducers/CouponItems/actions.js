'user strict';

const {
    COUPON_ITEM_ADD,
    COUPON_ITEM_DEL,
    COUPON_ITEM_UPDATE,
    COUPON_ITEM_DEC_UNIT,
    COUPON_ITEM_CLEAR,
    COUPON_ITEM_SYNC_FROM_SERVER,
} = require('../actionTypes').default;

export function couponItemAdd(name, numUnit, startDateMS, endDateMS) {
    return {
        type: COUPON_ITEM_ADD,
        data: {
            name,
            numUnit,
            startDateMS,
            endDateMS,
        },
    };
}

export function couponItemDel(id) {
    return {
        type: COUPON_ITEM_DEL,
        data: id,
    };
}

export function couponItemUpdate(id, name, numUnit, startDateMS, endDateMS) {
    return {
        type: COUPON_ITEM_UPDATE,
        data: {
            id,
            name,
            numUnit,
            startDateMS,
            endDateMS,
        },
    };
}

export function couponItemDecUnit(id, numUnit) {
    return {
        type: COUPON_ITEM_DEC_UNIT,
        data: {
            id,
            numUnit,
        },
    };
}

export function couponItemClear() {
    return {
        type: COUPON_ITEM_CLEAR,
    };
}

export function couponItemSyncFromServer(items) {
    return {
        type: COUPON_ITEM_SYNC_FROM_SERVER,
        data: items,
    }
}