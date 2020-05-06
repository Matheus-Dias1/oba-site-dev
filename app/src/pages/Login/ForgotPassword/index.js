import React from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';
import splash from '../../../assets/teste.png'


export default function ForgotPassword() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <Image
          source={splash}
          style={{width: 100, height: 100, resizeMode:'center'}}
        />
        <Text style={{fontSize:16, fontWeight:'300', textAlign:'center',color:'#737380'}}>{'Não há nada\npara se ver aqui'}</Text>
    </View>

  );
}