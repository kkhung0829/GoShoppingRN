import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List as ImmutableList } from 'immutable';
import {
    List,
    Button,
    Icon,
} from 'native-base';
import { ListView, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';

import ShoppingItem from '../ShoppingItem';

//====== Redux ======
import { connect } from "react-redux";
import {
    shoppingItemDel,
} from '../../reducers/ShoppingItems/actions';

class ShoppingItemList extends PureComponent {
    _itemViewMap = new Map();

    _onDelItem = (item) => {
        var itemView = this._itemViewMap.get(item);

        itemView.rubberBand().then(endState => {
            itemView.bounceOutRight().then(endState => {
                this.props.shoppingItemDel(item.id);
            });
        });
    };

    _formatDataSourceRows = (items) => {
        var rows = {};

        items.forEach((item) => {
            rows[item.id] = item;
        });    
        return rows;
    };

    _ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
    });

    render() {
        this._ds = this._ds.cloneWithRows(this._formatDataSourceRows(this.props.items));
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
                        <ShoppingItem
                            id={item.id}
                            name={item.name}
                            unitPrice={item.unitPrice}
                            numUnit={item.numUnit}
                            uri={item.uri}
                        />
                    </Animatable.View>
                }
                renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                    <Button danger onPress={() => {
                        rowMap[`${secId}${rowId}`].props.closeRow();
                        Alert.alert(
                            'Confirmation',
                            'Confirm to delete item [' + data.name + '] ?',
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

ShoppingItemList.propTypes = {
    items: PropTypes.instanceOf(ImmutableList).isRequired,
    shoppingItemDel: PropTypes.func.isRequired,
};

//====== Redux ======
const mapStateToProps = state => {
    return {
        items: state.shopping.getIn(['items']),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        shoppingItemDel: id => {
            dispatch(shoppingItemDel(id));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingItemList);