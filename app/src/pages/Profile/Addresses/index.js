import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  AsyncStorage,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import api from '../../../services/api';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../../authcontext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons/';

export default function Addresses() {
  const { signOut } = React.useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddresses] = useState(-1);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  try {
    AsyncStorage.getItem('selectedAddress').then(res => {
      if (res !== null) setSelectedAddresses(res);
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
    const curCity = await AsyncStorage.getItem('selectedCity');
    if ((addresses[address].city).toLowerCase() === 'araguari') {
      if (curCity !== 'araguari')
        await AsyncStorage.setItem('newCity', 'true');
      await AsyncStorage.setItem('selectedCity', 'araguari')
    }
    if (['uberlandia', 'uberlândia', 'udi'].includes((addresses[address].city).toLowerCase())) {
      if (curCity !== 'uberlandia')
        await AsyncStorage.setItem('newCity', 'true');
      await AsyncStorage.setItem('selectedCity', 'uberlandia')
    }
    setSelectedAddresses(address);
  }

  function confirmAlert(id) {
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
    setLoading(true);
    try {
      await api.put('profile/addresses/hide/' + id, {}, {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          return signOut();
        } else throw err;
      });
      setAddresses(addresses.filter(function (add) { return add.id !== id }))
      await AsyncStorage.removeItem('selectedAddress');
    } catch (err) {
      Alert.alert('Erro ao deletar endereço!');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    try {
      AsyncStorage.getItem('accessToken').then(token => {
        setLoading(true);
        api.get('profile/addresses', {
          headers: {
            authorization: 'Bearer ' + token
          }
        }).then(res => {
          setAddresses(res.data);
          setLoading(false);

        }).catch(err => {
          if (err.response.status === 401 || err.response.status === 403) {
            Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
            return signOut();
          } else throw err;
        });

      });

    } catch (err) {
      Alert.alert('Erro ao recuperar endereços');
    } finally {
      setLoading(false);
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
        ListFooterComponent={
          <View style={styles.emptyListTextContainer} >

            {loading && <ActivityIndicator size="small" color="#000" />}
            {!loading && addresses.length === 0 &&
              <Text style={styles.emptyListText}>Nenhum endereço cadastrado</Text>
            }
          </View>}
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