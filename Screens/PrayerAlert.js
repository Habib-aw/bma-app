import {
    StyleSheet,
    View,
    Text,
    Switch,
    TouchableOpacity,
    Platform,
} from 'react-native';
import Pencil from '../Svgs/Pencil';
import { bgColor } from './Home';
export default function PrayerAlert({
    prayer,
    toggleAlert,
    alert,
    edit,
    setPrayerEdit,
}) {
    return (
        <View style={styles.fieldSet}>
            <Text style={styles.legend}>{prayer}</Text>
            <View style={styles.fieldSetContent}>
                {edit ? null : (
                    <View style={styles.fieldSetSwitch}>
                        <Switch
                            trackColor={{ false: 'grey', true: 'green' }}
                            thumbColor="white"
                            ios_backgroundColor="grey"
                            onValueChange={() => toggleAlert()}
                            value={alert[0]}
                        />
                    </View>
                )}
                <View
                    style={edit ? styles.fieldSetText100 : styles.fieldSetText}
                >
                    <View style={edit && styles.editSingleWrapper}>
                        <Text style={styles.text}>
                            Notify{' '}
                            <Text
                                style={edit ? styles.editing : styles.text}
                                onPress={() => setPrayerEdit([true, true])}
                            >
                                {alert[2]}
                            </Text>{' '}
                            minutes before
                        </Text>
                        {edit ? (
                            <Text>
                                {' '}
                                <TouchableOpacity
                                    onPress={() => setPrayerEdit([true, true])}
                                >
                                    <Pencil />
                                </TouchableOpacity>
                            </Text>
                        ) : null}
                    </View>
                    <View style={edit && styles.editSingleWrapper}>
                        <Text style={styles.text}>
                            {prayer + ' '}
                            <Text
                                style={edit ? styles.editing : styles.text}
                                onPress={() => setPrayerEdit([true, false])}
                            >
                                {alert[1] ? "Jama'ah" : 'Start'}
                            </Text>
                        </Text>
                        {edit ? (
                            <Text>
                                {' '}
                                <TouchableOpacity
                                    onPress={() => setPrayerEdit([true, false])}
                                >
                                    <Pencil />
                                </TouchableOpacity>
                            </Text>
                        ) : null}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fieldSet: {
        margin: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
        paddingTop: 13,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'white',
        color: 'white',
        zIndex: -1,
        marginBottom: 15,
    },
    legend: {
        position: 'absolute',
        top: -17.5,
        left: 20,
        paddingHorizontal: 2,
        // fontWeight: 'bold',
        fontSize: 25,
        color: 'white',
        zIndex: 10,
        backgroundColor: bgColor,
    },
    text: {
        color: 'white',
        fontSize: 22.5,
        marginLeft: 7.5,
    },
    editing: {
        color: 'grey',
        fontSize: 22.5,
        marginLeft: 7.5,
        textDecorationLine: 'underline',
    },
    fieldSetContent: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginLeft: 5,
    },
    fieldSetText100: {
        width: '100%',
    },
    fieldSetText: {
        width: '85%',
    },
    editSingleWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
});
