import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    Platform,
    Dimensions,
    SafeAreaView,
    Alert,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import LeftArrow from '../Svgs/LeftArrow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Uncheck from '../Svgs/Uncheck';
import Check from '../Svgs/Check';
import { bgColor, setAlarmData } from './Home';
import PrayerAlert from './PrayerAlert';
import PrayerChanges from './PrayerChanges';
import MinuteAlert from './MinuteAlert';
import SettingSubTitle from './SettingsSubTitle';
import { notificationsDisabledMsg } from './Home';
const windowWidth = Dimensions.get('window').width;
const btnWidth = Math.round(windowWidth / 2.25);
export default function Settings({ navigation }) {
    const [edit, setEdit] = useState(false);

    const [fajrEdit, setFajrEdit] = useState([false, true]);
    const [zuhrEdit, setZuhrEdit] = useState([false, true]);
    const [asrEdit, setAsrEdit] = useState([false, true]);
    const [maghribEdit, setMaghribEdit] = useState([false, true]);
    const [ishaEdit, setIshaEdit] = useState([false, true]);

    const ios = Platform.OS === 'ios';
    const {
        salahCountDownTimer,
        setSalahCountDownTimer,
        startCountDownTimer,
        setStartCountDownTimer,
        startThenSalah,
        setStartThenSalah,
        fajrAlert,
        setFajrAlert,
        zuhrAlert,
        setZuhrAlert,
        asrAlert,
        setAsrAlert,
        maghribAlert,
        setMaghribAlert,
        ishaAlert,
        setIshaAlert,
        preferMithl1,
        setPreferMithl1,
        salahChangesOn,
        setSalahChangesOn,
        allowsNotifications,
    } = useContext(global.AppContext);

    const setMithlData = async (value) => {
        try {
            await AsyncStorage.setItem('mithl', value);
        } catch (e) {
            // save error
        }
    };
    function setMithl(mithl) {
        setPreferMithl1(mithl);
        setMithlData(mithl.toString());
    }
    function setTimer(salah, start, both) {
        setSalahCountDownTimer(salah);
        setStartCountDownTimer(start);
        setStartThenSalah(both);
        setCountDownData([salah, start, both]);
    }
    // iosNotification(new Date(2023, 0, 29, 18, 5), 'Hi');
    const setCountDownData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('countdown', jsonValue);
        } catch (e) {
            // save error
            console.log('set CountDown data error');
        }
    };

    const setSalahChanges = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('changes', jsonValue);
        } catch (e) {
            // save error
        }
    };

    const toggleFajrChanges = () => {
        if (!allowsNotifications) {
            notificationsDisabledMsg();
            return;
        }
        setSalahChanges([
            !salahChangesOn[0],
            salahChangesOn[1],
            salahChangesOn[2],
            salahChangesOn[3],
        ]);
        return setSalahChangesOn([
            !salahChangesOn[0],
            salahChangesOn[1],
            salahChangesOn[2],
            salahChangesOn[3],
        ]);
    };
    const toggleZuhrChanges = () => {
        if (!allowsNotifications) {
            notificationsDisabledMsg();
            return;
        }
        setSalahChanges([
            salahChangesOn[0],
            !salahChangesOn[1],
            salahChangesOn[2],
            salahChangesOn[3],
        ]);
        return setSalahChangesOn([
            salahChangesOn[0],
            !salahChangesOn[1],
            salahChangesOn[2],
            salahChangesOn[3],
        ]);
    };
    const toggleAsrChanges = () => {
        if (!allowsNotifications) {
            notificationsDisabledMsg();
            return;
        }
        setSalahChanges([
            salahChangesOn[0],
            salahChangesOn[1],
            !salahChangesOn[2],
            salahChangesOn[3],
        ]);
        return setSalahChangesOn([
            salahChangesOn[0],
            salahChangesOn[1],
            !salahChangesOn[2],
            salahChangesOn[3],
        ]);
    };
    const toggleIshaChanges = () => {
        if (!allowsNotifications) {
            notificationsDisabledMsg();
            return;
        }
        setSalahChanges([
            salahChangesOn[0],
            salahChangesOn[1],
            salahChangesOn[2],
            !salahChangesOn[3],
        ]);
        return setSalahChangesOn([
            salahChangesOn[0],
            salahChangesOn[1],
            salahChangesOn[2],
            !salahChangesOn[3],
        ]);
    };
    const toggleFajrAlert = () => {
        if (!allowsNotifications) {
            notificationsDisabledMsg();
            return;
        }
        setAlarmData('fajr', [!fajrAlert[0], fajrAlert[1], fajrAlert[2]]);
        return setFajrAlert([!fajrAlert[0], fajrAlert[1], fajrAlert[2]]);
    };
    const toggleZuhrAlert = () => {
        if (!allowsNotifications) {
            notificationsDisabledMsg();
            return;
        }
        setAlarmData('zuhr', [!zuhrAlert[0], zuhrAlert[1], zuhrAlert[2]]);
        return setZuhrAlert([!zuhrAlert[0], zuhrAlert[1], zuhrAlert[2]]);
    };
    const toggleAsrAlert = () => {
        if (!allowsNotifications) {
            notificationsDisabledMsg();
            return;
        }
        setAlarmData('asr', [!asrAlert[0], asrAlert[1], asrAlert[2]]);
        return setAsrAlert([!asrAlert[0], asrAlert[1], asrAlert[2]]);
    };
    const toggleMaghribAlert = () => {
        if (!allowsNotifications) {
            notificationsDisabledMsg();
            return;
        }
        setAlarmData('maghrib', [
            !maghribAlert[0],
            maghribAlert[1],
            maghribAlert[2],
        ]);
        return setMaghribAlert([
            !maghribAlert[0],
            maghribAlert[1],
            maghribAlert[2],
        ]);
    };
    const toggleIshaAlert = () => {
        if (!allowsNotifications) {
            notificationsDisabledMsg();
            return;
        }
        setAlarmData('isha', [!ishaAlert[0], ishaAlert[1], ishaAlert[2]]);
        return setIshaAlert([!ishaAlert[0], ishaAlert[1], ishaAlert[2]]);
    };
    const allPrayerChanges = [
        ['Fajr', salahChangesOn[0], toggleFajrChanges],
        ['Zuhr', salahChangesOn[1], toggleZuhrChanges],
        ['Asr', salahChangesOn[2], toggleAsrChanges],
        ['Isha', salahChangesOn[3], toggleIshaChanges],
    ];

    const allPrayerAlerts = [
        [
            'Fajr',
            fajrAlert,
            toggleFajrAlert,
            setFajrEdit,
            fajrEdit,
            setFajrAlert,
        ],
        [
            'Zuhr',
            zuhrAlert,
            toggleZuhrAlert,
            setZuhrEdit,
            zuhrEdit,
            setZuhrAlert,
        ],
        ['Asr', asrAlert, toggleAsrAlert, setAsrEdit, asrEdit, setAsrAlert],
        [
            'Maghrib',
            maghribAlert,
            toggleMaghribAlert,
            setMaghribEdit,
            maghribEdit,
            setMaghribAlert,
        ],
        [
            'Isha',
            ishaAlert,
            toggleIshaAlert,
            setIshaEdit,
            ishaEdit,
            setIshaAlert,
        ],
    ];
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.backContainer}
                onPress={() => navigation.pop()}
            >
                <LeftArrow />
                <Text style={styles.back}>Back</Text>
            </TouchableOpacity>
            <ScrollView>
                <Text style={styles.title}>Settings</Text>
                <View>
                    <SettingSubTitle
                        title="Jama'ah Changes"
                        alertMessage="Get notified when jama'ah time changes*"
                    />
                    {allPrayerChanges.map((data, key) => {
                        return (
                            <PrayerChanges
                                prayer={data[0]}
                                salahChangesI={data[1]}
                                toggleChanges={data[2]}
                                key={key}
                            />
                        );
                    })}
                </View>
                <View>
                    <SettingSubTitle
                        title="Alerts"
                        alertMessage="Get notified before prayer time*"
                    />
                    {edit ? null : (
                        <TouchableOpacity onPress={() => setEdit(!edit)}>
                            <Text style={styles.edit}>Edit alerts</Text>
                        </TouchableOpacity>
                    )}
                    {allPrayerAlerts.map((data, key) => {
                        return (
                            <PrayerAlert
                                prayer={data[0]}
                                alert={data[1]}
                                toggleAlert={data[2]}
                                setPrayerEdit={data[3]}
                                edit={edit}
                                key={key}
                            />
                        );
                    })}

                    {edit ? (
                        <View style={styles.btnContainer}>
                            <TouchableOpacity
                                style={styles.btnSafeAreaView}
                                onPress={() => setEdit(false)}
                            >
                                <Text style={styles.btn}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </View>
                <View>
                    <SettingSubTitle
                        title="Timer Preferences"
                        alertMessage="For timer until prayer on home screen"
                    />
                    <TouchableHighlight
                        onPress={() => setTimer(false, false, true)}
                    >
                        <View style={styles.radioRow}>
                            {startThenSalah ? <Check /> : <Uncheck />}
                            <Text style={styles.radioText}>
                                Start then Jama'ah (default)
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => setTimer(true, true, false)}
                    >
                        <View style={styles.radioRow}>
                            {salahCountDownTimer && startCountDownTimer ? (
                                <Check />
                            ) : (
                                <Uncheck />
                            )}
                            <Text style={styles.radioText}>
                                Both Jama'ah and Start
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => setTimer(true, false, false)}
                    >
                        <View style={styles.radioRow}>
                            {salahCountDownTimer && !startCountDownTimer ? (
                                <Check />
                            ) : (
                                <Uncheck />
                            )}
                            <Text style={styles.radioText}>Jama'ah only</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => setTimer(false, true, false)}
                    >
                        <View style={styles.radioRow}>
                            {startCountDownTimer && !salahCountDownTimer ? (
                                <Check />
                            ) : (
                                <Uncheck />
                            )}
                            <Text style={styles.radioText}>Start only</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => setTimer(false, false, false)}
                    >
                        <View style={styles.radioRow}>
                            {!startCountDownTimer &&
                            !salahCountDownTimer &&
                            !startThenSalah ? (
                                <Check />
                            ) : (
                                <Uncheck />
                            )}
                            <Text style={styles.radioText}>None</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View>
                    <SettingSubTitle
                        alertMessage="For timer and alert purposes"
                        title="Prefered Asr Mithl"
                    />
                    <TouchableHighlight
                        style={styles.radioRow}
                        onPress={() => setMithl(true)}
                    >
                        <>
                            {preferMithl1 ? <Check /> : <Uncheck />}
                            <Text style={styles.radioText}>Mithl 1</Text>
                        </>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.radioRow}
                        onPress={() => setMithl(false)}
                    >
                        <>
                            {!preferMithl1 ? <Check /> : <Uncheck />}
                            <Text style={styles.radioText}>Mithl 2</Text>
                        </>
                    </TouchableHighlight>
                </View>
                <Text style={styles.notifcationsLimited}>
                    *Notifications are limited - for intended use try open app
                    regularly
                </Text>
            </ScrollView>
            {allPrayerAlerts.map((data, key) => {
                return data[4][0] ? (
                    <MinuteAlert
                        prayer={data[0]}
                        timeValue={data[1][2]}
                        salahPicked={data[1][1]}
                        setPrayerEdit={data[3]}
                        timePicker={data[4][1]}
                        key={key}
                        setAlert={data[5]}
                        alertOn={data[1][0]}
                    />
                ) : null;
            })}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    notifcationsLimited: {
        marginVertical: 12,
        color: 'white',
        fontSize: 10,
        textAlign: 'center',
    },
    back: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: '2%',
    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '2%',
        paddingVertical: 10,
    },
    container: {
        flex: 1,
        backgroundColor: bgColor,
        // marginTop: StatusBar.currentHeight,
    },
    title: {
        color: 'white',
        fontSize: 40,
        textAlign: 'center',
    },
    radioRow: {
        flexDirection: 'row',
        marginVertical: 5,
        paddingLeft: 10,
        alignItems: 'center',
    },
    radioText: {
        color: 'white',
        fontSize: 25,
        marginLeft: 7.5,
    },
    edit: {
        textAlign: 'right',
        color: 'white',
        marginRight: 15,
        fontSize: 15,
    },
    btn: {
        color: 'white',
        fontSize: 20,
    },
    btnSafeAreaView: {
        borderWidth: 1,
        padding: 15,
        width: btnWidth,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
    },
    btnContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
});
