import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
  AsyncStorage,
  Alert,
  Platform
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'
import AuthContext from '../../../authcontext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../../services/api'
import env from '../../../variables';


import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';

export default function ProductDetails() {
  const route = useRoute();
  const { signOut } = React.useContext(AuthContext);
  const [product, setProduct] = useState({});
  const [amount, setAmount] = useState([0, 0]);
  const [cut, setCut] = useState('');
  const [price, setPrice] = useState([0, 0]);
  const [value, setValue] = useState([0, 0]);
  const [observation, setObservation] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const imageUrl = env.OBA_API_URL + 'image/'

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
    }
    else {
      setAmount([amount[0] + val, amount[1]])
      setPrice([(amount[0] + val) * value[0], price[1]]);
    }

  }

  function needsCutInput() {
    if (route.params && route.params.product)
      if (route.params.product.category.includes('carnes'))
        return true
    return false
  }

  function updateFloatValue(val) {
    let newValue;
    if (val == "") newValue = 0;
    else newValue = parseFloat(val);
    setAmount([newValue, amount[1]]);
    setPrice([newValue * value[0], price[1]]);
  }
  async function addToCart() {
    if (loading) return;
    var data;
    setLoading(true);
    let obs
    if (route.params.product.category.includes('carnes')) {
      if (!cut) {
        Alert.alert('Erro ao adicionar ao carrinho', 'Informe o corte da carne')
        setLoading(false);
        return;
      }
      obs = observation
      ? observation.replace(/^\s+|\s+$/g, '').replace(/  +/g, ' ') + '\nCorte: ' + cut.replace(/^\s+|\s+$/g, '').replace(/  +/g, ' ')
      : 'Corte: ' + cut.replace(/^\s+|\s+$/g, '').replace(/  +/g, ' ')
    } else
      obs =  observation.replace(/^\s+|\s+$/g, '').replace(/  +/g, ' ')
    if (amount[0] > 0) {

      data = {
        id_product: product.id,
        amount: amount[0],
        unit: product.measurement_unit,
        observation: obs
      }
      try {
        await api.post('shopping_carts', data, {
          headers: {
            authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
          }
        }).catch(err => {
          if (err.response.status === 401 || err.response.status === 403) {
            Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
            setLoading(false);
            return signOut();
          } else throw err;
        });
      } catch (err) {
        Alert.alert('Erro ao adicionar ao carrinho', 'Tente novamente mais tarde')
      }

    }
    if (amount[1] > 0 && product.unit_price !== null) {
      data = {
        id_product: product.id,
        amount: amount[1],
        unit: 'UN',
        observation: observation.replace(/^\s+|\s+$/g, '').replace(/  +/g, ' ')
      }

      try {
        await api.post('shopping_carts', data, {
          headers: {
            authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
          }
        }).catch(err => {
          if (err.response.status === 401 || err.response.status === 403) {
            Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
            setLoading(false);
            return signOut();
          } else throw err;
        });
      } catch (err) {
        Alert.alert('Erro ao adicionar ao carrinho', 'Tente novamente mais tarde')
      }
    }
    setLoading(false);
    return navigation.goBack();
  }


  if (Platform.OS === "android")
    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}

        >
          <View style={styles.container}>
            <View>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  defaultSource={require('../../../assets/default.png')}
                  source={{
                    uri: imageUrl + product.picture_path
                  }}

                />
                <Text style={styles.productName}>{product.product_name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
              </View>
              <View style={styles.amountContainer}>
                {!['UN', 'BDJ', 'CX', 'PCT', 'DZ', 'G'].includes(product.measurement_unit) && <View style={styles.measurementUnit}>
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
                {['UN', 'BDJ', 'CX', 'PCT', 'DZ', 'G'].includes(product.measurement_unit) && <View style={styles.measurementUnit}>
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
                    width: '100%',

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
              {needsCutInput() &&
                <View style={styles.cutContainer}>
                  <TextInput
                    placeholder="Corte da carne"
                    maxLength={30}
                    textAlignVertical={'top'}
                    style={styles.cutInput}
                    onChangeText={(text) => setCut(text)}
                    value={cut}
                  />
                </View>
              }
              <View style={styles.obsContainer}>
                <TextInput
                  placeholder="Observações sobre o produto"
                  maxLength={240}
                  textAlignVertical={'top'}
                  style={styles.textArea}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={(text) => setObservation(text)}
                  value={observation}
                />
              </View>
            </View>

          </View>

        </ScrollView>
        <TouchableWithoutFeedback onPress={() => addToCart()}>
          <View style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>Adicionar ao Carrinho</Text>
            {loading ?
              <ActivityIndicator size="small" color="#fff" />
              : <Ionicons name={'ios-cart'} size={28} color={'white'} />
            }
          </View>
        </TouchableWithoutFeedback>
      </>

    );
  else
    return (

      <>
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  defaultSource={require('../../../assets/default.png')}
                  source={{
                    uri: imageUrl + product.picture_path
                  }}

                />
                <Text style={styles.productName}>{product.product_name}</Text>
                {
                  product.description
                  ? <Text style={styles.productDescription}>{product.description}</Text>
                  : <View style={{marginBottom: 10}}/>
                }
              </View>
              <View style={styles.amountContainer}>
                {!['UN', 'BDJ', 'CX', 'PCT', 'DZ', 'G'].includes(product.measurement_unit) && <View style={styles.measurementUnit}>
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
                {['UN', 'BDJ', 'CX', 'PCT', 'DZ', 'G'].includes(product.measurement_unit) && <View style={styles.measurementUnit}>
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
                    width: '100%',

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
              {needsCutInput() &&
                <View style={styles.cutContainer}>
                  <TextInput
                    placeholder="Corte da carne"
                    maxLength={30}
                    textAlignVertical={'top'}
                    style={styles.cutInput}
                    onChangeText={(text) => setCut(text)}
                    value={cut}
                  />
                </View>
              }
              <View style={styles.obsContainer}>
                <TextInput
                  placeholder="Observações sobre o produto"
                  maxLength={240}
                  textAlignVertical={'top'}
                  style={styles.textArea}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={(text) => setObservation(text)}
                  value={observation}
                />
              </View>
            </View>
          </View>

        </KeyboardAwareScrollView>
        <TouchableWithoutFeedback onPress={() => addToCart()}>
          <View style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>Adicionar ao Carrinho</Text>
            {loading ?
              <ActivityIndicator size="small" color="#fff" />
              : <Ionicons name={'ios-cart'} size={28} color={'white'} />
            }
          </View>
        </TouchableWithoutFeedback>
      </>

    );
}