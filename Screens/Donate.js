import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
    TextInput,
    Image,
    Linking,
} from 'react-native';
import { useEffect, useState } from 'react';
import LeftArrow from '../Svgs/LeftArrow';
import { bgColor } from './Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    StripeProvider,
    initPaymentSheet,
    presentPaymentSheet,
} from '@stripe/stripe-react-native';
const protocol = 'https';
const domain = 'server.baitulmamur.academy';
export default function Donate({ route, navigation }) {
    const { ios } = route.params;
    const [buttons, setButtons] = useState([
        true,
        false,
        false,
        false,
        false,
        false,
    ]);
    const [disabled, setDisabled] = useState(false);
    const [success, setSuccess] = useState(false);
    const [other, setOther] = useState(false);
    const [otherVal, setOtherVal] = useState('5');
    const [amount, setAmount] = useState(5);
    const donationAmounts = [5, 10, 20, 50, 100, 'Other'];
    const [publishableKey, setPublishableKey] = useState('');
    const [loading, setLoading] = useState(false);
    const fetchPaymentSheetParams = async () => {
        const response = await fetch(
            protocol + '://' + domain + '/payment-sheet',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Math.round(amount * 100),
                }),
            }
        );
        const { paymentIntent } = await response.json();

        return {
            paymentIntent,
        };
    };

    const initializePaymentSheet = async () => {
        const { paymentIntent } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            merchantDisplayName: 'Baitul Mamur Academy',
            paymentIntentClientSecret: paymentIntent,
            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: true,
            // defaultBillingDetails: {
            //     name: 'Jane Doe',
            // },
            googlePay: {
                merchantCountryCode: 'GB',
                testEnv: true,
            },
            applePay: {
                merchantCountryCode: 'GB',
            },
        });
        if (error) {
            Alert.alert('Error', error);
            setDisabled(false);
            setLoading(false);
        }
    };
    const openPaymentSheet = async () => {
        setDisabled(true);
        setLoading(true);
        await initializePaymentSheet();
        const { error } = await presentPaymentSheet();

        if (error) {
            setLoading(false);
            setDisabled(false);
        } else {
            setLoading(false);
            setSuccess(true);
            setDisabled(false);
        }
    };

    function setBtnAmount(i) {
        const btns = [false, false, false, false, false, false];
        btns[i] = true;
        setButtons(btns);
        if (i !== donationAmounts.length - 1) {
            setAmount(parseFloat(donationAmounts[i]));
            setOther(false);
            setOtherVal('5');
        } else {
            setOther(true);
            setAmount(5);
        }
    }
    useEffect(() => {
        fetch(protocol + '://' + domain + '/public-key')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const { publishableKey } = data;
                setPublishableKey(publishableKey);
            })
            .catch((e) => {
                console.log('No internet?');
            });
    }, []);
    function amountToPounds(amount) {
        const strAmount = amount.toString();
        const dotIndex = strAmount.indexOf('.');
        if (dotIndex > -1 && dotIndex === strAmount.length - 2) {
            return strAmount + '0';
        }
        return amount;
    }

    const checkAmount = (text) => {
        let newText = '';
        const numbers = '0123456789';
        let numOnly = true;
        let dotCount = 0;
        if (text[0] === '0' || text[0] === '.') {
            Alert.alert('Please enter at minimum £1');
        } else {
            for (var i = 0; i < text.length; i++) {
                if (numbers.indexOf(text[i]) > -1) {
                    newText = newText + text[i];
                } else if (
                    dotCount === 0 &&
                    text[i] === '.' &&
                    text.indexOf('.') >= text.length - 3
                ) {
                    //
                    newText = newText + text[i];
                    dotCount++;
                } else {
                    numOnly = false;
                }
            }
        }
        if (numOnly) {
            if (newText === '' || parseFloat(newText) < 1000000) {
                setOtherVal(newText);
                setAmount(parseFloat(newText));
            }
        } else {
            Alert.alert('Please enter a valid amount');
        }
    };
    const [saveDetails, setSaveDetails] = useState(null);
    const getSaveDetails = async () => {
        try {
            const val = await AsyncStorage.getItem('saveDetails');
            if (val === null) {
                setSaveDetails(false);
            } else {
                setSaveDetails(val === 'true');
            }
        } catch (e) {
            // read error
        }
    };
    useEffect(() => {
        getSaveDetails();
    }, []);
    const setSaveDetailsAsync = async (value) => {
        try {
            await AsyncStorage.setItem('saveDetails', value.toString());
        } catch (e) {
            // save error
        }
    };
    const toggleSaveDetails = () => {
        setSaveDetailsAsync(!saveDetails);
        return setSaveDetails(!saveDetails);
    };
    return (
        <SafeAreaView style={styles.container}>
            <StripeProvider
                publishableKey={publishableKey}
                merchantIdentifier="merchant.com.baitul-mamur-academy"
            >
                <TouchableOpacity
                    style={styles.backContainer}
                    onPress={() => navigation.pop()}
                >
                    <LeftArrow />
                    <Text style={styles.back}>Back</Text>
                </TouchableOpacity>
                <ScrollView>
                    <Text style={styles.title}>Donate</Text>
                    {success ? (
                        <View style={styles.donateSuccessContainer}>
                            <Text style={styles.donateSuccessText}>
                                Jazak Allahu khair for your donation of £
                                {amountToPounds(amount)}
                            </Text>
                        </View>
                    ) : (
                        <>
                            <View
                                style={[
                                    styles.loadingContainer,
                                    {
                                        position: loading ? null : 'absolute',
                                        opacity: loading ? 1 : 0,
                                    },
                                ]}
                            >
                                <Image
                                    source={require('../Assets/loading.gif')}
                                    style={styles.gif}
                                />
                            </View>
                            {loading ? null : (
                                <>
                                    <Text style={styles.subheading}>
                                        Donation amount
                                    </Text>
                                    <View style={styles.donationBtnsWrapper}>
                                        {donationAmounts.map((data, key) => {
                                            return (
                                                <TouchableOpacity
                                                    key={key}
                                                    activeOpacity={1}
                                                    style={[
                                                        styles.donationBtn,
                                                        {
                                                            backgroundColor:
                                                                buttons[key]
                                                                    ? '#880808'
                                                                    : null,
                                                        },
                                                    ]}
                                                    onPress={() =>
                                                        setBtnAmount(key)
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.donationNum
                                                        }
                                                    >
                                                        {key ===
                                                        donationAmounts.length -
                                                            1 ? (
                                                            data
                                                        ) : (
                                                            <>£{data}</>
                                                        )}{' '}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                    {other && (
                                        <View style={styles.otherInputWrapper}>
                                            <View
                                                style={
                                                    styles.otherInputInnerWrapper
                                                }
                                            >
                                                <View
                                                    style={
                                                        styles.otherInputSubTitle
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.poundSign,
                                                            { color: bgColor },
                                                        ]}
                                                    >
                                                        £
                                                    </Text>
                                                    <Text
                                                        style={styles.otherText}
                                                    >
                                                        Other amount
                                                    </Text>
                                                </View>
                                                <View
                                                    style={
                                                        styles.otherInputContainer
                                                    }
                                                >
                                                    <Text
                                                        style={styles.poundSign}
                                                    >
                                                        £
                                                    </Text>
                                                    <TextInput
                                                        value={otherVal}
                                                        onChangeText={(input) =>
                                                            checkAmount(input)
                                                        }
                                                        keyboardType="numeric"
                                                        style={
                                                            styles.otherInput
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    )}

                                    <View style={styles.paymentWrapper}>
                                        <TouchableOpacity
                                            disabled={disabled}
                                            onPress={() => openPaymentSheet()}
                                            style={styles.nextBtn}
                                        >
                                            <Text style={styles.nextBtnText}>
                                                Next
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </>
                    )}
                    <View style={styles.otherDonateContainer}>
                        <Text style={styles.otherDonateTitle}>
                            Other ways to donate
                        </Text>
                        <Text
                            style={styles.otherDonate}
                            onPress={() =>
                                Linking.openURL(
                                    'https://www.baitulmamur.academy/donate'
                                )
                            }
                        >
                            Donate on the Baitul Mamur Academy website following
                            the link{' '}
                            <Text
                                style={{
                                    color: 'white',
                                    textDecorationLine: 'underline',
                                }}
                            >
                                here
                            </Text>
                        </Text>
                        <Text style={styles.otherDonate}>
                            Donate via online banking {'\n'}Organisation name:
                            Baitul Mamur Academy {'\n'}Acc no. 31643290 {'\n'}
                            Sort code: 40-01-18
                        </Text>
                        <Text
                            style={styles.otherDonate}
                            onPress={() =>
                                Linking.openURL(
                                    'https://pay.sumup.io/b2c/QT2RJ5YQ'
                                )
                            }
                        >
                            Donate via SumUp following the link{' '}
                            <Text
                                style={{
                                    color: 'white',
                                    textDecorationLine: 'underline',
                                }}
                            >
                                here
                            </Text>
                        </Text>
                        <Text style={styles.otherDonate}>
                            Visit the masjid in person and donate through the
                            donation box or card machine left near the
                            entrance/exit of the masjid
                        </Text>
                    </View>
                </ScrollView>
            </StripeProvider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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

    paymentWrapper: {
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: bgColor,
    },
    title: {
        color: 'white',
        fontSize: 40,
        textAlign: 'center',
    },
    donationBtn: {
        width: '45%',
        // backgroundColor: 'red',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 5,
        paddingVertical: 6,
        marginVertical: 5,
    },
    donationNum: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
    subheading: {
        color: 'white',
        fontSize: 23,
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 5,
    },
    otherText: { color: 'white', paddingBottom: 5, paddingLeft: 2 },
    otherInput: {
        color: 'white',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 5,
        width: '93%',
        paddingVertical: 5,
        paddingHorizontal: 5,
        fontSize: 20,
    },
    otherInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    poundSign: { color: 'white', fontSize: 20, paddingHorizontal: 5 },
    donationBtnsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    gif: {
        width: 50,
        height: 50,
    },
    otherDonate: {
        color: 'white',
        borderRadius: 25,
        borderColor: 'white',
        borderWidth: 2,
        width: '92%',
        fontSize: 17,
        padding: 20,
        marginBottom: 20,
    },
    nextBtn: {
        // backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginTop: 15,
    },
    nextBtnText: {
        color: 'white',
        // fontWeight: 'bold',
        fontSize: 17,
    },
    donateSuccessContainer: {
        alignItems: 'center',
        height: 350,
        justifyContent: 'center',
    },
    donateSuccessText: {
        color: 'white',
        fontSize: 30,
        textAlign: 'center',
        // paddingVertical: 100,
        width: '75%',
    },
    loadingContainer: {
        alignItems: 'center',
        height: 350,
        justifyContent: 'center',
    },
    otherInputWrapper: {
        alignItems: 'center',
        paddingVertical: 7,
    },
    otherInputInnerWrapper: { width: '93%' },
    otherInputSubTitle: {
        flexDirection: 'row',
    },
    otherDonateContainer: { alignItems: 'center' },
    otherDonateTitle: {
        color: 'white',
        fontSize: 22,
        marginVertical: 12,
        marginTop: 35,
    },
    saveDetailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    saveDetailsText: { color: 'white', marginLeft: 3 },
    saveDetailsSwitch: {
        transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
    },
});
