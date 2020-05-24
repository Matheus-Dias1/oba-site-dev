import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Linking,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import styles from './styles';
import * as MailComposer from 'expo-mail-composer';
import { Ionicons, FontAwesome } from '@expo/vector-icons/'
import api from '../../../services/api'



export default function Help() {
  useEffect(()=>{
    const abortController = new AbortController();
    return abortController.abort();
  },[])
  
  function openWhatsApp() {
    sendPixel('whatsapp')
    Linking.openURL('whatsapp://send?phone=5534997762094')
  }
  
  function makeCall() {
    sendPixel('phone')
    Linking.openURL('tel:+5534997762094')
  }
  
  function sendEmail() {
    sendPixel('email')
    MailComposer.composeAsync({
      recipients: ['obahortifruti20@gmail.com']
    })
  }
  
  async function sendPixel(method) {
    
    try {
      await api.post('fbPixel/contact', {
        email: await AsyncStorage.getItem('email'),
        name: await AsyncStorage.getItem('name'),
        method
      }, {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        }
      })
    } catch (err) {

    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f2f2f2" />
      <View style={styles.content}>
        <View>
          <Text style={styles.bodyText}>Entre em contato conosco por um dos meios listados abaixo.</Text>
          <Text style={styles.property} selectable={true}>E-mail: <Text style={styles.value}>obahortifruti20@gmail.com</Text></Text>
          <Text style={styles.property} selectable={true}>WhatsApp: <Text style={styles.value}>+55 (34) 99776-2094</Text></Text>
          <Text style={styles.property} selectable={true}>Telefone: <Text style={styles.value}>+55 (34) 99776-2094</Text></Text>
        </View>

      </View>
      <View style={styles.buttonsContainer}>
        <TouchableWithoutFeedback onPress={sendEmail}>
          <View style={styles.buttonContainer}>
            <Ionicons name={'ios-mail'} size={25} color={'white'} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={openWhatsApp}>
          <View style={[styles.buttonContainer, styles.middleButton]}>
            <Ionicons name={'logo-whatsapp'} size={25} color={'white'} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={makeCall}>
          <View style={styles.buttonContainer}>
            <FontAwesome name={'phone'} size={25} color={'white'} />
          </View>
        </TouchableWithoutFeedback>

      </View>
    </View>

  );
}