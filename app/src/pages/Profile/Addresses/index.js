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
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function Addresses() {
  const [addresses, setAdresses] = useState([]);
  const navigation = useNavigation();

  function navigateToAddAddress() {
    navigation.navigate('Perfil', {
      screen: 'AddAddress'
    })
  }


  useEffect(() => {
    try {
      AsyncStorage.getItem('accessToken').then(token => {

        api.get('profile/addresses', {
          headers: {
            authorization: 'Bearer ' + token
          }
        }).then(res => {
          console.log(res.data);
          setAdresses(res.data);
        })
      });

    } catch (err) {
      Alert.alert('Erro ao recuperar endereços');
    }
  }, [])
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => navigateToAddAddress()}>
        <View style={styles.addAddressContainer}>
          <Ionicons name={'ios-add'} size={35} color={'white'} />
          <Text style={styles.addAddressText}>Adicionar endereço</Text>
        </View>
      </TouchableWithoutFeedback>
      <FlatList
        style={styles.addressesList}
        showsVerticalScrollIndicator={false}
        keyExtractor={address => String(address.id)}
        data={addresses}
        renderItem={({ item: address }) => (
          <View style={styles.addressContainer}>
            <View style={styles.content}>
              <Text style={styles.streetText}>{address.street + ', ' + address.number}</Text>
              <Text style={styles.neighborhoodText}>{address.neighborhood}</Text>
              <Text style={styles.cityText}>{address.city + '/' + address.state}</Text>
            </View>
            <Ionicons name={'md-trash'} style={styles.addressDeleteIcon} size={30} color={'#737380'} />

          </View>
        )}
      />
    </View>

  );
}