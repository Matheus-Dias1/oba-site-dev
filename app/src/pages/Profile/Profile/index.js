import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import AuthContext from '../../../authcontext';

export default function Products() {
  const { signOut } = React.useContext(AuthContext);

  return (
    <TouchableWithoutFeedback onPress={signOut}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile!</Text>
      </View>
    </TouchableWithoutFeedback>

  );
}