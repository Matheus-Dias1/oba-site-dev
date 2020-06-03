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
  ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as WebBrowser from 'expo-web-browser';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [selectedInput, setSelectedInput] = useState(-1);
  const [loading, setLoading] = useState(false);

  async function openPrivacyPolicy() {
    await WebBrowser.openBrowserAsync('https://obapolicies.htmlsave.net/privacy.html');
  }

  async function openToS() {
    await WebBrowser.openBrowserAsync('https://obapolicies.htmlsave.net/');
  }

  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  async function handleRegistration() {
    if (loading) return;
    if (name === '') {
      setErrorText('O campo nome é obrigatório');
      return;
    } if (!validateEmail(email)) {
      setErrorText('Digite um e-mail válido');
      return;
    } if (phone.length < 8) {
      setErrorText('Digite um número de telefone válido');
      return;
    } if (password.length <= 4) {
      setErrorText('A senha informada é muito curta');
      return;
    } if (password !== confirmPassword) {
      setErrorText('As senhas não são iguais');
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
              <View>
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
                    autoCompleteType='name'
                    onChange={(e) => setName(e.nativeEvent.text)}
                    onFocus={() => setSelectedInput(0)}
                    onBlur={() => setSelectedInput(-1)}
                    clearButtonMode="while-editing"
                    enablesReturnKeyAutomatically={true}
                  />
                </View>
                <View style={selectedInput === 2 ? styles.focusedInputContainer : styles.inputContainer}>
                  <TextInputMask
                    style={styles.textInput}
                    type={'cel-phone'}
                    autoCompleteType='tel'
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
                <View style={selectedInput === 1 ? styles.focusedInputContainer : styles.inputContainer}>
                  <TextInput
                    keyboardType='email-address'
                    style={styles.textInput}
                    value={email}
                    autoCompleteType='email'
                    textContentType={'emailAddress'}
                    placeholder='E-mail'
                    onFocus={() => setSelectedInput(1)}
                    onBlur={() => setSelectedInput(-1)}
                    onChange={(e) => setEmail(e.nativeEvent.text)}
                    enablesReturnKeyAutomatically={true}
                    clearButtonMode="while-editing"
                  />
                </View>


                <View style={selectedInput === 3 ? styles.focusedInputContainer : styles.inputContainer}>
                  <TextInput
                    textContentType={'newPassword'}
                    style={styles.textInput}
                    value={password}
                    secureTextEntry={true}
                    placeholder='Senha'
                    onChange={(e) => setPassword(e.nativeEvent.text)}
                    enablesReturnKeyAutomatically={true}
                    onFocus={() => setSelectedInput(3)}
                    onBlur={() => setSelectedInput(-1)}
                  />
                </View>

                <View style={selectedInput === 4 ? styles.focusedInputContainer : styles.inputContainer}>
                  <TextInput
                    textContentType={'newPassword'}
                    style={styles.textInput}
                    value={confirmPassword}
                    secureTextEntry={true}
                    placeholder='Confirmar senha'
                    onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
                    enablesReturnKeyAutomatically={true}
                    onFocus={() => setSelectedInput(4)}
                    onBlur={() => setSelectedInput(-1)}
                  />
                </View>
              </View>
              <View>
                <View style={styles.tosAndPolicyContainer}>
                  <Text style={styles.tosAndPolicyText}>
                    {'Ao concluir seu cadastro, estará concordando com nossos '}
                    <TouchableWithoutFeedback onPress={openToS}>
                      <Text style={styles.tosAndPolicyLink}>termos de serviço</Text>
                    </TouchableWithoutFeedback>
                    {' e nossa '}
                    <TouchableWithoutFeedback onPress={openPrivacyPolicy}>
                      <Text style={styles.tosAndPolicyLink}>política de privacidade</Text>
                    </TouchableWithoutFeedback>
                  .
                </Text>
                </View>
                <TouchableWithoutFeedback onPress={() => handleRegistration()}>
                  <View style={styles.registerButton}>
                    {loading
                      ? <ActivityIndicator size="small" color="white" />
                      : <Text style={styles.buttonText}>Cadastrar</Text>
                    }
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  else
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <View style={styles.container}>
              <View style={styles.content}>
                <View>
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
                      autoCompleteType='name'
                      onChange={(e) => setName(e.nativeEvent.text)}
                      onFocus={() => setSelectedInput(0)}
                      onBlur={() => setSelectedInput(-1)}
                      clearButtonMode="while-editing"
                      enablesReturnKeyAutomatically={true}
                    />
                  </View>
                  <View style={selectedInput === 2 ? styles.focusedInputContainer : styles.inputContainer}>
                    <TextInputMask
                      style={styles.textInput}
                      type={'cel-phone'}
                      autoCompleteType='tel'
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
                  <View style={selectedInput === 1 ? styles.focusedInputContainer : styles.inputContainer}>
                    <TextInput
                      keyboardType='email-address'
                      style={styles.textInput}
                      value={email}
                      autoCompleteType='email'
                      textContentType={'emailAddress'}
                      placeholder='E-mail'
                      onFocus={() => setSelectedInput(1)}
                      onBlur={() => setSelectedInput(-1)}
                      onChange={(e) => setEmail(e.nativeEvent.text)}
                      enablesReturnKeyAutomatically={true}
                      clearButtonMode="while-editing"
                    />
                  </View>


                  <View style={selectedInput === 3 ? styles.focusedInputContainer : styles.inputContainer}>
                    <TextInput
                      textContentType={'newPassword'}
                      style={styles.textInput}
                      value={password}
                      secureTextEntry={true}
                      placeholder='Senha'
                      onChange={(e) => setPassword(e.nativeEvent.text)}
                      enablesReturnKeyAutomatically={true}
                      onFocus={() => setSelectedInput(3)}
                      onBlur={() => setSelectedInput(-1)}
                    />
                  </View>

                  <View style={selectedInput === 4 ? styles.focusedInputContainer : styles.inputContainer}>
                    <TextInput
                      textContentType={'newPassword'}
                      style={styles.textInput}
                      value={confirmPassword}
                      secureTextEntry={true}
                      placeholder='Confirmar senha'
                      onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
                      enablesReturnKeyAutomatically={true}
                      onFocus={() => setSelectedInput(4)}
                      onBlur={() => setSelectedInput(-1)}
                    />
                  </View>
                </View>
                <View>
                  <View style={styles.tosAndPolicyContainer}>
                    <Text style={styles.tosAndPolicyText}>
                      {'Ao concluir seu cadastro, estará concordando com nossos '}
                      <TouchableWithoutFeedback onPress={openToS}>
                        <Text style={styles.tosAndPolicyLink}>termos de serviço</Text>
                      </TouchableWithoutFeedback>
                      {' e nossa '}
                      <TouchableWithoutFeedback onPress={openPrivacyPolicy}>
                        <Text style={styles.tosAndPolicyLink}>política de privacidade</Text>
                      </TouchableWithoutFeedback>
                      .
                      </Text>
                  </View>
                  <TouchableWithoutFeedback onPress={() => handleRegistration()}>
                    <View style={styles.registerButton}>
                      {loading
                        ? <ActivityIndicator size="small" color="white" />
                        : <Text style={styles.buttonText}>Cadastrar</Text>
                      }
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
}