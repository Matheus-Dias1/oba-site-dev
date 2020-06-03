import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';
import api from '../../../services/api';
import { ScrollView } from 'react-native-gesture-handler';


export default function ForgotPassword() {
  const [inputSelected, setInputSelected] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigator = useNavigation();


  async function handleRecoverPassword() {
    if (loading) return;
    if (!(email.includes('@') && email.includes('.'))) return;
    setLoading(true);
    try {
      await api.post('recoverPassword', {
        email: email.replace(/^\s+|\s+$/g, '')
      })
      Alert.alert('Sucesso', 'O e-mail será enviado caso exista uma conta com o endereço informado, isso pode demorar alguns minutos')
      navigator.goBack();
    } catch (err) {
      Alert.alert('Erro ao recuperar senha', 'Houve um erro ao recuperar a sua senha, tente novamente mais tarde')
    } finally {
      setLoading(false);
    }
  }


  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Recuperar senha</Text>
            <Text style={styles.bodyText}>Enviaremos um e-mail com uma nova senha gerada aleatóriamente para o e-mail que usou no cadastro da sua conta.</Text>
            <View style={inputSelected ? styles.focusedInputContainer : styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={email}
                placeholder='E-mail'
                keyboardType='email-address'
                onChange={(e) => setEmail(e.nativeEvent.text)}
                enablesReturnKeyAutomatically={true}
                textContentType="password"
                onFocus={() => setInputSelected(true)}
                onBlur={() => setInputSelected(false)}
              />
            </View>
          </View>
          <TouchableWithoutFeedback onPress={() => handleRecoverPassword()}>
            <View style={styles.recoverButton}>
              {loading
                ? <ActivityIndicator size="small" color="white" />
                : <Text style={styles.buttonText}>Recuperar</Text>
              }
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}