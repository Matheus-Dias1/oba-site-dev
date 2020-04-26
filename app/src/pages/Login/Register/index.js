import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import logo from '../../../assets/logo_green_nobg.png'


import styles from './styles';
export default function Products() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  async function handleRegistration() {
    if (name === '') {
      setErrorText('O campo nome é obrigatório');
      return;
    } if (!email.includes('.') || !email.includes('@')) {
      setErrorText('Digite um e-mail válido');
      return;
    } if (phone.length < 8){
      setErrorText('Digite um número de telefone válido');
      return;
    } if (password.length <= 4){
      setErrorText('A senha informada é muito curta');
      return;
    } if (password !== cPassword){
      setErrorText('As senhas informadas são diferentes');
      return;
    }
    setErrorText('');
  }


  return (

    <KeyboardAwareScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={styles.container}>
          <View style={styles.content}>
            <Image
              style={styles.logo}
              source={logo}
            />
            <Text style={styles.title}>Novo cadastro</Text>
            {errorText !== '' &&
              <View style={styles.errorTextContainer}>
                <Text style={styles.errorText}>{errorText}</Text>
              </View>
            }
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={name}
                placeholder={'Nome'}
                onChange={(e) => setName(e.nativeEvent.text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                keyboardType='email-address'
                style={styles.textInput}
                value={email}
                placeholder='E-mail'
                onChange={(e) => setEmail(e.nativeEvent.text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                keyboardType='phone-pad'
                value={phone}
                placeholder='Telefone'
                onChange={(e) => setPhone(e.nativeEvent.text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={password}
                secureTextEntry={true}
                placeholder='Senha'
                onChange={(e) => setPassword(e.nativeEvent.text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={cPassword}
                secureTextEntry={true}
                placeholder='Confirme sua senha'
                onChange={(e) => setCPassword(e.nativeEvent.text)}
              />
            </View>
            <TouchableWithoutFeedback onPress={() => handleRegistration()}>
              <View style={styles.registerButton}>
                <Text style={styles.buttonText}>Cadastrar</Text>
              </View>
            </TouchableWithoutFeedback>






          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>

  );
}