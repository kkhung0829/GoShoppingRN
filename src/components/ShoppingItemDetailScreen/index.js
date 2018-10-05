import React, { PureComponent } from 'react'
import PropTypes from "prop-types";
import {
    Container,
    Content,
    Header,
    Body,
    Title,
    Right,
    Form,
    Item,
    Input,
    Label,
    Footer,
    FooterTab,
    Button,
    Text,
    Icon,
    Card,
    CardItem,
} from 'native-base';
import { Modal, Image, Alert } from "react-native";
import CameraRollPicker from 'react-native-camera-roll-picker';

import TakePhotoScreen from '../TakePhotoScreen';

//====== Native Base Theme ======
import { StyleProvider } from 'native-base';
import getTheme from '../../../native-base-theme/components';
import myTheme from '../../../native-base-theme/variables/myTheme';

function isDefinedAndNotNull(val) {
    return val !== undefined && val !== null;
}

class ShoppingItemDetailScreen extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            name: isDefinedAndNotNull(props.name) ? props.name : '',
            unitPrice: isDefinedAndNotNull(props.unitPrice) ? props.unitPrice.toString() : '0.0',
            uri: isDefinedAndNotNull(props.uri) ? props.uri : null,

            showCameraModal: false,
            showCameraRollPickerModal: false,
        };
    }

    _updatePhotoFromCamera = (data) => {
        this.setState({
            uri: data.uri,
            showCameraModal: false,
        });
    }

    _updatePhotoFromCameraRoll = (selected, image) => {
        this.setState({
            uri: image.uri,
            showCameraRollPickerModal: false,
        });
    }

    render() {
        var uiHeader4New = (
            <Header>
                <Body>
                    <Title>New Item</Title>
                </Body>
                <Right>
                </Right>
            </Header>
        );

        var uiHeader4Edit = (
            <Header>
                <Body>
                    <Title>Edit Item</Title>
                </Body>
                <Right>
                    <Button transparent onPress={() => {
                        Alert.alert(
                            'Confirmation',
                            'Confirm to delete item [' + this.state.name + '] ?',
                            [
                                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                                { text: 'OK', onPress: () => this.props.onDel(this.state.id) },
                            ]
                        );
                    }}>
                        <Icon name="trash" />
                    </Button>
                </Right>
            </Header>
        );

        var uiItemImage = this.state.uri ?
                <Image source={{uri: this.state.uri}} resizeMode="contain" style={{height: 200, width: null, flex: 1}}/>
            :   <Icon type="FontAwesome" name="photo" />;

        return (
            <StyleProvider style={getTheme(myTheme)}><Container>
                {this.props.id ? uiHeader4Edit : uiHeader4New}
                <Content>
                    <Form>
                        <Item stackedLabel>
                            <Label>Name</Label>
                            <Input
                                value={this.state.name}
                                onChangeText={(text) => this.setState({name: text})}
                            />
                        </Item>
                        <Item stackedLabel>
                            <Label>Unit Price</Label>
                            <Input
                                value={this.state.unitPrice}
                                onChangeText={(text) => this.setState({unitPrice: text})}
                            />
                        </Item>
                    </Form>
                    <Card>
                        <CardItem cardBody>
                            {uiItemImage}
                        </CardItem>
                        <CardItem>
                            <FooterTab>
                                <Button vertical onPress={() => this.setState({showCameraModal: true})}>
                                    <Icon type="FontAwesome" name="camera" />
                                    <Text>Camera</Text>
                                </Button>
                                <Button vertical onPress={() => this.setState({showCameraRollPickerModal: true})}>
                                    <Icon type="MaterialIcons" name="camera-roll" />
                                    <Text>Camera Roll</Text>
                                </Button>
                            </FooterTab>
                        </CardItem>
                    </Card>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.showCameraModal}
                        onRequestClose={() => {}}
                    >
                        <TakePhotoScreen
                            onSave={this._updatePhotoFromCamera}
                            onCancel={() => this.setState({showCameraModal: false})}
                        />
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.showCameraRollPickerModal}
                        onRequestClose={() => {}}
                    >
                        <CameraRollPicker
                            selectSingleItem={true}
                            callback={this._updatePhotoFromCameraRoll}
                        />
                    </Modal>
                </Content>
                <Footer><FooterTab>
                    <Button
                        onPress={() => this.props.onSave(this.state.id, this.state.name, Number(this.state.unitPrice), this.state.uri)}
                    >
                        <Text>Save</Text>
                    </Button>
                    <Button
                        onPress={this.props.onCancel}
                    >
                        <Text>Cancel</Text>
                    </Button>
                </FooterTab></Footer>
            </Container></StyleProvider>
        );
    }
}

ShoppingItemDetailScreen.propTypes = {
    id: PropTypes.any,
    name: PropTypes.string,
    unitPrice: PropTypes.number,
    uri: PropTypes.string,

    onDel: PropTypes.func,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default ShoppingItemDetailScreen;