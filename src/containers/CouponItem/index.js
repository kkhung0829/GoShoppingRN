import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { List as ImmutableList } from 'immutable';
import {
    Card,
    CardItem,
    Body,
    Right,
    Text,
    Badge,
    Button,
    Icon,
} from 'native-base';
import { Modal, Alert } from "react-native";
import moment from 'moment';
import Prompt from 'react-native-input-prompt';

import AnimateNumber from '../../components/AnimateNumber';
import CouponItemDetailScreen from '../../components/CouponItemDetailScreen';

//====== Redux ======
import { connect } from "react-redux";
import {
    couponItemDecUnit,
    couponItemUpdate,
    couponItemDel,
} from '../../reducers/CouponItems/actions';

class CouponItem extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showUpdateItemModal: false,
            showDecNumUnitPrompt: false,
            showUsages: false,
        };
    }

    _updateItem = (id, name, numUnit, startDateMS, endDateMS) => {
        this.setState({
            showUpdateItemModal: false,
        }, () => {
            this.props.couponItemUpdate(id, name, numUnit, startDateMS, endDateMS);
        });
    };

    _delItem = (id) => {
        this.setState({
            showUpdateItemModal: false,
        }, () => {
            this.props.couponItemDel(id);
        });
    };

    render() {
        var guiItemStatus;

        switch (this.props.type) {
            case 'expired':
            case 'current':
                guiItemStatus = (
                    <Text>Expiry in: {moment(this.props.endDateMS).fromNow(true)} - {moment(this.props.endDateMS).format('ll')}</Text>
                );
                break;
                
            case 'future':
                guiItemStatus = (
                    <Text>Start in: {moment(this.props.startDateMS).fromNow(true)} - {moment(this.props.startDateMS).format('ll')}</Text>
                );
                break;

            default:
                guiItemStatus = (
                    <Text>Unknown Status</Text>
                );
                break;
        }

        var guiUsages = [];
        this.props.usages.forEach((usage) => {
            guiUsages.push(
                <CardItem key={usage.usageDateMS}>
                    <Body><Text>{moment(usage.usageDateMS).format('ll')}</Text></Body>
                    <Right><Badge info><Text>{usage.numUnit}</Text></Badge></Right>
                </CardItem>
            );
        });

        return (
            <Card>
                <CardItem button
                    onPress={() => {
                        this.setState({ showUpdateItemModal: true });
                    }}
                >
                    <Body>
                        <Text>{this.props.name}</Text>
                        {guiItemStatus}
                    </Body>
                    <Right style={{flex:0, flexDirection: "row"}}>
                        <Badge info>
                            <AnimateNumber
                                value={this.props.numUnit}
                                formatter={(val) => parseFloat(val).toFixed(0)}
                            />
                        </Badge>
                        <Text> </Text>
                        <Button rounded small
                            onPress={() => {
                                this.setState({ showDecNumUnitPrompt: true });
                            }}
                        >
                            <Icon name='remove' />
                        </Button>
                    </Right>
                </CardItem>
                { this.props.usages.size > 0 &&
                    <Button iconRight small
                        onPress={() => this.setState({showUsages: !this.state.showUsages})}
                    >
                        <Text>Usages</Text>
                        {
                            this.state.showUsages ?
                                <Icon name="arrow-dropup" />
                                : <Icon name="arrow-dropdown" />
                        }
                    </Button>
                }
                { this.state.showUsages && guiUsages }
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showUpdateItemModal}
                    onRequestClose={() => {}}
                >
                    <CouponItemDetailScreen
                        id={this.props.id}
                        name={this.props.name}
                        numUnit={this.props.numUnit}
                        startDateMS={this.props.startDateMS}
                        endDateMS={this.props.endDateMS}
                        onSave={this._updateItem}
                        onCancel={() => {
                            this.setState({ showUpdateItemModal: false });
                        }}
                        onDel={this._delItem}
                    />
                </Modal>
                <Prompt
                    visible={this.state.showDecNumUnitPrompt}
                    title="How many coupons used ?"
                    onCancel={() => this.setState({ showDecNumUnitPrompt: false })}
                    onSubmit={text => {
                        var numCouponDec = Number(text);

                        if ((numCouponDec <= 0) || (numCouponDec > this.props.numUnit)) {
                            Alert.alert(
                                'Invalid Value!!!',
                                'The number of coupons used must be between 0 and ' + this.props.numUnit + ' only',
                                [
                                    { text: 'OK', onPress: () => {} },
                                ]
                            );
                        } else {
                            this.setState({
                                showDecNumUnitPrompt: false,
                            }, () => {
                                this.props.couponItemDecUnit(
                                    this.props.id,
                                    numCouponDec);
                            });
                        }
                    }}
                />
            </Card>
        );
    }
}

CouponItem.propTypes = {
    type: PropTypes.oneOf(['expired', 'current', 'future']),
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    numUnit: PropTypes.number.isRequired,
    startDateMS: PropTypes.number.isRequired,
    endDateMS: PropTypes.number.isRequired,
    usages: PropTypes.instanceOf(ImmutableList).isRequired,
};

//====== Redux ======
const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        couponItemDecUnit: (id, numUnit) =>
            dispatch(couponItemDecUnit(id, numUnit)),

        couponItemUpdate: (id, name, numUnit, startDateMS, endDateMS) =>
            dispatch(couponItemUpdate(id, name, numUnit, startDateMS, endDateMS)),
        
        couponItemDel: (id) =>
            dispatch(couponItemDel(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CouponItem);