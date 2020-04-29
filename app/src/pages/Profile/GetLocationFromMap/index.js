import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import api from '../../../services/api';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

import styles from './styles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
export default function AddAddress() {

  const [initialLocation, setInitialLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  var coordinates;

  const screenWidth = Math.round(Dimensions.get('window').width);
  const screenHeight = Math.round(Dimensions.get('window').height);


  async function getLocalization() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});
    const loc = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setInitialLocation(loc);
    setCurrentLocation(loc);

  };

  function handleMapMovement(e) {
    coordinates = [e.latitude, e.longitude];
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
        <TouchableWithoutFeedback onPress={()=>console.log(coordinates)}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>


  );
}