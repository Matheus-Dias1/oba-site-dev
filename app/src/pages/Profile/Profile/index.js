import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  AsyncStorage,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AuthContext from '../../../authcontext';
import { Ionicons,FontAwesome5 } from '@expo/vector-icons/'
import styles from './styles';
import { useNavigation } from '@react-navigation/native';


export default function Profile() {
  const { signOut } = React.useContext(AuthContext);
  const [name, setName] = useState('Usuário');
  const navigation = useNavigation();
  useState(() => {
    try {
      AsyncStorage.getItem('name').then(res => {
        setName(res.split(' ')[0]);
      })
    } catch (err) {

    }
  }, [])

  function navigateTo(screen) {
    navigation.navigate('Perfil', {
      screen: screen,
    });
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.helloContainer}>
          <Text style={styles.helloText}>{'Olá, ' + name + '.'}</Text>
        </View>
        <ScrollView>
          <View>
            <TouchableWithoutFeedback onPress={() => navigateTo('EditInfo')}>
              <View style={styles.optionContainer}>
                <View style={styles.textIconView}>
                  <Ionicons style={{ marginBottom: -4 }} name={'md-person'} size={30} color={'#049434'} />
                  <Text style={styles.optionText}>Editar perfil</Text>
                </View>
                <Ionicons style={styles.arrowButton} name={'ios-arrow-forward'} size={30} color={'#049434'} />

              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigateTo('Addresses')}>
              <View style={styles.optionContainer}>
                <View style={styles.textIconView}>
                  <Ionicons style={{ marginBottom: -4 }} name={'md-home'} size={30} color={'#049434'} />
                  <Text style={styles.optionText}>Endereços</Text>
                </View>
                <Ionicons style={styles.arrowButton} name={'ios-arrow-forward'} size={30} color={'#049434'} />

              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigateTo('Help')}>
              <View style={styles.optionContainer}>
                <View style={styles.textIconView}>
                  <Ionicons style={{ marginBottom: -4 }} name={'md-help-circle-outline'} size={30} color={'#049434'} />
                  <Text style={styles.optionText}>Ajuda</Text>
                </View>
                <Ionicons style={styles.arrowButton} name={'ios-arrow-forward'} size={30} color={'#049434'} />

              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigateTo('ToSAndPolicy')}>
              <View style={styles.optionContainer}>
                <View style={styles.textIconView}>
                  <FontAwesome5 style={{ marginBottom: -4, marginLeft: 3, marginRight: -3 }} name="file-signature" size={24} color="#049434" />
                  <Text style={styles.optionText}>Políticas e termos</Text>
                </View>
                <Ionicons style={styles.arrowButton} name={'ios-arrow-forward'} size={30} color={'#049434'} />

              </View>
            </TouchableWithoutFeedback>



          </View>

        </ScrollView>
        <TouchableWithoutFeedback onPress={signOut}>
          <View style={[styles.optionContainer, { marginBottom: 20 }]}>
            <View style={styles.textIconView}>
              <Ionicons style={{ marginBottom: -4 }} name={'md-log-out'} size={30} color={'#B22222'} />
              <Text style={styles.logoutText}>Sair</Text>
            </View>

          </View>
        </TouchableWithoutFeedback>


      </View>
    </SafeAreaView>

  );
}