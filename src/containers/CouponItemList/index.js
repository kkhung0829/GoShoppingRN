import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { List as ImmutableList } from 'immutable';
import {
    List,
    Button,
    Icon,
} from 'native-base';
import { ListView, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';

import CouponItem from '../CouponItem';

//====== Redux ======
import { connect } from "react-redux";
import {
    couponItemDel,
} from '../../reducers/CouponItems/actions';

class CouponItemList extends PureComponent {
    _itemViewMap = new Map();
    
    _onDelItem = (item) => {
        var itemView = this._itemViewMap.get(item);

        itemView.rubberBand().then(endState => {
            itemView.bounceOutRight().then(endState => {
                this.props.couponItemDel(item.id);
            });
        });
    };

    static isWantedItem(type, item) {
        var earlyMorning4TodayMS = (new Date()).setHours(0, 0, 0, 0);
        var earlyMorning4TomorrowMS = earlyMorning4TodayMS + 24*60*60*1000;

        switch (type) {
            case 'expired':
                // end date < Today early morning
                return (item.endDateMS < earlyMorning4TodayMS);

            case 'current':
                // start date < tomorrow early morning
                // end date >= today early morning
                return (    (item.startDateMS < earlyMorning4TomorrowMS)
                        &&  (item.endDateMS >= earlyMorning4TodayMS));

            case 'future':
                // start date >= tomorrow early morning
                return (item.startDateMS >= earlyMorning4TomorrowMS);

            default:
                return true;
        }
    };

    static formatDataSourceRows(type, items) {
        var temp = [];
        var rows = {};
        var i;

        items.forEach((item) => {
            if (this.isWantedItem(type, item)) {
                temp.push(item);
            }
        });

        temp.sort((a, b) => {
            switch (type) {
                case 'expired':
                    // end date asc
                    return a.endDateMS - b.endDateMS;
    
                case 'current':
                    // end date asc
                    return a.endDateMS - b.endDateMS;

                case 'future':
                    // start date asc
                    return a.startDateMS - b.startDateMS;
    
                default:
                    return 0;
            }
    
        });

        for (i = 0; i < temp.length; i++) {
            rows[temp[i].id] = temp[i];
        }

        return rows;
    };

    static countNumItem(type, items) {
        var result = 0;

        items.forEach((item) => {
            if (this.isWantedItem(type, item)) {
                result++;
            }
        });
        
        return result;
    }

    _ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
    });

    render() {
        this._ds = this._ds.cloneWithRows(this.constructor.formatDataSourceRows(this.props.type, this.props.items));
        return (
            <List
                rightOpenValue={-75}
                dataSource={this._ds}
                renderRow={item =>
                    <Animatable.View key={item.id} animation="fadeIn"
                        ref={(ref) => {
                            this._itemViewMap.set(item, ref);
                        }}
                    >
                        <CouponItem
                            type={this.props.type}
                            id={item.id}
                            name={item.name}
                            numUnit={item.numUnit}
                            startDateMS={item.startDateMS}
                            endDateMS={item.endDateMS}
                            usages={item.usages}
                        />
                    </Animatable.View>
                }
                renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                    <Button danger onPress={() => {
                        rowMap[`${secId}${rowId}`].props.closeRow();
                        Alert.alert(
                            'Confirmation',
                            'Confirm to delete coupon [' + data.name + '] ?',
                            [
                                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                                { text: 'OK', onPress: () => this._onDelItem(data) },
                            ]
                        );
                    }}>
                        <Icon active name="trash" />
                    </Button>
                }
                disableRightSwipe={true}
            />
        );
    }
}

CouponItemList.propTypes = {
    type: PropTypes.oneOf(['expired', 'current', 'future']),
    items: PropTypes.instanceOf(ImmutableList).isRequired,
    couponItemDel: PropTypes.func.isRequired,
};

//====== Redux ======
const mapStateToProps = state => {
    return {
        items: state.coupons.getIn(['items']),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        couponItemDel: id => {
            dispatch(couponItemDel(id));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CouponItemList);