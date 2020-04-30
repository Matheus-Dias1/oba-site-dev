import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    AsyncStorage
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../../services/api';
import { TextInputMask } from 'react-native-masked-text'

import styles from './styles';
import { Alert } from 'react-native';
import Axios from 'axios';
export default function AddAddress() {
    

    const navigator = useNavigation();
    const route = useRoute();
    var popHowMany = 1;
    const [country, setCountry] = useState('Brasil');
    const [state, setState] = useState('MG');
    const [city, setCity] = useState('Uberlândia');
    const [neighborhood, setNeighborhood] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [selectedInput, setSelectedInput] = useState(-1);
    const [coords, setCoords] = useState([]);

    async function handleAddAddress() {

    }

    async function getAddress(coords){
        
        const res = await api.get('/geocoding', {
            headers: {
              authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
            },
            params: {
                coords: coords
            }
          });
        setCountry(res.data.result.country.long_name);
        setCity(res.data.result.city.long_name);
        setNeighborhood(res.data.result.neighborhood.long_name);
        setState(res.data.result.state.short_name);
        setNumber(res.data.result.number.long_name);
        setStreet(res.data.result.street.short_name);
    }

    useEffect(() => {
        try {
            const coords = {
                latitude: route.params.params.latitude,
                longitude: route.params.params.longitude
            }
            popHowMany = 2;
            getAddress(coords);

        } catch (err) {
            //console.log(err);
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
                                placeholder='Complemento'
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
            <View style={styles.addAddressButton}>
                <Text style={styles.buttonText}>Adicionar</Text>
            </View>
        </View>
    );
}


