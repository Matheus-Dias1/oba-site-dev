import React, { useState, useEffect } from 'react';
import { View, Text, Image, StatusBar, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation, useRoute } from '@react-navigation/native';


//<FontAwesome5 name={iconName} size={size} color={color} light />


import styles from './styles';

export default function Products() {
  const route = useRoute();
  const [product, setProduct] = useState({});
  const [amount, setAmount] = useState([0, 0]);
  const [price, setPrice] = useState([0, 0]);
  const [value, setValue] = useState([0, 0]);
  const [observation, setObservation] = useState('');
  const navigation = useNavigation();
  const imageUrl = 'http://192.168.1.8:3333/image/'

  useEffect(() => {
    setProduct(route.params.product);
    if (route.params.product.unit_price !== null)
      setValue([route.params.product.price, route.params.product.unit_price])
    else
      setValue([route.params.product.price, -1])

  }, [])
  function updateIntValue(pos, val) {
    if (pos === 1) {
      setAmount([amount[0], amount[1] + val]);
      setPrice([price[0], (amount[1] + val) * value[1]]);
      console.log(price[0]);
    }
    else {
      setAmount([amount[0] + val, amount[1]])
      setPrice([(amount[0] + val) * value[0], price[1]]);
    }

  }
  function updateFloatValue(val) {
    let newValue;
    if (val == "") newValue = 0;
    else newValue = parseFloat(val);
    setAmount([newValue, amount[1]]);
    setPrice([newValue * value[0], price[1]]);
  }
  function addToCart() {
    navigation.goBack();
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{
                  uri: imageUrl + product.picture_path
                }}
              />
              <Text style={styles.productName}>{product.product_name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
            </View>
            <View style={styles.amountContainer}>
              {['KG'].includes(product.measurement_unit) && <View style={styles.measurementUnit}>
                <TextInput
                  maxLength={10}
                  autoCompleteType="off"
                  placeholder="Quantidade"
                  style={styles.AmountInputStyle}
                  keyboardType={'numeric'}
                  onChange={e => updateFloatValue(e.nativeEvent.text.replace(',', '.'))}
                />
                <Text>{product.measurement_unit}</Text>
                <Text>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price[0])}</Text>
              </View>}
              {['UN', 'BDJ', 'BD', 'CX'].includes(product.measurement_unit) && <View style={styles.measurementUnit}>
                <View style={styles.intValueCounterContainer}>
                  {amount[0] > 0 && <TouchableOpacity onPress={() => updateIntValue(0, -1)} activeOpacity={0.5}>
                    <Ionicons name={'md-remove-circle-outline'} size={25} color={'#049434'} />
                  </TouchableOpacity>}
                  {amount[0] <= 0 && <TouchableOpacity onPress={() => { }} activeOpacity={0.5}>
                    <Ionicons name={'md-remove-circle-outline'} size={25} color={'gray'} />
                  </TouchableOpacity>}
                  <Text style={styles.intValueCounterContainerText}>{amount[0]}</Text>
                  <TouchableOpacity onPress={() => updateIntValue(0, 1)} activeOpacity={0.5}>
                    <Ionicons name={'md-add-circle-outline'} size={25} color={'#049434'} />
                  </TouchableOpacity>
                </View>
                <Text>{product.measurement_unit}</Text>
                <Text>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price[0])}</Text>
              </View>}
              {product.unit_price !== null && <View
                style={{
                  borderBottomColor: 'lightgray',
                  borderBottomWidth: 1,
                  opacity: 0.4,
                  width: 325,

                }}
              />}
              {product.unit_price !== null && <View style={styles.measurementUnit}>
                <View style={styles.intValueCounterContainer}>
                  {amount[1] > 0 && <TouchableOpacity onPress={() => updateIntValue(1, -1)} activeOpacity={0.5}>
                    <Ionicons name={'md-remove-circle-outline'} size={25} color={'#049434'} />
                  </TouchableOpacity>}
                  {amount[1] <= 0 && <TouchableOpacity onPress={() => { }} activeOpacity={0.5}>
                    <Ionicons name={'md-remove-circle-outline'} size={25} color={'gray'} />
                  </TouchableOpacity>}
                  <Text style={styles.intValueCounterContainerText}>{amount[1]}</Text>
                  <TouchableOpacity onPress={() => updateIntValue(1, 1)} activeOpacity={0.5}>
                    <Ionicons name={'md-add-circle-outline'} size={25} color={'#049434'} />
                  </TouchableOpacity>
                </View>
                <Text>UN</Text>
                <Text>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price[1])}</Text>
              </View>}

            </View>
            <View style={styles.obsContainer}>
              <TextInput
                placeholder="Observações sobre o produto"
                maxLength={240}
                style={styles.textArea}
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setObservation(text)}
                value={observation}
              />
            </View>

            <TouchableWithoutFeedback onPress={() => addToCart()}>
              <View style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>Adicionar ao Carrinho</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

        </KeyboardAwareScrollView>

      </View>
    </TouchableWithoutFeedback>
  );
}