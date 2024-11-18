import { StyleSheet, View, Text, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { setAlarmData } from './Home';
const ios = Platform.OS === 'ios';
export default function PrayerAlert({
    timePicker,
    prayer,
    timeValue,
    salahPicked,
    setPrayerEdit,
    setAlert,
    alertOn,
}) {
    const timeVal = timeValue.toString();
    const startSalahVal = salahPicked ? "Jama'ah" : 'Start';
    const [selectedLanguage, setSelectedLanguage] = useState(
        timePicker ? timeVal : startSalahVal
    );
    const time = ['0', '5', '10', '15', '20', '25', '30', '45', '60'];
    const startSalah = ["Jama'ah", 'Start'];
    const pickerRef = useRef(null);

    function open() {
        pickerRef.current.focus();
    }

    useEffect(() => {
        if (pickerRef !== null && !ios) {
            open();
        }
    }, []);
    function saveAlert(value) {
        if (timePicker) {
            const newAlert = [alertOn, salahPicked, parseInt(value)];
            setAlert(newAlert);
            setAlarmData(prayer.toLowerCase(), newAlert);
        } else {
            const newAlert = [alertOn, value === "Jama'ah", timeValue];
            setAlert(newAlert);
            setAlarmData(prayer.toLowerCase(), newAlert);
        }
        setPrayerEdit([false, false]);
    }
    if (ios) {
        return (
            <>
                <View
                    style={styles.opaqueBg}
                    onStartShouldSetResponder={() =>
                        setPrayerEdit([false, false])
                    }
                ></View>
                <View style={styles.pickerContainer}>
                    <View>
                        <View style={styles.iosCancelSetContainer}>
                            <Text
                                style={styles.iosCancelSetText}
                                onPress={() => setPrayerEdit([false, false])}
                            >
                                Cancel
                            </Text>
                            <Text
                                style={styles.iosCancelSetText}
                                onPress={() => saveAlert(selectedLanguage)}
                            >
                                Set
                            </Text>
                        </View>
                        <Text style={styles.iosPlacementText}>
                            Notify {timePicker ? selectedLanguage : timeVal}{' '}
                            minutes before {prayer}{' '}
                            {timePicker ? startSalahVal : selectedLanguage}
                        </Text>
                    </View>
                    <Picker
                        selectedValue={selectedLanguage}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedLanguage(itemValue)
                        }
                        // style={{ backgroundColor: 'red' }}
                    >
                        {timePicker
                            ? time.map((data, key) => {
                                  return (
                                      <Picker.Item
                                          key={key}
                                          color="white"
                                          label={data}
                                          value={data}
                                      />
                                  );
                              })
                            : startSalah.map((data, key) => {
                                  return (
                                      <Picker.Item
                                          key={key}
                                          color="white"
                                          label={data}
                                          value={data}
                                      />
                                  );
                              })}
                    </Picker>
                </View>
            </>
        );
    }
    return (
        <Picker
            ref={pickerRef}
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) => {
                saveAlert(itemValue);
            }}
            onBlur={() => setPrayerEdit([false, false])}
            style={styles.noDisplay}
        >
            {timePicker ? (
                <Picker.Item
                    enabled={false}
                    label={
                        'Notify __ minutes before ' +
                        prayer +
                        ' ' +
                        startSalahVal
                    }
                />
            ) : (
                <Picker.Item
                    enabled={false}
                    label={
                        'Notify ' +
                        timeVal +
                        ' minutes before ' +
                        prayer +
                        ' __'
                    }
                />
            )}
            {timePicker
                ? time.map((data, key) => {
                      return (
                          <Picker.Item key={key} label={data} value={data} />
                      );
                  })
                : startSalah.map((data, key) => {
                      return (
                          <Picker.Item
                              key={key}
                              //   color="white"
                              label={data}
                              value={data}
                          />
                      );
                  })}
        </Picker>
    );
}

const styles = StyleSheet.create({
    opaqueBg: {
        position: 'absolute',
        flex: 1,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        height: '100%',
        width: '100%',
        // opacity: ios ? '100%' : 0,
    },
    pickerContainer: {
        backgroundColor: 'black',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '40%',
    },
    iosPlacementText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
        paddingVertical: 5,
    },
    iosCancelSetText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15,
        flex: 1,
        paddingVertical: 15,
    },
    iosCancelSetContainer: { flexDirection: 'row' },
    noDisplay: { display: 'none' },
});
