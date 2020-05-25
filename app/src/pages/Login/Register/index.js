import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import logo from '../../../assets/logo_green_nobg.png';
import api from '../../../services/api';
import { TextInputMask } from 'react-native-masked-text'

import styles from './styles';
export default function Register() {
  const navigator = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [selectedInput, setSelectedInput] = useState(-1);
  const [loading, setLoading] = useState(false);

  async function handleRegistration() {
    if (loading) return;
    if (name === '') {
      setErrorText('O campo nome é obrigatório');
      return;
    } if (!email.includes('.') || !email.includes('@')) {
      setErrorText('Digite um e-mail válido');
      return;
    } if (phone.length < 8) {
      setErrorText('Digite um número de telefone válido');
      return;
    } if (password.length <= 4) {
      setErrorText('A senha informada é muito curta');
      return;
    }
    setLoading(true);
    setErrorText('');
    const data = {
      name: name.replace(/^\s+|\s+$/g, '').replace(/  +/g, ' '),
      email: email.replace(/^\s+|\s+$/g, ''),
      password,
      phone,
    };
    try {
      const res = await api.post('users', data);
      if (res.data.status === 'success') {
        Alert.alert("Usuário cadastrado com sucesso.");
        return navigator.goBack();
      }
      else if (res.data.status === 'fail') {
        setErrorText(res.data.error);
      }
      setLoading(false);
      try {
        await api.post('fbPixel/register', {
          name: name.replace(/^\s+|\s+$/g, '').replace(/  +/g, ' '),
          email: email.replace(/^\s+|\s+$/g, ''),
          phone,
          platform: Platform.OS
        })
      } catch (err) {

      }
      
    } catch (err) {
      Alert.alert('Erro ao realizar cadastro, tente novamente mais tarde');
      setLoading(false);
    } finally {
      
    }

  }

  if (Platform.OS === "android")
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >

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
              <View style={selectedInput === 0 ? styles.focusedInputContainer : styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  placeholder={'Nome'}
                  onChange={(e) => setName(e.nativeEvent.text)}
                  onFocus={() => setSelectedInput(0)}
                  onBlur={() => setSelectedInput(-1)}
                  clearButtonMode="while-editing"
                  enablesReturnKeyAutomatically={true}
                />
              </View>
              <View style={selectedInput === 1 ? styles.focusedInputContainer : styles.inputContainer}>
                <TextInput
                  keyboardType='email-address'
                  style={styles.textInput}
                  value={email}
                  placeholder='E-mail'
                  onFocus={() => setSelectedInput(1)}
                  onBlur={() => setSelectedInput(-1)}
                  onChange={(e) => setEmail(e.nativeEvent.text)}
                  enablesReturnKeyAutomatically={true}
                  clearButtonMode="while-editing"
                />
              </View>
              <View style={selectedInput === 2 ? styles.focusedInputContainer : styles.inputContainer}>
                <TextInputMask
                  style={styles.textInput}
                  type={'cel-phone'}
                  placeholder="Telefone"
                  onFocus={() => setSelectedInput(2)}
                  onBlur={() => setSelectedInput(-1)}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) '
                  }}
                  value={phone}
                  onChangeText={e => setPhone(e)}
                />
              </View>



              <View style={selectedInput === 3 ? styles.focusedInputContainer : styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={password}
                  secureTextEntry={true}
                  placeholder='Senha'
                  onChange={(e) => setPassword(e.nativeEvent.text)}
                  enablesReturnKeyAutomatically={true}
                  textContentType="password"
                  onFocus={() => setSelectedInput(3)}
                  onBlur={() => setSelectedInput(-1)}
                />
              </View>

              <TouchableWithoutFeedback onPress={() => handleRegistration()}>
                <View style={styles.registerButton}>
                  <Text style={[styles.buttonText, loading ? { marginRight: 8 } : {}]}>Cadastrar</Text>
                  {loading && <ActivityIndicator size="small" color="white" />}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  else
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
              <View style={selectedInput === 0 ? styles.focusedInputContainer : styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  placeholder={'Nome'}
                  onChange={(e) => setName(e.nativeEvent.text)}
                  onFocus={() => setSelectedInput(0)}
                  onBlur={() => setSelectedInput(-1)}
                  clearButtonMode="while-editing"
                  enablesReturnKeyAutomatically={true}
                />
              </View>
              <View style={selectedInput === 1 ? styles.focusedInputContainer : styles.inputContainer}>
                <TextInput
                  keyboardType='email-address'
                  style={styles.textInput}
                  value={email}
                  placeholder='E-mail'
                  onFocus={() => setSelectedInput(1)}
                  onBlur={() => setSelectedInput(-1)}
                  onChange={(e) => setEmail(e.nativeEvent.text)}
                  enablesReturnKeyAutomatically={true}
                  clearButtonMode="while-editing"
                />
              </View>
              <View style={selectedInput === 2 ? styles.focusedInputContainer : styles.inputContainer}>
                <TextInputMask
                  style={styles.textInput}
                  type={'cel-phone'}
                  placeholder="Telefone"
                  onFocus={() => setSelectedInput(2)}
                  onBlur={() => setSelectedInput(-1)}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) '
                  }}
                  value={phone}
                  onChangeText={e => setPhone(e)}
                />
              </View>



              <View style={selectedInput === 3 ? styles.focusedInputContainer : styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={password}
                  secureTextEntry={true}
                  placeholder='Senha'
                  onChange={(e) => setPassword(e.nativeEvent.text)}
                  enablesReturnKeyAutomatically={true}
                  textContentType="password"
                  onFocus={() => setSelectedInput(3)}
                  onBlur={() => setSelectedInput(-1)}
                />
              </View>

              <TouchableWithoutFeedback onPress={() => handleRegistration()}>
                <View style={styles.registerButton}>
                  <Text style={[styles.buttonText, loading ? { marginRight: 8 } : {}]}>Cadastrar</Text>
                  {loading && <ActivityIndicator size="small" color="white" />}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    );
}