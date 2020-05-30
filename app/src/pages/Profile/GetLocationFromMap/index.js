import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import styles from './styles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
export default function AddAddress() {
  const navigation = useNavigation();
  const [initialLocation, setInitialLocation] = useState({
    latitude: 0,
    longitude: 0,
  });


  var coordinates;


  async function getLocalization() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada','Para utilizar essa funcionalidade, você precisará dar permissão de geolocalização nas configurações do seu celular');
    }

    let location = await Location.getCurrentPositionAsync({});
    const loc = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setInitialLocation(loc);
  };

  function handleMapMovement(e) {
    coordinates = [e.latitude, e.longitude];
  }

  function navigateToAddAddress() {
    if (coordinates == null)
      coordinates = [initialLocation.latitude, initialLocation.longitude];
    navigation.navigate('AddAddress', {
      params: {
        latitude: coordinates[0],
        longitude: coordinates[1]
      }
    });
  }


  useEffect(() => {
    getLocalization();
  }, []);


  return (

    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        style={[styles.map]}
        showsPointsOfInterest={false}
        showsScale={false}
        showsTraffic={false}
        showsIndoors={false}
        toolbarEnabled={false}
        loadingEnabled={true}
        zoomEnabled={true}
        pitchEnabled={false}
        onRegionChangeComplete={e => handleMapMovement(e)}
      >
      </MapView>
      <View style={Platform.OS === "android" ? styles.markerFixedAndroid : styles.markerFixed}>
        <MaterialCommunityIcons
          style={{ color: '#D34036' }}
          size={45}
          name={'map-marker'}
          solid
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableWithoutFeedback onPress={navigateToAddAddress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>


  );
}