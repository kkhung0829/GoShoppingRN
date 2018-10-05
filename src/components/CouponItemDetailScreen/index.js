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
    DatePicker,
} from 'native-base';
import { Alert } from "react-native";

//====== Native Base Theme ======
import { StyleProvider } from 'native-base';
import getTheme from '../../../native-base-theme/components';
import myTheme from '../../../native-base-theme/variables/myTheme';

function isDefinedAndNotNull(val) {
    return val !== undefined && val !== null;
}

class CouponItemDetailScreen extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            name: isDefinedAndNotNull(props.name) ? props.name : '',
            numUnit: isDefinedAndNotNull(props.numUnit) ? props.numUnit.toString() : '1',
            startDateMS: isDefinedAndNotNull(props.startDateMS) ? props.startDateMS : (new Date()).setHours(0, 0, 0, 0),
            endDateMS: isDefinedAndNotNull(props.endDateMS) ? props.endDateMS : (new Date()).setHours(0, 0, 0, 0),
        }
    }

    render() {
        var uiHeader4New = (
            <Header>
                <Body>
                    <Title>New Coupon</Title>
                </Body>
                <Right>
                </Right>
            </Header>
        );

        var uiHeader4Edit = (
            <Header>
                <Body>
                    <Title>Edit Coupon</Title>
                </Body>
                <Right>
                    <Button transparent onPress={() => {
                        Alert.alert(
                            'Confirmation',
                            'Confirm to delete coupon [' + this.state.name + '] ?',
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
                            <Label>Num Unit</Label>
                            <Input
                                value={this.state.numUnit}
                                onChangeText={(text) => this.setState({numUnit: text})}
                            />
                        </Item>
                        <Item stackedLabel>
                            <Label>Start</Label>
                            <DatePicker
                                defaultDate={ new Date(this.state.startDateMS) }
                                onDateChange={
                                    (newDate) => this.setState({startDateMS: (new Date(newDate)).setHours(0, 0, 0, 0)})
                                }
                            />
                        </Item>
                        <Item stackedLabel>
                            <Label>End</Label>
                            <DatePicker
                                defaultDate={ new Date(this.state.endDateMS) }
                                onDateChange={
                                    (newDate) => this.setState({endDateMS: (new Date(newDate)).setHours(0, 0, 0, 0)})
                                }
                            />
                        </Item>
                    </Form>
                </Content>
                <Footer><FooterTab>
                    <Button
                        onPress={
                            () => this.props.onSave(
                                this.state.id,
                                this.state.name,
                                Number(this.state.numUnit),
                                Number(this.state.startDateMS),
                                Number(this.state.endDateMS))
                        }
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

CouponItemDetailScreen.propTypes = {
    id: PropTypes.any,
    name: PropTypes.string,
    numUnit: PropTypes.number,
    startDateMS: PropTypes.number,
    endDateMS: PropTypes.number,

    onDel: PropTypes.func,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default CouponItemDetailScreen;