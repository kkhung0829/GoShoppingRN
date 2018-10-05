import React, { PureComponent } from 'react'
import PropTypes from "prop-types";
import {
    WebView,
} from 'react-native';
import {
    Container,
    Content,
    Header,
    Body,
    Title,
    Right,
    Button,
    Icon,
} from 'native-base';

//====== Native Base Theme ======
import { StyleProvider } from 'native-base';
import getTheme from '../../../native-base-theme/components';
import myTheme from '../../../native-base-theme/variables/myTheme';

const REDIRECT_URI = 'http://localhost';
const ACCESS_TOKEN = 'access_token';

class DropBoxLoginScreen extends PureComponent {
    _loginURLHandler = (e) => {
        console.log('DropBoxLoginScreen._loginURLHandler: ' + JSON.stringify(e.nativeEvent));
        var event = e.nativeEvent;
        var token;

        // Ignore the dropbox authorize screen
        if (event.url.indexOf('oauth2/authorize') > -1)
        {
            return;
        }

        // Check the redirect uri
        if (    (event.url.indexOf(REDIRECT_URI) > -1)
            &&  (event.url.indexOf(ACCESS_TOKEN) > -1))
        {
            token = event.url.split('=')[1].split('&')[0];

            this.props.onSuccess(token);
        } else {
            this.props.onCancel();
        }
    };

    render() {
        var uri =
              'https://www.dropbox.com/1/oauth2/authorize?'
            + 'client_id=' + this.props.appKey
            + '&redirect_uri=' + REDIRECT_URI
            + '&response_type=token';

        return (
            <StyleProvider style={getTheme(myTheme)}><Container>
                <Header>
                    <Body>
                        <Title>DropBox Login</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => {
                            this.props.onCancel();
                        }}>
                            <Icon name="close" />
                        </Button>
                    </Right>
                </Header>
                    <WebView
                        source={{uri: uri}}
                        onLoadStart={this._loginURLHandler}
                    />
            </Container></StyleProvider>
        );
    }
}

DropBoxLoginScreen.propTypes = {
    appKey: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default DropBoxLoginScreen;