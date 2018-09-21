import React, { PureComponent } from 'react'
import PropTypes from "prop-types";
import { Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';

import styles from './styles';

class TakePhotoScreen extends PureComponent {
    takePicture = async function (camera) {
        const data = await camera.takePictureAsync({
            fixOrientation: true,
        });
        
        this.props.onSave(data);
    }

    render() {
        var PendingView = (
            <View style={styles.pendingView}>
                <Text>Waiting</Text>
            </View>
        );

        return (
            <View style={styles.container}>
                <RNCamera
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                >
                    {({ camera, status }) => {
                        if (status !== 'READY') return PendingView;
                        return (
                            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                                    <FontAwesomeIcon name="camera" size={24} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.props.onCancel} style={styles.capture}>
                                    <MaterialIconsIcon name="cancel" size={24} />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                </RNCamera>
            </View>
        );
    }
}

TakePhotoScreen.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,    
};

export default TakePhotoScreen;