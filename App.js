import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, Platform, StatusBar, AppState } from 'react-native';
import { createContext, useEffect, useState, useRef } from 'react';
import Home, { getFirstLaunch } from './Screens/Home';
import Settings from './Screens/Settings';
import Donate from './Screens/Donate';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { convertDate } from './Screens/Home';
SplashScreen.preventAutoHideAsync();
const ios = Platform.OS === 'ios';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export async function requestPermissionsAsync() {
    return await Notifications.requestPermissionsAsync({
        ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
        },
    });
}
async function dismissAllNotifications() {
    await Notifications.dismissAllNotificationsAsync();
}
async function cancelAllNotifications() {
    return await Notifications.cancelAllScheduledNotificationsAsync();
}
export async function allowsNotificationsAsync() {
    const settings = await Notifications.getPermissionsAsync();
    return (
        settings.granted ||
        settings.ios?.status ===
            Notifications.IosAuthorizationStatus.PROVISIONAL
    );
}
export async function allNotifs() {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    return all;
}

function iosNotification(date, text) {
    allowsNotificationsAsync().then((allowed) => {
        if (allowed) {
            // for (let i = 0; i < 10; i++) {
            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Baitul Mamur Academy',
                    body: text,
                    sound: 'default',
                },
                trigger: date,
            });
            // }
        }
    });
}
function androidNotification(date, text) {
    Notifications.scheduleNotificationAsync({
        content: {
            title: 'Baitul Mamur Academy',
            body: text,
        },
        trigger: date,
    });
}
Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.isDstObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
};
Date.prototype.addOneHour = function () {
    this.setTime(this.getTime() + 60 * 60 * 1000);
    return this;
};
Date.prototype.addMinutes = function (minutes) {
    this.setTime(this.getTime() + minutes * 60 * 1000);
    return this;
};
const defaultAnnouncement = [true, true, true, true];
const defaultAlarm = [false, true, 10];
const defaultCountDown = [false, false, true];
global.AppContext = createContext(null);

let forceReRender = false;
global.startInterval = null;
global.salahInterval = null;
global.bothInterval = null;
global.noneInterval = null;
export default function App() {
    function setTodayTmrroSalahs() {
        if (Object.keys(times[0][0]).length !== 0) {
            if (
                times[0][0].Date ===
                '01-Jan-' + new Date().getFullYear().toString().substring(2, 4)
            ) {
                const todayMonth = new Date().getMonth();
                const todayDate = new Date().getDate() - 1;
                setTodaySalahs([
                    [
                        times[todayMonth][todayDate].Fajr_jamaah,
                        times[todayMonth][todayDate].Fajr_start,
                    ],
                    [
                        times[todayMonth][todayDate].Zuhr_jamaah,
                        times[todayMonth][todayDate].Zuhr_start,
                    ],
                    [
                        times[todayMonth][todayDate].Asr_jamaah,
                        preferMithl1
                            ? times[todayMonth][todayDate].Asr_start1
                            : times[todayMonth][todayDate].Asr_start2,
                    ],
                    [
                        times[todayMonth][todayDate].Maghrib_jamaah,
                        times[todayMonth][todayDate].Maghrib_start,
                    ],
                    [
                        times[todayMonth][todayDate].Isha_jamaah,
                        times[todayMonth][todayDate].Isha_start,
                    ],
                ]);
                if (!(todayMonth === 11 && todayDate === 30)) {
                    const tmrro = new Date();
                    tmrro.setDate(tmrro.getDate() + 1);
                    const tmrroMonth = tmrro.getMonth();
                    const tmrroDay = tmrro.getDate() - 1;
                    setTmrroSalahs([
                        [
                            times[tmrroMonth][tmrroDay].Fajr_jamaah,
                            times[tmrroMonth][tmrroDay].Fajr_start,
                        ],
                        [
                            times[tmrroMonth][tmrroDay].Zuhr_jamaah,
                            times[tmrroMonth][tmrroDay].Zuhr_start,
                        ],
                        [
                            times[tmrroMonth][tmrroDay].Asr_jamaah,
                            times[tmrroMonth][tmrroDay].Asr_start1,
                        ],
                        [
                            times[tmrroMonth][tmrroDay].Maghrib_jamaah,
                            times[tmrroMonth][tmrroDay].Maghrib_start,
                        ],
                        [
                            times[tmrroMonth][tmrroDay].Isha_jamaah,
                            times[tmrroMonth][tmrroDay].Isha_start,
                        ],
                    ]);
                }
            } else {
                removeTimesData();
                if (!downloadAlert) {
                    Alert.alert('Please reload app to get times for this year');
                    setDownloadAlert(true);
                }
            }
        }
    }
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextAppState) => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === 'active'
                ) {
                    allowsNotificationsAsync().then((r) =>
                        setAllowsNotifcations(r)
                    );
                    dismissAllNotifications();

                    forceReRender = !forceReRender;
                } else {
                    clearInterval(global.noneInterval);
                    clearInterval(global.startInterval);
                    clearInterval(global.salahInterval);
                    clearInterval(global.bothInterval);
                    global.startInterval = null;
                    global.salahInterval = null;
                    global.bothInterval = null;
                    global.noneInterval = null;
                }

                appState.current = nextAppState;
                setAppStateVisible(appState.current);
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);
    const [allowsNotifications, setAllowsNotifcations] = useState();
    const [appIsReady, setAppIsReady] = useState(false);
    function checkArrayAllowsNotifications(array) {
        for (let i = 0; i < array.length; i++) {
            array[i] = array[i] && allowsNotifications;
        }
        return array;
    }
    const getMithlData = async () => {
        try {
            const value = await AsyncStorage.getItem('mithl');
            if (value === null) {
                //set default value here
                setPreferMithl1(true);
            } else {
                setPreferMithl1(value === 'true');
            }
        } catch (e) {
            console.log('error');
            // read error
            throw e;
        }
    };
    const getAlarmData = async (key, setFunc) => {
        try {
            const data = await AsyncStorage.getItem(key);
            if (data === null) {
                setFunc(defaultAlarm);
                setAlarmData(key, defaultAlarm); // might cause error
            } else {
                var strData = data.replace('[', '');
                strData = strData.replace(']', '');
                arrayData = strData.split(',');
                arrayData[0] = arrayData[0] === 'true' && allowsNotifications;
                arrayData[1] = arrayData[1] === 'true';
                arrayData[2] = parseInt(arrayData[2]);
                setFunc(arrayData);
                return data;
            }
        } catch (e) {
            // read error
            console.log('get alarm data error');
        }
    };
    const getCountDownData = async () => {
        try {
            const value = await AsyncStorage.getItem('countdown');
            if (value === null) {
                setSalahCountDownTimer(defaultCountDown[0]);
                setStartCountDownTimer(defaultCountDown[1]);
                setStartThenSalah(defaultCountDown[2]);
            } else {
                var strData = value.replace('[', '');
                strData = strData.replace(']', '');
                arrayData = strData.split(',');
                setSalahCountDownTimer(arrayData[0] === 'true');
                setStartCountDownTimer(arrayData[1] === 'true');
                setStartThenSalah(arrayData[2] === 'true');
            }
        } catch (e) {
            // error reading value
        }
    };
    const Stack = createNativeStackNavigator();
    const [todaySalahs, setTodaySalahs] = useState([
        [null, null],
        [null, null],
        [null, null],
        [null, null],
        [null, null],
    ]);
    const [tmrroSalahs, setTmrroSalahs] = useState([
        [null, null],
        [null, null],
        [null, null],
        [null, null],
        [null, null],
    ]);
    const [salahCountDownTimer, setSalahCountDownTimer] = useState(null);
    const [startCountDownTimer, setStartCountDownTimer] = useState(null);
    const [startThenSalah, setStartThenSalah] = useState(null);
    const [preferMithl1, setPreferMithl1] = useState(null);
    const [fajrAlert, setFajrAlert] = useState([
        null,

        null /*whether salah=true or start=false */,
        0 /*Minutes before hand */,
    ]);
    const [zuhrAlert, setZuhrAlert] = useState([
        null,
        null /*whether salah=true or start=false */,
        0 /*Minutes before hand */,
    ]);
    const [asrAlert, setAsrAlert] = useState([
        null,
        null /*whether salah=true or start=false */,
        0 /*Minutes before hand */,
    ]);
    const [maghribAlert, setMaghribAlert] = useState([
        null,
        null /*whether salah=true or start=false */,
        0 /*Minutes before hand */,
    ]);
    const [ishaAlert, setIshaAlert] = useState([
        null,
        null /*whether salah=true or start=false */,
        0 /*Minutes before hand */,
    ]);
    const getTimesData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('times');
            if (jsonValue === null) {
                downloadTimesData();
                return jsonValue;
            } else {
                setJsonData(jsonValue);
                return jsonValue;
            }
        } catch (e) {
            console.log('error');
            // read error
            throw e;
        }
    };

    const setTimesData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('times', jsonValue);
        } catch (e) {
            // save error
        }
    };
    const [jsonData, setJsonData] = useState(null);
    const [times, setTimes] = useState([
        [{}],
        [{}],
        [{}],
        [{}],
        [{}],
        [{}],
        [{}],
        [{}],
        [{}],
        [{}],
        [{}],
        [{}],
    ]);

    function timesToArray(jsonData) {
        var value = jsonData;
        value = ios ? value.replaceAll('[', '') : value.replaceAll('\\[', '');
        var array = value.split('],');

        for (let i = 0; i < array.length; i++) {
            array[i] = array[i].replaceAll('},', '}&');
            array[i] = array[i].split('&');
        }
        array[11][30] = array[11][30].replace(']]', '');
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                array[i][j] = JSON.parse(array[i][j]);
            }
        }
        return array;
    }
    function downloadTimesData() {
        fetch('https://data.baitulmamur.academy/')
            .then((response) => {
                return response.json();
            })
            .catch((e) => {
                Alert.alert('Error', 'Please check your internet connection');
            })
            .then((data) => {
                setTimesData(data); // store to device
                setJsonData(JSON.stringify(data));
            })
            .catch((e) => {
                console.log(e);
            });
    }
    const [salahChangesOn, setSalahChangesOn] = useState([
        null,
        null,
        null,
        null,
    ]);
    const getSalahChanges = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('changes');
            const val = JSON.parse(jsonValue);
            if (val === null) {
                setSalahChangesOn(
                    checkArrayAllowsNotifications(defaultAnnouncement)
                );
            } else {
                setSalahChangesOn(checkArrayAllowsNotifications(val));
            }
        } catch (e) {
            // read error
        }
    };
    useEffect(() => {
        getFirstLaunch()
            .then((val) => {
                if (val === null && Object.keys(times[0][0]).length !== 0) {
                    ios
                        ? requestPermissionsAsync().then((r) => {
                              allowsNotificationsAsync().then(
                                  (r = setAllNotifications(r))
                              );
                          })
                        : null;
                }
            })
            .catch((e) => console.log(e));
    }, [times]);
    useEffect(() => {
        if (jsonData === null) {
            getTimesData()
                .then(() => {
                    if (jsonData !== null) {
                        setTimes(timesToArray(jsonData));
                    }
                })
                .catch((error) => {
                    downloadTimesData();
                    console.log('Error in fetch', error);
                }); // put then handler
        } else {
            setTimes(timesToArray(jsonData));
        }
    }, [jsonData]);
    useEffect(() => {
        dismissAllNotifications();
        allowsNotificationsAsync().then((r) => setAllowsNotifcations(r));
        getCountDownData();
        getMithlData();
    }, []);
    useEffect(() => {
        getAlarmData('fajr', setFajrAlert);
        getAlarmData('zuhr', setZuhrAlert);
        getAlarmData('asr', setAsrAlert);
        getAlarmData('maghrib', setMaghribAlert);
        getAlarmData('isha', setIshaAlert);
        getSalahChanges();
    }, [allowsNotifications]);
    useEffect(() => {
        setTodayTmrroSalahs();
    }, [times, jsonData, preferMithl1, forceReRender]);
    function checkPrayerChanges(allTimes, i, prayer) {
        const todayPrayer = returnTime(allTimes, i, prayer, true);
        const tmrroPrayer = returnTime(allTimes, i + 1, prayer, true);
        if (getSalahChangesOnI(prayer) && todayPrayer !== tmrroPrayer) {
            const date = convertTimeToDate(
                allTimes[i].Date,
                todayPrayer,
                15,
                checkPm(prayer, true, todayPrayer)
            );
            const msg =
                "Insha'Allah, " +
                prayer +
                ' salah will be changing to ' +
                tmrroPrayer +
                ' Tomorrow';
            if (date > Date.now()) {
                ios
                    ? iosNotification(date, msg)
                    : androidNotification(date, msg);
            }
            return true;
        }
        return false;
    }
    function getSalahChangesOnI(prayer) {
        switch (prayer) {
            case 'Fajr':
                return salahChangesOn[0];
            case 'Zuhr':
                return salahChangesOn[1];
            case 'Asr':
                return salahChangesOn[2];
            case 'Isha':
                return salahChangesOn[3];
            default:
                throw 'Prayer name entered does not match';
        }
    }
    function getSalahAlertsOn(prayer) {
        switch (prayer) {
            case 'Fajr':
                return fajrAlert[0];
            case 'Zuhr':
                return zuhrAlert[0];
            case 'Asr':
                return asrAlert[0];
            case 'Maghrib':
                return maghribAlert[0];
            case 'Isha':
                return ishaAlert[0];
            default:
                throw 'Prayer name entered does not match';
        }
    }

    function convertTimeToDate(date, time, addMins = 0, pm = true) {
        const hourMin = convertToInt(time.split(':'));
        const dates = convertDateToInt(date.split('-'));
        const d = new Date(
            new Date().getFullYear(),
            dates[1] - 1,
            dates[0],
            pm ? hourMin[0] + 12 : hourMin[0],
            hourMin[1]
        );
        d.addMinutes(addMins);
        if (d.isDstObserved()) {
            d.addOneHour();
        }
        return d;
    }
    function convertToInt(array) {
        for (let i = 0; i < array.length; i++) {
            array[i] = parseInt(array[i]);
        }
        return array;
    }
    function convertDateToInt(array) {
        for (let i = 0; i < array.length; i++) {
            if (i === 1) {
                array[i] =
                    'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(array[i]) /
                        3 +
                    1;
            } else {
                array[i] = parseInt(array[i]);
            }
        }
        return array;
    }
    function daysRemaining(
        today = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
        )
    ) {
        const dayInMiliSeconds = 24 * 60 * 60 * 1000;
        const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
        return (
            Math.round(Math.abs((lastDayOfYear - today) / dayInMiliSeconds)) + 1 // add one to add today as well
        );
    }
    function setAllNotifications() {
        if (allowsNotifications) {
            const startIndex = getStartIndex();
            const allTimes = times.flat(1);
            let notifLimit = 64;
            setTodayNotif(
                allTimes,
                startIndex,
                'Fajr',
                fajrAlert[1],
                fajrAlert[2]
            )
                ? notifLimit--
                : null;
            setTodayNotif(
                allTimes,
                startIndex,
                'Zuhr',
                zuhrAlert[1],
                zuhrAlert[2]
            )
                ? notifLimit--
                : null;
            setTodayNotif(allTimes, startIndex, 'Asr', asrAlert[1], asrAlert[2])
                ? notifLimit--
                : null;
            setTodayNotif(
                allTimes,
                startIndex,
                'Maghrib',
                maghribAlert[1],
                maghribAlert[2]
            )
                ? notifLimit--
                : null;
            setTodayNotif(
                allTimes,
                startIndex,
                'Isha',
                ishaAlert[1],
                ishaAlert[2]
            )
                ? notifLimit--
                : null;
            for (let i = startIndex; i < startIndex + notifLimit; i++) {
                if (i === allTimes.length) {
                    break;
                }
                if (i < allTimes.length - 1) {
                    checkPrayerChanges(allTimes, i, 'Fajr')
                        ? notifLimit--
                        : null;
                    checkPrayerChanges(allTimes, i, 'Zuhr')
                        ? notifLimit--
                        : null;
                    checkPrayerChanges(allTimes, i, 'Asr')
                        ? notifLimit--
                        : null;
                    checkPrayerChanges(allTimes, i, 'Isha')
                        ? notifLimit--
                        : null;
                }
                if (i > startIndex) {
                    setSingleNotif(
                        allTimes,
                        i,
                        'Fajr',
                        fajrAlert[1],
                        fajrAlert[2]
                    )
                        ? notifLimit--
                        : null;
                    setSingleNotif(
                        allTimes,
                        i,
                        'Zuhr',
                        zuhrAlert[1],
                        zuhrAlert[2]
                    )
                        ? notifLimit--
                        : null;
                    setSingleNotif(allTimes, i, 'Asr', asrAlert[1], asrAlert[2])
                        ? notifLimit--
                        : null;
                    setSingleNotif(
                        allTimes,
                        i,
                        'Maghrib',
                        maghribAlert[1],
                        maghribAlert[2]
                    )
                        ? notifLimit--
                        : null;
                    setSingleNotif(
                        allTimes,
                        i,
                        'Isha',
                        ishaAlert[1],
                        ishaAlert[2]
                    )
                        ? notifLimit--
                        : null;
                }
            }
        }
    }
    function getStartIndex() {
        const daysRemain = daysRemaining();
        return (
            daysRemaining(new Date(new Date().getFullYear(), 0, 1)) - daysRemain
        );
    }
    function setTodayNotif(
        allTimes,
        startIndex,
        prayer,
        salahSelected,
        minsBefore
    ) {
        if (getSalahAlertsOn(prayer)) {
            const time = returnTime(
                allTimes,
                startIndex,
                prayer,
                salahSelected
            );
            const date = convertTimeToDate(
                allTimes[startIndex].Date,
                time,
                -minsBefore,
                checkPm(prayer, salahSelected, time)
            );
            const msg = returnMessage(prayer, salahSelected, minsBefore);
            if (date > Date.now()) {
                ios
                    ? iosNotification(date, msg)
                    : androidNotification(date, msg);
                return true;
            }
        }
        return false;
    }
    function setSingleNotif(allTimes, i, prayer, salahSelected, minsBefore) {
        if (getSalahAlertsOn(prayer)) {
            const time = returnTime(allTimes, i, prayer, salahSelected);
            const date = convertTimeToDate(
                allTimes[i].Date,
                time,
                -minsBefore,
                checkPm(prayer, salahSelected, time)
            );
            const msg = returnMessage(prayer, salahSelected, minsBefore);
            ios ? iosNotification(date, msg) : androidNotification(date, msg);
            return true;
        }
        return false;
    }
    function checkPm(prayer, salahSelected, time) {
        return (prayer === 'Fajr') |
            (prayer === 'Zuhr' &&
                !salahSelected &&
                time.split(':')[0].length === 2)
            ? false
            : true;
    }
    function returnMessage(prayer, salahSelected, minsBefore) {
        if (minsBefore === 0) {
            const msg = salahSelected ? ' salah has started' : ' has started';
            return prayer + msg;
        } else {
            const msg = salahSelected
                ? ' salah is starting in ' + minsBefore + ' minutes'
                : ' is starting in ' + minsBefore + ' minutes';
            return prayer + msg;
        }
    }
    function returnTime(times, i, prayer, salahSelected) {
        switch (prayer) {
            case 'Fajr':
                return salahSelected
                    ? times[i].Fajr_jamaah
                    : times[i].Fajr_start;
            case 'Zuhr':
                return salahSelected
                    ? times[i].Zuhr_jamaah
                    : times[i].Zuhr_start;
            case 'Asr':
                return salahSelected
                    ? times[i].Asr_jamaah
                    : preferMithl1
                    ? times[i].Asr_start1
                    : times[i].Asr_start2;
            case 'Maghrib':
                return salahSelected
                    ? times[i].Maghrib_jamaah
                    : times[i].Maghrib_start;
            case 'Isha':
                return salahSelected
                    ? times[i].Isha_jamaah
                    : times[i].Isha_start;
            default:
                throw 'Prayer name entered does not match';
        }
    }
    useEffect(() => {
        if (allowsNotifications) {
            cancelAllNotifications().then(() => {
                setAllNotifications();
            });
        } else {
            cancelAllNotifications();
        }
        // .catch((e) => console.log(e));
    }, [
        salahChangesOn,
        fajrAlert,
        zuhrAlert,
        asrAlert,
        maghribAlert,
        ishaAlert,
        preferMithl1,
        allowsNotifications,
    ]);
    async function hideSplash() {
        await SplashScreen.hideAsync();
    }
    useEffect(() => {
        if (
            !appIsReady &&
            fajrAlert[0] !== null &&
            zuhrAlert[0] !== null &&
            asrAlert[0] !== null &&
            maghribAlert[0] !== null &&
            ishaAlert[0] !== null &&
            salahCountDownTimer !== null &&
            startCountDownTimer !== null &&
            startThenSalah !== null &&
            preferMithl1 !== null &&
            salahChangesOn[0] !== null &&
            allowsNotifications !== null
        ) {
            setAppIsReady(true);
            hideSplash();
        }
    }, [
        fajrAlert,
        zuhrAlert,
        asrAlert,
        maghribAlert,
        ishaAlert,
        salahCountDownTimer,
        startCountDownTimer,
        startThenSalah,
        preferMithl1,
        salahChangesOn,
    ]);
    if (!appIsReady) {
        return null;
    }
    return (
        <global.AppContext.Provider
            value={{
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
                times,
                jsonData,
                salahChangesOn,
                setSalahChangesOn,
                allowsNotifications,
                setAllNotifications,
                todaySalahs,
                tmrroSalahs,
            }}
        >
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Settings"
                        component={Settings}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Donate"
                        component={Donate}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
                <StatusBar style="light" />
            </NavigationContainer>
        </global.AppContext.Provider>
    );
}
