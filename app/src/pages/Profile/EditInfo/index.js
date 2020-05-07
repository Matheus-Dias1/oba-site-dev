import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
  AsyncStorage,

} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../../authcontext';
import api from '../../../services/api';
import { TextInputMask } from 'react-native-masked-text'

import styles from './styles';
export default function EditInfo() {
  const navigator = useNavigation();
  const [name, setName] = useState('');
  const { signOut } = React.useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [selectedInput, setSelectedInput] = useState(-1);
  const [loading, setLoading] = useState(true);

  async function getInfo() {
    try {
      const res = await api.get('profile/edit', {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          return signOut();
        } else throw err;
      });
      setName(res.data.name);
      setPhone(res.data.phone);
      setEmail(res.data.email);
    } catch (err) {
      Alert.alert('Erro ao recuperar suas informações', 'Tente novamente mais tarde');
      navigator.goBack();
    } finally{
      setLoading(false);
    }
  }


  useEffect(() => {
    getInfo();
  }, [])

  async function handleEditProfile() {
    if(loading) return;
    if (name === '') {
      setErrorText('O campo nome é obrigatório');
      return;
    } if (!email.includes('.') || !email.includes('@')) {
      setErrorText('Digite um e-mail válido');
      return;
    } if (phone.length < 8) {
      setErrorText('Digite um número de telefone válido');
      return;
    }
    setLoading(true);
    setErrorText('');
    const data = {
      name: name.replace(/^\s+|\s+$/g, ''),
      email: email.replace(/^\s+|\s+$/g, ''),
      phone,
    };
    try {
      const res = await api.put('profile/edit/', data, {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          setLoading(false)
          return signOut();
        } else throw err;
      });
    } catch (err) {
      Alert.alert('Erro ao editar perfil', 'Tente novamente mais tarde');
    }
    if (newPassword === '') {
      navigator.goBack();
    }
    else {
      if (newPassword.length < 5){
        setLoading(false)
        return setErrorText('A nova senha informada é muito curta');
      }
      try {
        const res = await api.put('profile/edit/password', {
          oldPassword,
          newPassword,
        }, {
          headers: {
            authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
          }
        }).catch(err => {
          if (err.response.status === 401 || err.response.status === 403) {
            setLoading(false);
            Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
            return signOut();
          } else throw err;
        });

        if (res.data.status === 'OK')
          navigator.goBack();
        else if (res.data.status === 'FAIL'){
          setLoading(false);
          return Alert.alert('Erro ao alterar senha', 'A senha atual informada está incorreta');
        }
        else
          throw new Error('UnexpectedError')
      } catch (err) {
        Alert.alert('Erro ao atualizar sua senha', 'Tente novamente mais tarde')
      }
      
    }
    setLoading(false);
  }


  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={styles.container}>
          <View style={styles.content}>

            <Text style={styles.title}>Editar perfil</Text>
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
                style={[styles.textInput, { color: 'gray' }]}
                value={email}
                editable={false}
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
            <View style={[selectedInput === 3 ? styles.focusedInputContainer : styles.inputContainer, { marginTop: 40 }]}>
              <TextInput
                keyboardType='email-address'
                style={styles.textInput}
                value={newPassword}
                placeholder='Nova senha'
                secureTextEntry={true}
                onFocus={() => setSelectedInput(3)}
                onBlur={() => setSelectedInput(-1)}
                onChange={(e) => setNewPassword(e.nativeEvent.text)}
                enablesReturnKeyAutomatically={true}
                clearButtonMode="while-editing"
              />
            </View>
            <View style={selectedInput === 4 ? styles.focusedInputContainer : styles.inputContainer}>
              <TextInput
                keyboardType='email-address'
                style={styles.textInput}
                value={oldPassword}
                secureTextEntry={true}
                placeholder='Senha atual'
                onFocus={() => setSelectedInput(4)}
                onBlur={() => setSelectedInput(-1)}
                onChange={(e) => setOldPassword(e.nativeEvent.text)}
                enablesReturnKeyAutomatically={true}
                clearButtonMode="while-editing"
              />
            </View>





          </View>
          <TouchableWithoutFeedback onPress={() => handleEditProfile()}>
            <View style={styles.editProfileButton}>
              <Text style={styles.buttonText}>Atualizar</Text>
            </View>
          </TouchableWithoutFeedback>
          {loading && <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>

  );
}