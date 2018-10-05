import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import { List as ImmutableList } from 'immutable';
import {
    Container,
    Header,
    Body,
    Title,
    Left,
    Right,
    Content,
    Button,
    Icon,
    Text,
    Badge,
    Card,
    CardItem,
    Fab,
    Spinner,
    Toast,
    View,
} from 'native-base';
import moment from 'moment';
import { Modal, Alert, LayoutAnimation } from "react-native";
import * as Animatable from 'react-native-animatable';
import RNCalendarUtil from 'react-native-calendar-util';
import * as Progress from 'react-native-progress';

import AnimateNumber from '../../components/AnimateNumber';
import CouponItemList from '../CouponItemList';
import CouponItemDetailScreen from '../../components/CouponItemDetailScreen';
import DropBoxLoginScreen from '../../components/DropBoxLoginScreen';
import * as dropBoxHelper from '../../lib/dropboxHelper';

//====== Redux ======
import { connect } from "react-redux";
import {
    couponItemAdd,
    couponItemClear,
    couponItemSyncFromServer,
} from '../../reducers/CouponItems/actions';
import {
    dropboxSetAccessToken,
} from '../../reducers/DropBox/actions';

//====== Native Base Theme ======
import { StyleProvider } from 'native-base';
import getTheme from '../../../native-base-theme/components';
import myTheme from '../../../native-base-theme/variables/myTheme';

const COUPONS_FILE_PATH = '/coupons.rn.json';
const CALENDAR_NAME = "GoShopping-Coupons.rn";
const CALENDAR_EVENT_LOCATION = CALENDAR_NAME;

class CouponsScreen extends PureComponent {
    static navigationOptions = {
        title: 'Coupons',
        tabBarIcon: <Icon name='card' />
    };

    constructor(props) {
        super(props);

        this.state = {
            isActionButtonVisible: true,
            showCreateItemModel: false,
            showDropBoxLoginModal: false,
            activeDropBoxFAB: false,
            activeCalendarFAB: false,
            login4UploadToDropBox: false,
            isBusy: false,
            isInProgress: false,
            progressHeader: '',
            progress: 0.0,
        };
    }

    couponItemListView = null;

    _saveNewItem = (id, name, numUnit, startDateMS, endDateMS) => {
        this.props.couponItemAdd(name, numUnit, startDateMS, endDateMS);
        this.setState({ showCreateItemModel: false });
    };

    _doClearAllItem = () => {
        this.couponItemListView.rubberBand().then(endState => {
            this.props.couponItemClear();
        });
    };

    _clearAllItem = () => {
        Alert.alert(
            'Confirmation',
            'Confirm to clear all coupons ?',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'OK', onPress: () => this._doClearAllItem() },
            ]
        );
    };

    _dropBoxLoginSuccess = (accessToken) => {
        this.setState({ showDropBoxLoginModal: false });
        this.props.dropboxSetAccessToken(accessToken);

        if (this.state.login4UploadToDropBox) {
            this._doUploadJSON(accessToken);
        } else {
            this._doDownloadJSON(accessToken);
        }
    };

    _dropBoxLoginCancel = () => {
        this.setState({ showDropBoxLoginModal: false });
        Toast.show({
            text: "Failed to login Drop Box!!!",
            buttonText: "Okay",
            type: "danger",
            duration: 3000
        });
    }

    _doUploadJSON = (accessToken) => {
        this.setState({
            isBusy: true,
        });

        dropBoxHelper.uploadJSON(accessToken, COUPONS_FILE_PATH, this.props.items.toJSON())
            .then(() => {
                Toast.show({
                    text: "Sync to DropBox Complete",
                    buttonText: "Okay",
                    type: "success",
                    duration: 3000,
                });
            })
            .catch((err) => {
                console.warn(err);

                Toast.show({
                    text: "Sync to DropBox Failed",
                    buttonText: "Okay",
                    type: "danger",
                    duration: 3000,
                });
            })
            .finally(() => {
                this.setState({ isBusy: false});
            });
    };

    _doDownloadJSON = (accessToken) => {
        this.setState({
            isBusy: true,
        });

        dropBoxHelper.downloadJSON(accessToken, COUPONS_FILE_PATH)
            .then(data => {
                this.props.couponItemSyncFromServer(data);

                Toast.show({
                    text: "Sync From DropBox Complete",
                    buttonText: "Okay",
                    type: "success",
                    duration: 3000,
                });
            })
            .catch(err => {
                console.warn(err);

                Toast.show({
                    text: "Sync From DropBox Failed",
                    buttonText: "Okay",
                    type: "danger",
                    duration: 3000,
                });
            })
            .finally(() => {
                this.setState({ isBusy: false});
            });
    };

    _uploadToCloud = () => {
        this.setState({ activeDropBoxFAB: false});

        Alert.alert(
            'Confirmation',
            'Confirm to UPLOAD ?',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'OK', onPress: () => {
                    if (this.props.accessToken) {
                        this._doUploadJSON(this.props.accessToken);
                    } else {
                        this.setState({
                            login4UploadToDropBox: true,
                            showDropBoxLoginModal: true,
                        });
                    }            
                }},
            ],
        );
    };

    _downloadFromCloud = () => {
        this.setState({ activeDropBoxFAB: false});

        Alert.alert(
            'Confirmation',
            'Confirm to DOWNLOAD ?',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'OK', onPress: () => {
                    if (this.props.accessToken) {
                        this._doDownloadJSON(this.props.accessToken);
                    } else {
                        this.setState({
                            login4UploadToDropBox: false,
                            showDropBoxLoginModal: true,
                        });
                    }
                }},
            ],
        );
    };

    _authorizeEventStore = () => {
        return RNCalendarUtil.authorizationStatus()
            .then(isAuthorized => {
                if (isAuthorized) {
                    return Promise.resolve(isAuthorized);
                } else {
                    return RNCalendarUtil.authorizeEventStore()
                }
            });
    };

    _doDeleteCalendar = (calendarName) => {
        return this._authorizeEventStore()
            .then(isAuthorized => {
                if (isAuthorized) {
                    return RNCalendarUtil.listCalendars()
                        .then((calendars) => {
                            let result = Promise.resolve();
            
                            for (let i = 0; i < calendars.length; i++) {
                                if (calendars[i].name === calendarName) {
                                    result = RNCalendarUtil.deleteCalendar(calendarName);
                                    break;
                                }
                            }
                            return result;
                        });       
                } else {
                    return Promise.reject(new Error('Not Authorized'));
                }
            });
    };

    _recreateCalendar = (calendarName) => {
        return this._doDeleteCalendar(calendarName)
            .then(() => {
                return RNCalendarUtil.createCalendar(calendarName);
            });
    };

    _seqProcess = (array, fn) => {
        var results = [];

        return array.reduce(function (p, item) {
            return p.then(function () {
                return fn(item).then(function (result) {
                    results.push(result);
                    return results;
                });
            });
        }, Promise.resolve());
    }
    
    _deleteCalendar = () => {
        this.setState({ activeCalendarFAB: false});

        Alert.alert(
            'Confirmation',
            'Confirm to Delete Calendar ?',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'OK', onPress: () => {
                    this.setState({ isBusy: true });
                    this._doDeleteCalendar(CALENDAR_NAME)
                        .then(() => {
                            Toast.show({
                                text: "Delete Calendar Complete",
                                buttonText: "Okay",
                                type: "success",
                                duration: 3000,
                            });
                        })
                        .catch(err => {
                            console.warn(err);

                            Toast.show({
                                text: "Delete Calendar Failed",
                                buttonText: "Okay",
                                type: "danger",
                                duration: 3000,
                            });
                        })
                        .finally(() => {
                            this.setState({ isBusy: false });
                        });
                }},
            ],
        );

    }

    _doRefreshCalendarEvent = (calendarName) => {
        return this._authorizeEventStore()
            .then(isAuthorized => {
                if (isAuthorized) {
                    return this._recreateCalendar(calendarName)
                        .then((calendarId) => {
                            let progressTotal = this.props.items.size * 2;
                            let progressCurr = 0;

                            let addExpireEvent4Item = (item) => {
                                let options = RNCalendarUtil.getCalendarOptions();
                                options.calendarId = calendarId;
                        
                                let title = item.getIn(['name']) + ' Expire !!!';
                                let location = CALENDAR_EVENT_LOCATION;
                                let notes = null;
                                let startTimeMS = item.getIn(['endDateMS']) + 10*60*60*1000;
                                let endTimeMS = startTimeMS + 1000;
                        
// console.log('Adding Expiry Event[' + title + ']@[' + moment(startTimeMS).format('ll') + ']...');
                                return RNCalendarUtil.createEventWithOptions(title, location, notes, startTimeMS, endTimeMS, options)
                                    .then(eventId => {
// console.log('Adding Expiry Event[' + title + ']@[' + moment(startTimeMS).format('ll') + ']... Done');
                                        progressCurr++;
                                        this.setState({ progress: progressCurr / progressTotal });
                                        return eventId;
                                    })
                                    .catch(err => {
// console.log('Adding Expiry Event[' + title + ']@[' + moment(startTimeMS).format('ll') + ']... Failed: ' + err);
                                        throw err;
                                    });
                            };
                        
                            let addStartEvent4Item = (item) => {
                                let options = RNCalendarUtil.getCalendarOptions();
                                options.calendarId = calendarId;
                        
                                let title = item.getIn(['name']) + ' Start !!!';
                                let location = CALENDAR_EVENT_LOCATION;
                                let notes = null;
                                let startTimeMS = item.getIn(['startDateMS']) + 10*60*60*1000;
                                let endTimeMS = startTimeMS + 1000;
                        
// console.log('Adding Start Event[' + title + ']@[' + moment(startTimeMS).format('ll') + ']...');
                                return RNCalendarUtil.createEventWithOptions(title, location, notes, startTimeMS, endTimeMS, options)
                                    .then(eventId => {
// console.log('Adding Start Event[' + title + ']@[' + moment(startTimeMS).format('ll') + ']... Done');
                                        progressCurr++;
                                        this.setState({ progress: progressCurr / progressTotal });
                                        return eventId;
                                    })
                                    .catch(err => {
// console.log('Adding Start Event[' + title + ']@[' + moment(startTimeMS).format('ll') + ']... Failed: ' + err);
                                        throw err;
                                    });
                            };
                        
                            return this._seqProcess(this.props.items, addExpireEvent4Item)
                                .then(results => {
                                    return this._seqProcess(this.props.items, addStartEvent4Item);
                                });
                        });
                } else {
                    return Promise.reject(new Error('Not Authorized'));
                }
            });
    };

    _refreshCalendarEvent = () => {
        this.setState({ activeCalendarFAB: false});

        Alert.alert(
            'Confirmation',
            'Confirm to Refresh Calendar Event?',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'OK', onPress: () => {
                    this.setState({
                        isInProgress: true,
                        progressHeader: 'Refresh Calendar Event',
                        progress: 0.0,
                    });
                    this._doRefreshCalendarEvent(CALENDAR_NAME)
                        .then(() => {
                            Toast.show({
                                text: "Refresh Calendar Event Complete",
                                buttonText: "Okay",
                                type: "success",
                                duration: 3000,
                            });
                        })
                        .catch(err => {
                            console.warn(err);

                            Toast.show({
                                text: "Refresh Calendar Event Failed",
                                buttonText: "Okay",
                                type: "danger",
                                duration: 3000,
                            });
                        })
                        .finally(() => {
                            this.setState({
                                isInProgress: false,
                            });
                        });
                }},
            ],
        );
    };

    listViewOffset = 0;
    listViewHeight = 0;
    listViewContentHeight = 0;

    _onLayout = (e) => {
        const { height } = e.nativeEvent.layout;
        this.listViewHeight = height;
    }

    _onContentSizeChange = (contentWidth, contentHeight) => {
        this.listViewContentHeight = contentHeight
    }

    _onScroll = (event) => {
        // Simple fade-in / fade-out animation
        const CustomLayoutLinear = {
            duration: 100,
            create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
            update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
            delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
        };

        // Check if the user is scrolling up or down by confronting the new scroll position with your own one
        const limit = this.listViewContentHeight - this.listViewHeight;
        const offset = event.nativeEvent.contentOffset.y;
        const currentOffset = (offset > limit) ? limit : offset;

        const direction = (currentOffset > 0 && currentOffset >= this.listViewOffset)
            ? 'down'
            : 'up';

        // If the user is scrolling down (and the action-button is still visible) hide it
        const isActionButtonVisible = direction === 'up';
        if (isActionButtonVisible !== this.state.isActionButtonVisible) {
            LayoutAnimation.configureNext(CustomLayoutLinear);
            this.setState({ isActionButtonVisible });
        }

        // Update your scroll position
        this.listViewOffset = currentOffset;
    };

    render() {
        var numExpiredItem = CouponItemList.countNumItem('expired', this.props.items);
        var gui4ExpiredItemList = numExpiredItem > 0 ?
                (
                    <Card>
                        <CardItem header>
                            <Left><Text>Expired</Text></Left>
                            <Right><Badge info>
                                <AnimateNumber
                                    value={numExpiredItem}
                                    formatter={(val) => parseFloat(val).toFixed(0)}
                                />
                            </Badge></Right>
                        </CardItem>
                        <CardItem>
                            <CouponItemList type="expired" />
                        </CardItem>
                    </Card>
                )
            :   null;

        var numCurrentItem = CouponItemList.countNumItem('current', this.props.items);
        var gui4CurrentItemList = numCurrentItem > 0 ?
                (
                    <Card>
                        <CardItem header>
                            <Left><Text>Current</Text></Left>
                            <Right><Badge info>
                                <AnimateNumber
                                    value={numCurrentItem}
                                    formatter={(val) => parseFloat(val).toFixed(0)}
                                />
                            </Badge></Right>
                        </CardItem>
                        <CardItem>
                            <CouponItemList type="current" />
                        </CardItem>
                    </Card>
                )
            :   null;

        var numFutureItem = CouponItemList.countNumItem('future', this.props.items);
        var gui4FutureItemList = numFutureItem > 0 ?
                (
                    <Card>
                        <CardItem header>
                            <Left><Text>Future</Text></Left>
                            <Right><Badge info>
                                <AnimateNumber
                                    value={numFutureItem}
                                    formatter={(val) => parseFloat(val).toFixed(0)}
                                />
                            </Badge></Right>
                        </CardItem>
                        <CardItem>
                            <CouponItemList type="future" />
                        </CardItem>
                    </Card>
                )
            :   null;

        var gui4Spinner = this.state.isBusy ? (
            <Spinner />
        ) : null;

        return (
            <StyleProvider style={getTheme(myTheme)}><Container>
                <Header>
                    <Body>
                        <Title>
                            {moment().format('[Today:] ll')}
                        </Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this._clearAllItem}>
                            <Icon name="trash" />
                        </Button>
                    </Right>
                </Header>
                <Content
                    onScroll={this._onScroll}
                    scrollEventThrottle={1}
                    onContentSizeChange={this._onContentSizeChange}
                    onLayout={this._onLayout}
                >
                    {gui4Spinner}
                    <Animatable.View animation="fadeIn"
                        ref={(ref) => {
                            this.couponItemListView = ref;
                        }}
                    >
                        {gui4ExpiredItemList}
                        {gui4CurrentItemList}
                        {gui4FutureItemList}
                    </Animatable.View>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.showCreateItemModel}
                        onRequestClose={() => {}}
                    >
                        <CouponItemDetailScreen
                            onSave={this._saveNewItem}
                            onCancel={() => {
                                this.setState({ showCreateItemModel: false });
                            }}
                        />
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.showDropBoxLoginModal}
                        onRequestClose={() => {}}
                    >
                        <DropBoxLoginScreen appKey='9ov0rdwqdhqrmxv'
                            onSuccess={this._dropBoxLoginSuccess}
                            onCancel={this._dropBoxLoginCancel}
                        />
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.isInProgress}
                        onRequestClose={() => {}}
                    >
                        <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(1,1,1,0.5)',
                                }}
                        >
                            <View>
                                <Card  style={{ backgroundColor: 'rgba(1,1,1,1)' }}>
                                    <CardItem header>
                                        <Text>{this.state.progressHeader}</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Body style={{flexDirection: "row", justifyContent: "center"}}>
                                            <Progress.Circle progress={this.state.progress} showsText={true} />
                                        </Body>
                                    </CardItem>
                                </Card>
                            </View>
                        </View>
                    </Modal>
                </Content>
                { this.state.isActionButtonVisible &&
                    <Fab position="bottomLeft"
                        onPress={() => this.setState({
                            showCreateItemModel: true,
                            activeDropBoxFAB: false,
                            activeCalendarFAB: false,
                        })}
                    >
                        <Icon name="add" />
                    </Fab>
                }
                { this.state.isActionButtonVisible &&
                    <Fab containerStyle={{left: '43%'}}
                        position="bottomLeft"
                        direction="up"
                        active={this.state.activeCalendarFAB}
                        onPress={() => this.setState({
                            activeCalendarFAB: !this.state.activeCalendarFAB,
                            activeDropBoxFAB: false,
                        })}
                    >
                        <Icon name="calendar" />
                        <Button
                            onPress={this._refreshCalendarEvent}>
                            <Icon name="refresh" />
                        </Button>
                        <Button
                            onPress={this._deleteCalendar}>
                            <Icon type="MaterialIcons" name="delete" />
                        </Button>
                    </Fab>
                }
                { this.state.isActionButtonVisible &&
                    <Fab
                        position="bottomRight"
                        direction="up"
                        active={this.state.activeDropBoxFAB}
                        onPress={() => this.setState({
                            activeDropBoxFAB: !this.state.activeDropBoxFAB,
                            activeCalendarFAB: false,
                        })}
                    >
                        <Icon name="logo-dropbox" />
                        <Button
                            onPress={this._uploadToCloud}>
                            <Icon name="cloud-upload" />
                        </Button>
                    </Fab>
                }
                { this.state.isActionButtonVisible &&
                    <Fab
                        position="bottomRight"
                        direction="left"
                        active={this.state.activeDropBoxFAB}
                        onPress={() => this.setState({
                            activeDropBoxFAB: !this.state.activeDropBoxFAB,
                            activeCalendarFAB: false,
                        })}
                    >
                        <Icon name="logo-dropbox" />
                        <Button
                            onPress={this._downloadFromCloud}>
                            <Icon name="cloud-download" />
                        </Button>
                    </Fab>
                }
            </Container></StyleProvider>
        );
    }
}

CouponsScreen.propTypes = {
    items: PropTypes.instanceOf(ImmutableList).isRequired,
    couponItemAdd: PropTypes.func.isRequired,
    couponItemClear: PropTypes.func.isRequired,
};

//====== Redux ======
const mapStateToProps = state => {
    return {
        items: state.coupons.getIn(['items']),
        accessToken: state.dropbox.accessToken,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        couponItemAdd: (name, numUnit, startDateMS, endDateMS) => 
            dispatch(couponItemAdd(name, numUnit, startDateMS, endDateMS)),

        couponItemClear: () =>
            dispatch(couponItemClear()),

        couponItemSyncFromServer: (data) =>
            dispatch(couponItemSyncFromServer(data)),

        dropboxSetAccessToken: (accessToken) =>
            dispatch(dropboxSetAccessToken(accessToken)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CouponsScreen);