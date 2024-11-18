import { StyleSheet, View, Text, Switch } from 'react-native';
export default function PrayerChanges({
    prayer,
    toggleChanges,
    salahChangesI,
}) {
    return (
        <View style={styles.row}>
            <Switch
                trackColor={{ false: 'grey', true: 'green' }}
                thumbColor="white"
                ios_backgroundColor="grey"
                onValueChange={() => toggleChanges()}
                value={salahChangesI}
            />
            <Text style={styles.text}>{prayer}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginVertical: 5,
        paddingLeft: 10,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 25,
        marginLeft: 7.5,
    },
});
