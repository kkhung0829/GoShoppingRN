import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import { List as ImmutableList } from 'immutable';
import {
    Container,
    Header,
    Body,
    Title,
    Right,
    Content,
    Footer,
    FooterTab,
    Button,
    Icon,
} from 'native-base';
import { Modal, Alert } from "react-native";
import * as Animatable from 'react-native-animatable';

import AnimateNumber from '../../components/AnimateNumber';
import ShoppingItemList from '../ShoppingItemList';
import ShoppingItemDetailScreen from '../../components/ShoppingItemDetailScreen';

//====== Redux ======
import { connect } from "react-redux";
import {
    shoppingItemAdd,
    shoppingItemClear,
} from '../../reducers/ShoppingItems/actions';

class ShoppingScreen extends PureComponent {
    static navigationOptions = {
        title: 'Shopping',
        tabBarIcon: <Icon name='cash' />
    };

    constructor(props) {
        super(props);

        this.state = {
            showCreateItemModel: false,
        };
    }

    _shoppingItemListView = null;

    _saveNewItem = (id, name, unitPrice, uri) => {
        this.props.addItem(name, unitPrice, uri);
        this.setState({ showCreateItemModel: false });
    };

    _doClearAllItem = () => {
        this._shoppingItemListView.rubberBand().then(endState => {
            this.props.shoppingItemClear();
        });
    };

    _clearAllItem = () => {
        Alert.alert(
            'Confirmation',
            'Confirm to clear all items ?',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'OK', onPress: () => this._doClearAllItem() },
            ]
        );       
    };

    render() {
        let totalPrice = this.props.items.reduce((acc, item) => {
            return acc + item.unitPrice * item.numUnit;
        }, 0.0);

        return (
            <Container>
                <Header>
                    <Body>
                        <AnimateNumber
                            value={totalPrice}
                            formatter={(val) => {
                                return 'Total $' + parseFloat(val).toFixed(1);
                            }}
                            render={(displayValue) => (
                                <Title>{displayValue}</Title>
                            )}
                        />
                    </Body>
                    <Right>
                        <Button transparent onPress={this._clearAllItem}>
                            <Icon name="trash" />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <Animatable.View animation="fadeIn"
                        ref={(ref) => {
                            this._shoppingItemListView = ref;
                        }}
                    >
                        <ShoppingItemList />
                    </Animatable.View>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.showCreateItemModel}
                        onRequestClose={() => {}}
                    >
                        <ShoppingItemDetailScreen
                            onSave={this._saveNewItem}
                            onCancel={() => {
                                this.setState({ showCreateItemModel: false });
                            }}
                        />
                    </Modal>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button
                            onPress={() => {
                                this.setState({ showCreateItemModel: true });
                            }}
                        >
                            <Icon name="add" />
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

ShoppingScreen.propTypes = {
    items: PropTypes.instanceOf(ImmutableList).isRequired,
    addItem: PropTypes.func.isRequired,
    shoppingItemClear: PropTypes.func.isRequired,
};

//====== Redux ======
const mapStateToProps = state => {
    return {
        items: state.shopping.getIn(['items']),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addItem: (name, unitPrice, uri) => {
            dispatch(shoppingItemAdd(name, unitPrice, uri));
        },
        shoppingItemClear: () => {
            dispatch(shoppingItemClear());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingScreen);