import { TouchableOpacity, View, Text, StyleSheet, Alert } from 'react-native';
import Info from '../Svgs/Info';
export default function SettingSubTitle({ title, alertMessage }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={() => Alert.alert(title, alertMessage)}>
                <Info />
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 30,
        textAlign: 'center',
        marginRight: 10,
    },
    container: {
        marginVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
