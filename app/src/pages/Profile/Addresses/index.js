import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  AsyncStorage,
  TouchableWithoutFeedback
} from 'react-native';
import styles from './styles';
import api from '../../../services/api';
import { Ionicons, MaterialIcons } from '@expo/vector-icons/';
import { useNavigation } from '@react-navigation/native';

export default function Addresses() {
  const [addresses, setAdresses] = useState([]);
  const [selectedAddress, setSelectedAdresses] = useState(-1);
  const navigation = useNavigation();

  try {
    AsyncStorage.getItem('selectedAddress').then(res => {
      if (res !== null) setSelectedAdresses(res);
    })
  } catch (err) {

  }

  function navigateToAddAddress() {
    navigation.navigate('Perfil', {
      screen: 'AddAddress',
    })
  }

  function navigateToGetLocationFromMap() {
    navigation.navigate('Perfil', {
      screen: 'GetLocationFromMap',
    })
  }

  async function selectAddress(address) {
    await AsyncStorage.setItem('selectedAddress', String(address));
    setSelectedAdresses(address);

  }

  function confirmAlert(id) {
    let confirm;
    Alert.alert(
      'Deseja mesmo remover o endereço?',
      '',
      [
        { text: 'Não', onPress: () => { } },
        {
          text: 'Sim',
          onPress: () => handleHideAddress(id),
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );

  }


  async function handleHideAddress(id) {
    try {
      await api.put('profile/addresses/hide/' + id, {}, {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        }
      });
      setAdresses(addresses.filter(function (add) { return add.id !== id }))
      await AsyncStorage.removeItem('selectedAddress');
    } catch (err) {
      console.log(err)
      Alert.alert('Erro ao deletar endereço!');
    }
  }

  useEffect(() => {
    try {
      AsyncStorage.getItem('accessToken').then(token => {

        api.get('profile/addresses', {
          headers: {
            authorization: 'Bearer ' + token
          }
        }).then(res => {
          setAdresses(res.data);
        })
      });

    } catch (err) {
      Alert.alert('Erro ao recuperar endereços');
    }
  }, [])
  return (
    <View style={styles.container}>

      <View style={{ justifyContent: 'space-between' }}>
        <TouchableWithoutFeedback onPress={() => navigateToGetLocationFromMap()}>
          <View style={styles.addAddressContainer}>
            <MaterialIcons name={'my-location'} size={20} color={'white'} />
            <Text style={styles.addAddressText}>Utilizar minha localização</Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => navigateToAddAddress()}>
          <View style={[styles.addAddressContainer, { borderTopWidth: 1, borderTopColor: 'white' }]}>
            <Ionicons name={'ios-add'} size={35} color={'white'} />
            <Text style={styles.addAddressText}>Adicionar endereço manualmente</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <FlatList
        style={styles.addressesList}
        showsVerticalScrollIndicator={false}
        keyExtractor={address => String(address.id)}
        data={addresses}
        renderItem={({ item: address }) => (
          <TouchableWithoutFeedback onPress={() => selectAddress(addresses.indexOf(address))}>
            <View style={selectedAddress == addresses.indexOf(address) ? styles.selectedAddressContainer : styles.addressContainer}>
              <View style={styles.content}>
                <Text style={styles.streetText}>{address.street + ', ' + address.number}</Text>
                <Text style={styles.neighborhoodText}>{address.neighborhood}</Text>
                <Text style={styles.cityText}>{address.city + '/'}<Text style={styles.stateText}>{address.state}</Text></Text>
              </View>
              <TouchableWithoutFeedback onPress={() => confirmAlert(address.id)}>
                <View style={styles.removeAddressContainer}>
                  <Ionicons name={'md-trash'} style={styles.addressDeleteIcon} size={25} color={'lightgray'} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    </View>

  );
}