import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    AsyncStorage
} from 'react-native';
import AuthContext from '../../../authcontext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute, StackActions, } from '@react-navigation/native';
import api from '../../../services/api';

import styles from './styles';
import { Alert } from 'react-native';
export default function AddAddress() {

    const { signOut } = React.useContext(AuthContext);
    const navigator = useNavigation();
    const route = useRoute();
    const [popHowMany, setPopHowMany] = useState(2);
    const [country, setCountry] = useState('Brasil');
    const [state, setState] = useState('MG');
    const [city, setCity] = useState('Uberlândia');
    const [neighborhood, setNeighborhood] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [selectedInput, setSelectedInput] = useState(-1);
    const [geocoded, setGeocoded] = useState({});

    async function handleAddAddress() {
        if (!['uberlandia', 'uberlândia', 'udi'].includes(city.toLowerCase().replace(/^\s+|\s+$/g, ''))) {
            Alert.alert('Ainda não atendemos sua região', 'Por enquanto atendemos a cidade de Uberlândia');
            return;
        }
        if (!(street && number && neighborhood && city && state && country)) {
            Alert.alert('Preencha todos os campos obrigatórios')
            return;
        }
        if (popHowMany === 3) {
            const data = {
                country: geocoded.result.country.long_name.toLowerCase() === country.toLowerCase() ? geocoded.result.country.long_name : country.replace(/^\s+|\s+$/g, ''),
                state: geocoded.result.state.short_name.toLowerCase() === state.toLowerCase() ? geocoded.result.state.short_name : state.replace(/^\s+|\s+$/g, ''),
                city: geocoded.result.city.long_name.toLowerCase() === city.toLowerCase() ? geocoded.result.city.long_name : city.replace(/^\s+|\s+$/g, ''),
                neighborhood: geocoded.result.neighborhood.long_name.toLowerCase() === neighborhood.toLowerCase() ? geocoded.result.neighborhood.short_name : neighborhood.replace(/^\s+|\s+$/g, ''),
                street: geocoded.result.street.long_name.toLowerCase() === street.toLowerCase() ? geocoded.result.street.short_name : street.replace(/^\s+|\s+$/g, ''),
                number: number.replace(/^\s+|\s+$/g, ''),
                complement: complement.replace(/^\s+|\s+$/g, ''),
                lat: geocoded.result.geometry.lat,
                lng: geocoded.result.geometry.lng,
            }
            try {
                await api.post('addresses', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer ' + await AsyncStorage.getItem('accessToken'),
                    }
                })
                return navigator.dispatch(StackActions.pop(popHowMany));
            } catch (err) {
                Alert.alert('Erro ao concluir o cadastro', 'Tente novamente mais tarde');
                return;
            }
        } else if (popHowMany === 2) {
            var data = {
                state,
                city,
                neighborhood,
                street,
                number,
            }
            try {
                const res = await api.get('geocoding/reverse/',{
                    headers: {
                        authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken'),
                    },
                    body:{
                        state,
                        city,
                        neighborhood,
                        street,
                        number,
                    },
                    params:{
                        state,
                        city,
                        neighborhood,
                        street,
                        number,
                    }
                }).catch(err => {
                    if (err.response.status === 401 || err.response.status === 403) {
                        Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
                        return signOut();
                    } else throw err;
                });
                if (res.data.status !== 'OK')
                    throw new Error('NO_RESULTS');
                data = {
                    country: country.replace(/^\s+|\s+$/g, ''),
                    state: state.replace(/^\s+|\s+$/g, ''),
                    city: city.replace(/^\s+|\s+$/g, ''),
                    neighborhood: neighborhood.replace(/^\s+|\s+$/g, ''),
                    street: street.replace(/^\s+|\s+$/g, ''),
                    number: number.replace(/^\s+|\s+$/g, ''),
                    complement: complement.replace(/^\s+|\s+$/g, ''),
                    lat: res.data.result.geometry.lat,
                    lng: res.data.result.geometry.lng,
                }
            } catch (err) {
                data = {
                    country: country.replace(/^\s+|\s+$/g, ''),
                    state: state.replace(/^\s+|\s+$/g, ''),
                    city: city.replace(/^\s+|\s+$/g, ''),
                    neighborhood: neighborhood.replace(/^\s+|\s+$/g, ''),
                    street: street.replace(/^\s+|\s+$/g, ''),
                    number: number.replace(/^\s+|\s+$/g, ''),
                    complement: complement.replace(/^\s+|\s+$/g, ''),
                    lat: '-18.931880',
                    lng: '-48.264173',
                }
            } finally {
                try {
                    await api.post('addresses', data, {
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': 'Bearer ' + await AsyncStorage.getItem('accessToken'),
                        }
                    })
                    return navigator.dispatch(StackActions.pop(popHowMany))
                } catch (err) {
                    Alert.alert('Erro ao concluir o cadastro', 'Tente novamente mais tarde');
                    return;
                }
            }
        }
    }

    async function getAddress(coords) {
        setPopHowMany(3);

        try {
            const res = await api.get('geocoding', {
                headers: {
                    authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
                },
                params: {
                    coords: coords
                }
            }).catch(err => {
                if (err.response.status === 401 || err.response.status === 403) {
                    Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
                    signOut();
                } else throw err;
            });
            if (res.data.status !== 'OK')
                throw new Error('NO_RESULTS');
            setGeocoded(res.data);
            setCountry(res.data.result.country.long_name);
            setCity(res.data.result.city.long_name);
            setNeighborhood(res.data.result.neighborhood.long_name);
            setState(res.data.result.state.short_name);
            setNumber(res.data.result.number.long_name);
            setStreet(res.data.result.street.short_name);
        } catch (err) {
            Alert.alert('Erro ao recuperar endereço', 'Preencha seus dados manualmente.')
        }
    }

    useEffect(() => {
        try {
            const coords = {
                latitude: route.params.params.latitude,
                longitude: route.params.params.longitude
            }
            getAddress(coords);

        } catch (err) {
            
        }
    }, [])


    return (
        <View style={{ flex: 1 }}>
            <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <View style={styles.inputGroup}>
                            <View style={selectedInput === 0 ? styles.focusedGroup1InputContainer : styles.group1InputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    value={street}
                                    placeholder='Endereço'
                                    onFocus={() => setSelectedInput(0)}
                                    onBlur={() => setSelectedInput(-1)}
                                    onChange={(e) => setStreet(e.nativeEvent.text)}
                                    enablesReturnKeyAutomatically={true}
                                    clearButtonMode="while-editing"
                                />
                            </View>
                            <View style={selectedInput === 1 ? styles.focusedGroup2InputContainer : styles.group2InputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    keyboardType='numeric'
                                    value={number}
                                    placeholder='nº'
                                    onFocus={() => setSelectedInput(1)}
                                    onBlur={() => setSelectedInput(-1)}
                                    onChange={(e) => setNumber(e.nativeEvent.text)}
                                    enablesReturnKeyAutomatically={true}
                                />
                            </View>
                        </View>
                        <View style={selectedInput === 2 ? styles.focusedInputContainer : styles.inputContainer}>
                            <TextInput
                                style={styles.textInput}
                                value={complement}
                                placeholder='Complemento (opicional)'
                                onFocus={() => setSelectedInput(2)}
                                onBlur={() => setSelectedInput(-1)}
                                onChange={(e) => setComplement(e.nativeEvent.text)}
                                enablesReturnKeyAutomatically={true}
                                clearButtonMode="while-editing"
                            />
                        </View>
                        <View style={selectedInput === 3 ? styles.focusedInputContainer : styles.inputContainer}>
                            <TextInput
                                style={styles.textInput}
                                value={neighborhood}
                                placeholder='Bairro'
                                onFocus={() => setSelectedInput(3)}
                                onBlur={() => setSelectedInput(-1)}
                                onChange={(e) => setNeighborhood(e.nativeEvent.text)}
                                enablesReturnKeyAutomatically={true}
                                clearButtonMode="while-editing"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <View style={selectedInput === 4 ? styles.focusedGroup1InputContainer : styles.group1InputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    value={city}
                                    placeholder='City'
                                    onFocus={() => setSelectedInput(4)}
                                    onBlur={() => setSelectedInput(-1)}
                                    onChange={(e) => setCity(e.nativeEvent.text)}
                                    enablesReturnKeyAutomatically={true}
                                    clearButtonMode="while-editing"
                                />
                            </View>
                            <View style={selectedInput === 5 ? styles.focusedGroup2InputContainer : styles.group2InputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    value={state}
                                    placeholder='Estado'
                                    onFocus={() => setSelectedInput(5)}
                                    onBlur={() => setSelectedInput(-1)}
                                    onChange={(e) => setState(e.nativeEvent.text)}
                                    enablesReturnKeyAutomatically={true}
                                />
                            </View>
                        </View>
                        <View style={selectedInput === 6 ? styles.focusedInputContainer : styles.inputContainer}>
                            <TextInput
                                style={styles.textInput}
                                value={country}
                                placeholder='País'
                                onFocus={() => setSelectedInput(6)}
                                onBlur={() => setSelectedInput(-1)}
                                onChange={(e) => setCountry(e.nativeEvent.text)}
                                enablesReturnKeyAutomatically={true}
                                clearButtonMode="while-editing"
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
            <TouchableWithoutFeedback onPress={handleAddAddress}>
                <View style={styles.addAddressButton}>
                    <Text style={styles.buttonText}>Adicionar</Text>
                </View>
            </TouchableWithoutFeedback>

        </View>
    );
}


