import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { TextInputMask } from 'react-native-masked-text'

import styles from './styles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
export default function AddAddress() {

  const [initialLocation, setInitialLocation] = useState({
    latitude: 0,
    longitude: 0,
  });


  var coordinates;

  const screenWidth = Math.round(Dimensions.get('window').width);
  const screenHeight = Math.round(Dimensions.get('window').height);


  async function getLocalization() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada');
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

  function displayDeliveryFee() {
    function haversineDistance(coords) {
      function toRad(x) {
        return x * Math.PI / 180;
      }

      var lon1 = -18.903253;
      var lat1 = -48.285313;

      var lon2 = coords[0];
      var lat2 = coords[1];

      var R = 6371; // km

      var x1 = lat2 - lat1;
      var dLat = toRad(x1);
      var x2 = lon2 - lon1;
      var dLon = toRad(x2)
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d;
    }
    if (coordinates == null)
      coordinates = [initialLocation.latitude, initialLocation.longitude];
    const dist = haversineDistance(coordinates);
    if (dist <= 1) Alert.alert(Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(5))
    else Alert.alert(Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((dist - 1) + 5))
  }

  useEffect(() => {
    getLocalization();
  }, []);


  return (

    <>
      <MapView
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
      <View style={styles.markerFixed}>
        <MaterialCommunityIcons
          style={{ color: '#D34036' }}
          size={45}
          name={'map-marker'}
          solid
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableWithoutFeedback onPress={() => displayDeliveryFee(coordinates)}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>


  );
}