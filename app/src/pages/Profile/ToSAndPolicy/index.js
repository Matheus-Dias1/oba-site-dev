import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons/'
import styles from './styles';
import * as WebBrowser from 'expo-web-browser';


export default function Profile() {

  async function openPolicy(){
    await WebBrowser.openBrowserAsync('https://obapolicies.htmlsave.net/privacy.html');
  }

  async function openToS(){
    await WebBrowser.openBrowserAsync('https://obapolicies.htmlsave.net/');
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView>
          <View>
            <TouchableWithoutFeedback onPress={openToS}>
              <View style={styles.optionContainer}>
                <Text style={styles.optionText}>Termos de uso</Text>
                <Ionicons style={styles.arrowButton} name={'ios-arrow-forward'} size={30} color={'#049434'} />

              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={openPolicy}>
              <View style={styles.optionContainer}>
                <Text style={styles.optionText}>Política de privacidade</Text>
                <Ionicons style={styles.arrowButton} name={'ios-arrow-forward'} size={30} color={'#049434'} />

              </View>
            </TouchableWithoutFeedback>

          </View>

        </ScrollView>
      </View>
    </SafeAreaView>

  );
}