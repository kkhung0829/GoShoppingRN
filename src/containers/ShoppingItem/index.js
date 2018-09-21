import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Card,
    CardItem,
    Thumbnail,
    Text,
    Badge,
    Body,
    Left,
    Right,
    Icon,
} from 'native-base';
import { Modal } from "react-native";

import AnimateNumber from '../../components/AnimateNumber';
import ShoppingItemDetailScreen from '../../components/ShoppingItemDetailScreen';

//====== Redux ======
import { connect } from "react-redux";
import {
    shoppingItemIncUnit,
    shoppingItemDecUnit,
    shoppingItemUpdate,
    shoppingItemDel,
} from '../../reducers/ShoppingItems/actions';

class ShoppingItem extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showUpdateItemModal: false,
        };
    }

    _updateItem = (id, name, unitPrice, uri) => {
        this.setState({
            showUpdateItemModal: false
        }, () => {
            this.props.onUpdate(id, name, unitPrice, uri);
        });
    };

    _delItem = (id) => {
        this.setState({
            showUpdateItemModal: false
        }, () => {
            this.props.onDel(id);
        });
    };

    render() {
        // <Image style={{width: 56, height: 56, borderRadius: 28,}} source={{uri: this.props.uri}} />
        var uiItemPhoto = this.props.uri ?
                <Thumbnail source={{uri: this.props.uri}} />
            :   <Icon type="FontAwesome" name="photo" />;

        return (
            <Card>
                <CardItem button
                    onPress={() => {
                        this.setState({ showUpdateItemModal: true });
                    }}
                >
                    <Left>
                        {uiItemPhoto}
                    </Left>
                    <Body>
                        <Text>{this.props.name}</Text>
                        <Text>@ ${this.props.unitPrice}</Text>
                        <Text>X {this.props.numUnit}</Text>
                    </Body>
                    <Right>
                        <Badge>
                            <AnimateNumber
                                value={(this.props.unitPrice * this.props.numUnit)}
                                formatter={(val) => {
                                    return '$ ' + parseFloat(val).toFixed(1);
                                }}
                            />
                        </Badge>
                    </Right>
                </CardItem>
                <CardItem footer>
                    <Left>
                        <Button rounded small onPress={() => this.props.onIncUnit(this.props.id)}><Icon name='add' /></Button>
                    </Left>
                    <Right>
                        <Button rounded small onPress={() => this.props.onDecUnit(this.props.id)}><Icon name='remove' /></Button>
                    </Right>
                </CardItem>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showUpdateItemModal}
                    onRequestClose={() => {}}
                >
                    <ShoppingItemDetailScreen
                        id={this.props.id}
                        name={this.props.name}
                        unitPrice={this.props.unitPrice}
                        uri={this.props.uri}
                        onSave={this._updateItem}
                        onCancel={() => {
                            this.setState({ showUpdateItemModal: false });
                        }}
                        onDel={this._delItem}
                    />
                </Modal>
            </Card>
        );
    }
}

ShoppingItem.propTypes = {
    id: PropTypes.any.isRequired,
    name: PropTypes.string,
    unitPrice: PropTypes.number.isRequired,
    numUnit: PropTypes.number.isRequired,
    uri: PropTypes.string,

    onIncUnit: PropTypes.func.isRequired,
    onDecUnit: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDel: PropTypes.func.isRequired,
};

//====== Redux ======
const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIncUnit: id => {
            dispatch(shoppingItemIncUnit(id));
        },
        onDecUnit: id => {
            dispatch(shoppingItemDecUnit(id));
        },
        onUpdate: (id, name, unitPrice, uri) => {
            dispatch(shoppingItemUpdate(id, name, unitPrice, uri));
        },
        onDel: id => {
            dispatch(shoppingItemDel(id));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingItem);