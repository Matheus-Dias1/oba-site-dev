import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  StatusBar
} from 'react-native';
import AuthContext from '../../../authcontext';
import { useNavigation } from '@react-navigation/native';


import styles from './styles';
import { TextInput } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons/'
import logo from '../../../assets/logo_green_nobg.png'

export default function Login() {
  const { signIn } = React.useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigator = useNavigation();

  function navigateForgotPassword() {
    navigator.navigate('ForgotPassword');
  }

  function navigateRegister() {
    navigator.navigate('Register');
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Image
          style={styles.logo}
          source={logo}
        />
        <Text style={styles.loginText}>
          Faça seu login
          </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.TextInput}
            placeholder="E-mail"
            autoCorrect={false}
            value={email}
            onChange={e => setEmail(e.nativeEvent.text)}
          />

        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Senha"
            style={styles.TextInput}
            secureTextEntry={true}
            value={password}
            onChange={e => setPassword(e.nativeEvent.text)}
          />
        </View>

        <TouchableWithoutFeedback onPress={() => signIn({ email, password })}>
          <View style={styles.loginButton}>
            <Text style={styles.buttonText}>Continuar</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigateRegister()}>
          <View style={styles.navigateContainer}>
            <FontAwesome5 name={'sign-in-alt'} size={15} color={'#049434'} />
            <Text style={styles.navigateText}>Não tenho cadastro</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigateForgotPassword()}>
          <View style={styles.navigateContainer}>
            <FontAwesome5 name={'lock'} size={14} color={'#049434'} />
            <Text style={styles.navigateText}>Esqueci minha senha</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}



// <TouchableWithoutFeedback onPress={() => signIn()}>
//   <View style={{ width: 50, height: 50, backgroundColor: 'black' }} />
// </TouchableWithoutFeedback>