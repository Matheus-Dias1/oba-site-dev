import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import styles from './styles';
import * as MailComposer from 'expo-mail-composer';
import { Ionicons, FontAwesome } from '@expo/vector-icons/'

function openWhatsApp() {
  Linking.openURL('whatsapp://send?phone=5534997762094')
}

function makeCall(){
  Linking.openURL('tel:+5534997762094')
}

function sendEmail() {
  MailComposer.composeAsync({
    recipients: ['obahortifruti20@gmail.com']
  })
}

export default function Help() {
  return (
    <View style={styles.container}>
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