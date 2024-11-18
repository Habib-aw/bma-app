// import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Platform,
    // StatusBar,
    Linking,
    Dimensions,
    Alert,
    ScrollView,
    Modal,
} from 'react-native';
import hijrahDate from 'hijrah-date';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useEffect, useState, useContext } from 'react';
import SettingsIcon from '../Svgs/SettingsIcon';
import LeftArrow from '../Svgs/LeftArrow';
import RightArrow from '../Svgs/RightArrow';
import BellOff from '../Svgs/BellOff';
import BellOn from '../Svgs/BellOn';
import Calendar from '../Svgs/Calendar';
import Open from '../Svgs/Open';
import Cross from '../Svgs/Cross';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

export function notificationsDisabledMsg() {
    Alert.alert(
        'Notifications disabled',
        'Please allow app to use notifications in settings'
    );
}
if (typeof String.prototype.replaceAll === 'undefined') {
    String.prototype.replaceAll = function (match, replace) {
        return this.replace(new RegExp(match, 'g'), () => replace);
    };
}
export const setAlarmData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        // save error
    }
};
export const getFirstLaunch = async () => {
    try {
        return await AsyncStorage.getItem('first');
    } catch (e) {
        throw e;
    }
};
let stPassed = false;

let launched = false;
export function convertDate(today, i, str) {
    const hourMin = str.split(':');
    const d = new Date(
        year,
        new Date().getMonth(),
        new Date().getDate(),
        i == 0 || (i === 1 && hourMin[0].length === 2)
            ? parseInt(hourMin[0])
            : 12 + parseInt(hourMin[0]),
        parseInt(hourMin[1])
    );
    if (today) {
        return d;
    } else {
        d.setDate(d.getDate() + 1);
        return d;
    }
}
const dateObj = new Date();
const year = dateObj.getFullYear();
const salahNamesOnly = ['Fajr', 'Zuhr', 'Asr', 'Maghrib', 'Isha'];
const monthsLong = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const islamicMonthsLong = [
    'Muharram',
    'Safar',
    'Rabi Al-Awaal',
    'Rabi Al-Akhir',
    'Jamada Al-Ula',
    'Jamada Al-Akhirah',
    'Rajab',
    "Sha'ban",
    'Ramadan',
    'Shawwal',
    "Dhul Al-Qa'dah",
    'Dhul Al-Hijjah',
];
const xCord = '51.52952175760636';
const yCord = '-0.046477784406827434';
const ios = Platform.OS === 'ios';
const mapLocation = ios
    ? `maps:${xCord},${yCord}?q=Baitul Mamur Academy`
    : `geo:${xCord},${yCord}?q=Baitul Mamur Academy`;
const prayerNames = ['', 'Fajr', 'Sunrise', 'Zuhr', ' Asr ', 'Maghrib', 'Isha'];
const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];
export const bgColor = 'rgb(0,0,55)';
const windowWidth = Dimensions.get('window').width;
global.startInterval = null;
global.salahInterval = null;
global.bothInterval = null;
global.noneInterval = null;
export default function Home({ navigation }) {
    const [shouldCheckNextSalah, setShouldCheckNextSalah] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const clearAll = async () => {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            // clear error
        }
    };
    const setFajrAlarm = () => {
        if (!allowsNotifications) {
            notificationsDisabledMsg();
            return;
        }
        const changeFajr = [!fajrAlert[0], fajrAlert[1], fajrAlert[2]];
        setFajrAlert(changeFajr);
        setAlarmData('fajr', changeFajr);
    };
    const setZuhrAlarm = () => {
        if (!allowsNotifications) {
            notificationsDisabledMsg();
            return;
        }
        const changeZuhr = [!zuhrAlert[0], zuhrAlert[1], zuhrAlert[2]];
        setZuhrAlert(changeZuhr);
        setAlarmData('zuhr', changeZuhr);
    };
    const setAsrAlarm = () => {
        if (!allowsNotifications) {
            notificationsDisabledMsg();
            return;
        }
        const changeAsr = [!asrAlert[0], asrAlert[1], asrAlert[2]];
        setAsrAlert(changeAsr);
        setAlarmData('asr', changeAsr);
    };
    const setMaghribAlarm = () => {
        if (!allowsNotifications) {
            notificationsDisabledMsg();
            return;
        }
        const changeMaghrib = [
            !maghribAlert[0],
            maghribAlert[1],
            maghribAlert[2],
        ];
        setMaghribAlert(changeMaghrib);
        setAlarmData('maghrib', changeMaghrib);
    };
    const setIshaAlarm = () => {
        if (!allowsNotifications) {
            notificationsDisabledMsg();
            return;
        }
        const changeIsha = [!ishaAlert[0], ishaAlert[1], ishaAlert[2]];
        setIshaAlert(changeIsha);
        setAlarmData('isha', changeIsha);
    };

    setFirstLaunch = async (value) => {
        try {
            await AsyncStorage.setItem('first', value);
        } catch (e) {
            // save error
        }
    };

    removeTimesData = async () => {
        try {
            await AsyncStorage.removeItem('times');
        } catch (e) {
            // remove error
        }
    };

    function checkNextSalah() {
        if (todaySalahs[0][0] !== null) {
            let nextSalahSet = false;
            const startOnlyTimer = startCountDownTimer && !salahCountDownTimer;
            for (let i = 0; i < todaySalahs.length; i++) {
                const salahTime = convertDate(true, i, todaySalahs[i][0]);
                const startTime = convertDate(true, i, todaySalahs[i][1]);
                if (
                    (startOnlyTimer && startTime > Date.now()) ||
                    (salahTime > Date.now() && !startOnlyTimer)
                ) {
                    setNextSalah([salahNamesOnly[i], salahTime, startTime]);
                    nextSalahSet = true;
                    break;
                }
            }
            if (
                !nextSalahSet ||
                convertDate(
                    true,
                    todaySalahs.length - 1,
                    todaySalahs[todaySalahs.length - 1][0]
                ) < Date.now() ||
                (startOnlyTimer &&
                    convertDate(
                        true,
                        todaySalahs.length - 1,
                        todaySalahs[todaySalahs.length - 1][1]
                    ) < Date.now())
            ) {
                const tmrroFajrSalah = convertDate(false, 0, tmrroSalahs[0][0]);
                const tmrroFajrStart = convertDate(false, 0, tmrroSalahs[0][1]);
                if (
                    tmrroSalahs[0][0] !== null &&
                    ((tmrroFajrSalah > Date.now() && !startOnlyTimer) ||
                        (startOnlyTimer && tmrroFajrStart > Date.now()))
                ) {
                    setNextSalah([
                        salahNamesOnly[0],
                        tmrroFajrSalah,
                        tmrroFajrStart,
                    ]);
                }
            }
            if (startThenSalah && Date.now() > nextSalah[2]) {
                stPassed = false;
            }
        }
    }
    function replaceZero(num) {
        if (num.toString().length === 1) {
            return '0' + num;
        }
        return num;
    }
    function startSalahCountDownF() {
        if (nextSalah[1] !== null) {
            var now = new Date().getTime();
            if (now > nextSalah[1]) {
                stPassed = false;
                setStartSalahCountDown('00:00:00');
                setShouldCheckNextSalah(!shouldCheckNextSalah);
            } else if (now > nextSalah[2] && !stPassed) {
                setStartSalahCountDown('00:00:00');
                stPassed = true;
            } else {
                var distance = nextSalah[2] - now;
                if (stPassed) {
                    distance = nextSalah[1] - now;
                }
                var hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                var minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60)
                );
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setStartSalahCountDown(
                    replaceZero(hours) +
                        ':' +
                        replaceZero(minutes) +
                        ':' +
                        replaceZero(seconds)
                );
            }
            // }
        }
    }
    useEffect(() => {
        setStartPassed(stPassed);
    }, [stPassed]);
    function startCountDownF() {
        if (nextSalah[1] !== null) {
            var now = new Date().getTime();
            if (now > nextSalah[2]) {
                if (startCountDownTimer && !salahCountDownTimer) {
                    var hours = ' __';
                    var minutes = '__';
                    var seconds = '__';
                    setShouldCheckNextSalah(!shouldCheckNextSalah);
                } else {
                    var hours = '00';
                    var minutes = '00';
                    var seconds = '00';
                }
            } else {
                var distance = nextSalah[2] - now;
                var hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                var minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60)
                );
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            }
            setStartCountDown(
                replaceZero(hours) +
                    ':' +
                    replaceZero(minutes) +
                    ':' +
                    replaceZero(seconds)
            );
        }
    }
    function salahCountDownF() {
        if (nextSalah[1] != null) {
            var now = new Date().getTime();
            if (now > nextSalah[1]) {
                var hours = '00';
                var minutes = '00';
                var seconds = '00';
                setShouldCheckNextSalah(!shouldCheckNextSalah);
            } else {
                var distance = nextSalah[1] - now;

                var hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                var minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60)
                );
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            }
            setSalahCountDown(
                replaceZero(hours) +
                    ':' +
                    replaceZero(minutes) +
                    ':' +
                    replaceZero(seconds)
            );
        }
    }
    function noneCountDownF() {
        if (nextSalah[1] != null) {
            if (Date.now() > nextSalah[1]) {
                setShouldCheckNextSalah(!shouldCheckNextSalah);
            }
        }
    }
    const showAndroidDatePicker = () => {
        DateTimePickerAndroid.open({
            value: datePicker,
            onChange,
            mode: 'date',
            maximumDate: new Date(year, 11, 31),
            minimumDate: new Date(year, 0, 1),
        });
    };
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        if (ios) {
            if (currentDate.getFullYear() !== year) {
                setNotCurrentYear(true);
            } else {
                setNotCurrentYear(false);
                setDatePicker(currentDate);
            }
        } else {
            if (event.type === 'set') {
                setOpen(false);
                setDate(currentDate.getDate());
                setMonth(currentDate.getMonth());
                const nDate = new Date(datePicker);
                nDate.setDate(nDate.getDate() - 1);
                setDay(nDate.getDay());
            } else {
                setOpen(false);
            }
        }
    };

    const reset = () => {
        const nDate = new Date();
        const nDay = nDate.getDay() === 0 ? 6 : nDate.getDay() - 1;
        setDate(nDate.getDate());
        setMonth(nDate.getMonth());
        setDay(nDay);
        setDatePicker(new Date());
    };
    const suffix = (date) => {
        if (date > 3 && date < 21) return 'th';
        switch (date % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    };
    const confirmOpen = () => {
        setDate(datePicker.getDate());
        setMonth(datePicker.getMonth());
        const nDate = new Date(datePicker);
        nDate.setDate(nDate.getDate() - 1);
        setDay(nDate.getDay());
        setOpen(false);
    };
    const cancelOpen = () => {
        setOpen(false);
        setNotCurrentYear(false);

        setDatePicker(new Date(year, month, date));
    };
    const decrementDate = () => {
        if (date === 1) {
            if (month === 0) {
                setMonth(11);
                setDate(times[11].length);
                setDatePicker(new Date(year, 11, times[11].length));
            } else {
                setMonth(month - 1);
                setDate(times[month - 1].length);
                setDatePicker(
                    new Date(year, month - 1, times[month - 1].length)
                );
            }
        } else {
            setDate(date - 1);
            setDatePicker(new Date(year, month, date - 1));
        }
        if (month === 0 && date === 1) {
            const nDate = new Date(year, 11, 30);
            setDay(nDate.getDay());
        } else {
            const nDate = new Date(year, month, date - 1);
            nDate.setDate(nDate.getDate() - 1);
            setDay(nDate.getDay());
        }
    };
    const incrementDate = () => {
        setDay(day + 1);
        if (date === times[month].length) {
            if (month === 11) {
                setMonth(0);
                setDate(1);
                setDatePicker(new Date(year, 0, 1));
            } else {
                setMonth(month + 1);
                setDate(1);
                setDatePicker(new Date(year, month + 1, 1));
            }
        } else {
            setDate(date + 1);
            setDatePicker(new Date(year, month, date + 1));
        }
        if (month === 11 && date === 31) {
            const nDate = new Date(year, 0, 0);
            setDay(nDate.getDay());
        } else {
            const nDate = new Date(year, month, date);
            nDate.setDate(nDate.getDate());
            setDay(nDate.getDay());
        }
    };

    const {
        salahCountDownTimer,
        startCountDownTimer,
        startThenSalah,
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
        times,
        allowsNotifications,
        todaySalahs,
        tmrroSalahs,
    } = useContext(global.AppContext);

    const [startPassed, setStartPassed] = useState(false);
    const [startSalahCountDown, setStartSalahCountDown] = useState(' __:__:__');
    const [salahCountDown, setSalahCountDown] = useState(' __:__:__');
    const [startCountDown, setStartCountDown] = useState(' __:__:__');

    const [month, setMonth] = useState(dateObj.getMonth());
    const [day, setDay] = useState(
        dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1
    );
    const [date, setDate] = useState(dateObj.getDate());
    const hijriDate = new hijrahDate(new Date(year, month, date));
    const [notCurrentYear, setNotCurrentYear] = useState(false);
    const [open, setOpen] = useState(false);
    const [datePicker, setDatePicker] = useState(new Date());

    const [nextSalah, setNextSalah] = useState(['-', null, null]);

    const [salahChanges, setSalahChanges] = useState([]);
    useEffect(() => {
        let salahAnnouncements = [];
        if (tmrroSalahs[0][0] !== null) {
            for (let i = 0; i < todaySalahs.length; i++) {
                if (i !== 3) {
                    if (
                        todaySalahs[i][0] !== tmrroSalahs[i][0] &&
                        !salahChanges.includes(salahNamesOnly[i])
                    ) {
                        const change = convertDate(true, i, todaySalahs[i][0]);
                        salahAnnouncements.push(
                            salahNamesOnly[i] +
                                " jama'ah will be changing to " +
                                tmrroSalahs[i][0] +
                                ' tomorrow'
                        );
                    }
                }
            }
        }
        setSalahChanges(salahAnnouncements);
    }, [todaySalahs, tmrroSalahs]);
    useEffect(() => {
        checkNextSalah();
    }, [
        startThenSalah,
        startCountDownTimer,
        salahCountDownTimer,
        todaySalahs,
        tmrroSalahs,
        preferMithl1,
        shouldCheckNextSalah,
    ]);
    useEffect(() => {
        if (nextSalah[1] !== null) {
            clearInterval(global.startInterval);
            clearInterval(global.salahInterval);
            clearInterval(global.bothInterval);
            clearInterval(global.noneInterval);
            global.startInterval = null;
            global.salahInterval = null;
            global.bothInterval = null;
            global.noneInterval = null;
            if (startCountDownTimer) {
                global.startInterval = setInterval(startCountDownF, 1000);
            }
            if (salahCountDownTimer) {
                global.salahInterval = setInterval(salahCountDownF, 1000);
            }
            if (startThenSalah) {
                global.bothInterval = setInterval(startSalahCountDownF, 1000);
            }
            if (!(startCountDownTimer | salahCountDownTimer | startThenSalah)) {
                global.noneInterval = setInterval(noneCountDownF, 1000);
            }
        }
    }, [
        nextSalah,
        startThenSalah,
        startCountDownTimer,
        salahCountDownTimer,
        todaySalahs,
        tmrroSalahs,
    ]);
    function checkSalahChanges(array) {
        for (let i = array.length - 1; i > -1; i--) {
            if (
                array[i].includes('Isha') &&
                convertDate(true, 4, todaySalahs[4][0]) < Date.now()
            ) {
                return array[i];
            }
            if (
                array[i].includes('Asr') &&
                convertDate(true, 2, todaySalahs[2][0]) < Date.now()
            ) {
                return array[i];
            }
            if (
                array[i].includes('Zuhr') &&
                convertDate(true, 1, todaySalahs[1][0]) < Date.now()
            ) {
                return array[i];
            }
        }
        return array[0];
    }
    useEffect(() => {
        getFirstLaunch()
            .then((val) => {
                if (
                    val === null &&
                    Object.keys(times[0][0]).length !== 0 &&
                    !launched
                ) {
                    setFirstLaunch('launched');
                    navigation.navigate('Settings');

                    Alert.alert(
                        'Please Adjust the settings to your preferences'
                    );
                    Alert.alert('Welcome to the \nBaitul Mamur Academy App');
                    launched = true;
                }
            })
            .catch((e) => {});
    }, [times]);
    return (
        <SafeAreaView
            style={styles.container}
            contentInsetAdjustmentBehavior="automatic"
        >
            <ScrollView>
                <View style={styles.top}>
                    <TouchableOpacity>
                        <SettingsIcon height={50} width={50} color={bgColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <SettingsIcon height={50} width={50} />
                    </TouchableOpacity>
                </View>
                <View style={styles.horizontalC}>
                    <Image source={require('../Assets/logo.png')} />
                    <Text style={styles.logoText}>Baitul Mamur</Text>
                    <View style={styles.academy}>
                        <View style={styles.hr} />
                        <Text style={styles.academyText}>Academy</Text>
                        <View style={styles.hr} />
                    </View>
                </View>
                {salahChanges[0] && (
                    <View style={styles.salahChangesWrapper}>
                        <Text style={styles.salahChangesText}>
                            Insha'Allah, {checkSalahChanges(salahChanges)}
                        </Text>
                        {salahChanges.length > 1 ? (
                            <Text
                                style={styles.salahChangesText}
                                onPress={() => setModalVisible(true)}
                            >
                                Click to view more jama'ah changes
                            </Text>
                        ) : null}
                    </View>
                )}

                <View style={styles.calendarWrapper}>
                    <TouchableOpacity onPress={() => decrementDate()}>
                        <LeftArrow />
                    </TouchableOpacity>
                    <View style={styles.calendarCenter}>
                        <Text style={styles.date}>
                            {days[day]} {date + suffix(date)}{' '}
                            {monthsLong[month]} {year}
                        </Text>
                        <Text style={styles.date}>
                            {hijriDate._dayOfMonth}{' '}
                            {islamicMonthsLong[hijriDate._monthOfYear - 1]}{' '}
                            {hijriDate._year} AH
                        </Text>
                        <View style={styles.calendarView}>
                            <TouchableOpacity
                                style={styles.calendar}
                                onPress={
                                    ios
                                        ? () => setOpen(!open)
                                        : showAndroidDatePicker
                                }
                            >
                                <Calendar />
                            </TouchableOpacity>

                            {month === new Date().getMonth() &&
                            date === new Date().getDate() ? null : (
                                <Text
                                    style={styles.resetDate}
                                    onPress={() => reset()}
                                >
                                    Reset date
                                </Text>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => incrementDate()}>
                        <RightArrow />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Donate', { ios: ios })}
                    style={styles.donateContainer}
                >
                    <Text style={styles.donate}>Donate</Text>
                </TouchableOpacity>
                <Text style={[styles.salahIn, styles.salahInTitle]}>
                    Next {nextSalah[0]}
                </Text>
                {ios ? (
                    <View style={styles.iosTimersWrapper}>
                        {startCountDownTimer ? (
                            <View style={styles.iosTimersContainer}>
                                <View>
                                    <Text
                                        style={[
                                            styles.white,
                                            styles.iosStartSalah,
                                        ]}
                                    >
                                        Starts in{' '}
                                    </Text>
                                </View>
                                <View style={styles.iosCountDownWrapper}>
                                    <Text
                                        style={[
                                            styles.white,
                                            styles.iosTimerText,
                                        ]}
                                    >
                                        {startCountDown}
                                    </Text>
                                </View>
                            </View>
                        ) : null}
                        {startCountDownTimer && salahCountDownTimer ? (
                            <Text style={[styles.split]}>|</Text>
                        ) : null}
                        {salahCountDownTimer ? (
                            <View style={styles.iosTimersContainer}>
                                <View>
                                    <Text
                                        style={[
                                            styles.white,
                                            styles.iosStartSalah,
                                        ]}
                                    >
                                        Jama'ah in{' '}
                                    </Text>
                                </View>
                                <View style={styles.iosCountDownWrapper}>
                                    <Text
                                        style={[
                                            styles.white,
                                            styles.iosTimerText,
                                        ]}
                                    >
                                        {salahCountDown}
                                    </Text>
                                </View>
                            </View>
                        ) : null}
                        {startThenSalah ? (
                            <View style={styles.iosTimersContainer}>
                                <View>
                                    <Text
                                        style={[
                                            styles.white,
                                            styles.iosStartSalah,
                                        ]}
                                    >
                                        {startPassed
                                            ? "Jama'ah in"
                                            : 'Start in'}{' '}
                                    </Text>
                                </View>
                                <View style={styles.iosCountDownWrapper}>
                                    <Text
                                        style={[
                                            styles.white,
                                            styles.iosTimerText,
                                        ]}
                                    >
                                        {startSalahCountDown}
                                    </Text>
                                </View>
                            </View>
                        ) : null}
                    </View>
                ) : (
                    <View style={[styles.salahIn, styles.salahInTime]}>
                        {startCountDownTimer ? (
                            <Text style={styles.timerText}>
                                Starts in {' ' + startCountDown}
                            </Text>
                        ) : null}
                        {startCountDownTimer && salahCountDownTimer ? (
                            <Text style={styles.split}>|</Text>
                        ) : null}
                        {salahCountDownTimer ? (
                            <Text style={styles.timerText}>
                                Jama'ah in {' ' + salahCountDown}
                            </Text>
                        ) : null}
                        {startThenSalah ? (
                            <Text style={styles.timerText}>
                                {startPassed ? "Jama'ah in" : 'Start in'}{' '}
                                {' ' + startSalahCountDown}
                            </Text>
                        ) : null}
                    </View>
                )}
                <View style={styles.table}>
                    <View style={styles.row}>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {prayerNames[0]}
                            </Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>Start</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>Jama'ah</Text>
                        </View>
                        <View
                            style={[styles.cell, styles.halfCell, styles.Bell]}
                        >
                            <BellOn color={bgColor} />
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {prayerNames[1]}
                            </Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {Object.keys(times[0][0]).length !== 0
                                    ? times[month][date - 1].Fajr_start
                                    : null}
                            </Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {Object.keys(times[0][0]).length !== 0
                                    ? times[month][date - 1].Fajr_jamaah
                                    : null}
                            </Text>
                        </View>
                        <View
                            style={[styles.cell, styles.halfCell, styles.Bell]}
                        >
                            <TouchableOpacity onPress={() => setFajrAlarm()}>
                                {fajrAlert[0] ? <BellOn /> : <BellOff />}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {prayerNames[2]}
                            </Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {Object.keys(times[0][0]).length !== 0
                                    ? times[month][date - 1].Sunrise
                                    : null}
                            </Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>-</Text>
                        </View>
                        <View
                            style={[styles.cell, styles.halfCell, styles.Bell]}
                        >
                            <BellOn color={bgColor} />
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {prayerNames[3]}
                            </Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {Object.keys(times[0][0]).length !== 0
                                    ? times[month][date - 1].Zuhr_start
                                    : null}
                            </Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {Object.keys(times[0][0]).length !== 0
                                    ? times[month][date - 1].Zuhr_jamaah
                                    : null}
                            </Text>
                        </View>
                        <View
                            style={[styles.cell, styles.halfCell, styles.Bell]}
                        >
                            <TouchableOpacity onPress={() => setZuhrAlarm()}>
                                {zuhrAlert[0] ? <BellOn /> : <BellOff />}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <View style={[styles.cell, styles.halfCell]}>
                                <Text style={styles.cellText}>
                                    {prayerNames[4]}
                                </Text>
                            </View>
                            <View>
                                <View
                                    style={[
                                        styles.cell,
                                        styles.halfCell,
                                        styles.mithlBox,
                                    ]}
                                >
                                    <Text style={styles.mithText}>Mithl 1</Text>
                                </View>
                                <View
                                    style={[
                                        styles.cell,
                                        styles.halfCell,
                                        styles.mithlBox,
                                    ]}
                                >
                                    <Text style={styles.mithText}>Mithl 2</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={styles.cell}>
                                <Text style={styles.cellText}>
                                    {Object.keys(times[0][0]).length !== 0
                                        ? times[month][date - 1].Asr_start1
                                        : null}
                                </Text>
                            </View>
                            <View style={styles.cell}>
                                <Text style={styles.cellText}>
                                    {Object.keys(times[0][0]).length !== 0
                                        ? times[month][date - 1].Asr_start2
                                        : null}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {Object.keys(times[0][0]).length !== 0
                                    ? times[month][date - 1].Asr_jamaah
                                    : null}
                            </Text>
                        </View>
                        <View
                            style={[styles.cell, styles.halfCell, styles.Bell]}
                        >
                            <TouchableOpacity onPress={() => setAsrAlarm()}>
                                {asrAlert[0] ? <BellOn /> : <BellOff />}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {prayerNames[5]}
                            </Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {Object.keys(times[0][0]).length !== 0
                                    ? times[month][date - 1].Maghrib_start
                                    : null}
                            </Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {Object.keys(times[0][0]).length !== 0
                                    ? times[month][date - 1].Maghrib_jamaah
                                    : null}
                            </Text>
                        </View>
                        <View
                            style={[styles.cell, styles.halfCell, styles.Bell]}
                        >
                            <TouchableOpacity onPress={() => setMaghribAlarm()}>
                                {maghribAlert[0] ? <BellOn /> : <BellOff />}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {prayerNames[6]}
                            </Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {Object.keys(times[0][0]).length !== 0
                                    ? times[month][date - 1].Isha_start
                                    : null}
                            </Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>
                                {Object.keys(times[0][0]).length !== 0
                                    ? times[month][date - 1].Isha_jamaah
                                    : null}
                            </Text>
                        </View>
                        <View
                            style={[styles.cell, styles.halfCell, styles.Bell]}
                        >
                            <TouchableOpacity onPress={() => setIshaAlarm()}>
                                {ishaAlert[0] ? <BellOn /> : <BellOff />}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.contactContainer}>
                    <Text style={styles.contactTitle}>Contact us at</Text>
                    <Text
                        onPress={() => {
                            Linking.openURL(
                                'mailto:baitul.mamur.academy@gmail.com'
                            );
                        }}
                        style={styles.contactText}
                    >
                        baitul.mamur.academy@gmail.com{'  '}
                        <View>
                            <Open />
                        </View>
                    </Text>
                    <Text style={styles.contactTitle}>Find us at</Text>
                    <Text
                        onPress={() => {
                            Linking.openURL(mapLocation);
                        }}
                        style={styles.contactText}
                    >
                        Baitul Mamur Academy {'\n'}191 Roman Road {'\n'}London{' '}
                        {'\n'}E2 0QY{' '}
                        <View>
                            <Open />
                        </View>
                    </Text>
                    {ios ? (
                        <Text
                            style={styles.contactText}
                            onPress={() => {
                                Linking.openURL(
                                    'https://goo.gl/maps/af9T2dUXdhetmVgU7'
                                );
                            }}
                        >
                            Open in google maps
                        </Text>
                    ) : null}
                </View>
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
                style={styles.modal}
            >
                <View style={styles.datePickerOpaqueBg}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.modalCross}
                        >
                            <Cross />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Insha'Allah</Text>
                        {salahChanges.map((data, key) => {
                            return (
                                <Text style={styles.modalText} key={key}>
                                    {data}
                                </Text>
                            );
                        })}
                    </View>
                </View>
            </Modal>
            {open && ios && (
                <>
                    <View
                        style={styles.datePickerOpaqueBg}
                        onStartShouldSetResponder={() => cancelOpen()}
                    ></View>
                    <View style={styles.datePickerContainer}>
                        <View style={styles.cancelSetContainer}>
                            <Text
                                style={styles.cancelText}
                                onPress={() => cancelOpen()}
                            >
                                Cancel
                            </Text>
                            <Text
                                style={[
                                    notCurrentYear ? styles.grey : styles.white,
                                    styles.setText,
                                ]}
                                onPress={() => confirmOpen()}
                                disabled={notCurrentYear}
                            >
                                Set
                            </Text>
                        </View>

                        <Text
                            style={[
                                notCurrentYear ? styles.white : styles.black,
                                styles.datePickerYearError,
                            ]}
                        >
                            Please enter a date from the current year
                        </Text>

                        <DateTimePicker
                            testID="dateTimePicker"
                            value={datePicker}
                            onChange={onChange}
                            display="spinner"
                            themeVariant="dark"
                        />
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: bgColor,
        // paddingTop: ios ?  0:StatusBar.currentHeight,
    },
    horizontalC: {
        alignItems: 'center',
        paddingBottom: '2%',
    },
    hr: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgb(252,243,243)',
    },
    logoText: {
        marginTop: 2,
        color: 'rgb(252,243,243)',
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
    },
    academyText: {
        color: 'rgb(252,243,243)',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    academy: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 160,
    },
    donateContainer: {
        backgroundColor: 'green',
        marginTop: 2,
        marginBottom: 10,
    },
    donate: {
        color: 'white',
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    date: {
        color: 'white',
        fontSize: 20,
    },
    contactText: {
        color: 'white',
    },
    contactTitle: {
        color: 'white',
        fontSize: 22,
        marginVertical: 2,
    },
    contactContainer: {
        paddingLeft: '3%',
        marginTop: '5%',
    },
    calendarWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '1%',
        paddingTop: '2%',
        paddingBottom: '2%',
    },
    calendarCenter: {
        alignItems: 'center',
        flex: 1,
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '2%',
        paddingTop: 10,
        paddingBottom: 5,
        alignItems: 'center',
    },
    table: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    Bell: {
        borderWidth: 0,
        width: windowWidth / 10,
    },
    cell: {
        paddingVertical: '.5%',
        width: windowWidth / 3.5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
    },
    halfCell: {
        width: windowWidth / 7,
    },
    cellText: {
        fontSize: 25,
        color: 'white',
    },
    mithText: {
        color: 'white',
        fontSize: 16,
    },
    mithlBox: {
        flex: 1,
    },
    salahIn: {
        color: 'white',
        textAlign: 'center',
        fontSize: 25,
        paddingVertical: '2%',
    },
    resetDate: {
        // marginTop: '1%',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'white',
        color: 'white',
        padding: '1.5%',
        marginLeft: '10%',
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 1,
        // textAlignVertical: 'center',
        paddingBottom: '1%',
        paddingTop: ios ? '1.75%' : '1.7%',
    },
    calendarView: {
        flexDirection: 'row',
        marginTop: '2.75%',
        marginBottom: '0.75%',
    },
    calendar: {
        padding: '1.5%',
        paddingRight: 0,
        paddingBottom: 0,
        marginBottom: ios ? '1.5%' : '1%',
    },
    white: {
        color: 'white',
    },
    grey: {
        color: '#C0C0C0',
    },
    black: {
        color: 'black',
    },
    salahInTitle: {
        paddingBottom: 0,
    },
    salahInTime: {
        paddingTop: '0%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
    },
    iosTimerText: {
        // backgroundColor: 'red',
        marginLeft: 2,
        fontSize: 20,
    },
    iosStartSalah: {
        fontSize: 20,
        // backgroundColor: 'black',
    },
    iosTimersContainer: {
        flexDirection: 'row',
    },
    iosTimersWrapper: {
        // backgroundColor: 'green',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 7.5,
    },
    iosCountDownWrapper: {
        // backgroundColor: 'yellow',
        width: 88,
    },
    timerText: {
        fontSize: 20,
        color: 'white',
        // flex: 1,
        // textAlign: 'center',
    },
    split: {
        fontSize: 20,
        color: 'white',
    },
    datePickerOpaqueBg: {
        position: 'absolute',
        flex: 1,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        color: 'red',
        height: '100%',
        width: '100%',
        // opacity: ios ? '100%' : 0,
    },
    datePickerContainer: {
        backgroundColor: 'black',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '40%',
    },
    cancelSetContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '15%',
    },
    cancelText: {
        color: 'white',
        width: '50%',
        textAlign: 'center',
    },
    setText: {
        width: '50%',
        textAlign: 'center',
    },
    datePickerYearError: {
        textAlign: 'center',
    },
    salahChangesWrapper: { backgroundColor: 'red', paddingVertical: 2 },
    salahChangesText: { color: 'white', textAlign: 'center' },
    modal: { paddingTop: 100 },
    modalContainer: {
        marginVertical: Dimensions.get('screen').height / 4,
        backgroundColor: 'red',
        marginHorizontal: Dimensions.get('window').width / 6,
        borderRadius: 25,
        flex: 1,
    },
    modalCross: {
        alignItems: 'flex-end',
        paddingHorizontal: 10,
    },
    modalTitle: {
        color: 'white',
        paddingHorizontal: 10,
        fontSize: 20,
        textAlign: 'center',
    },
    modalText: {
        color: 'white',
        paddingHorizontal: 10,
        fontSize: 20,
        paddingVertical: 5,
    },
});
