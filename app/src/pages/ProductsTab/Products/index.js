import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,

} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons'
import api from './../../../services/api'
import logo from '../../../assets/logo_green_nobg.png'

import styles from './styles';
export default function Products() {

  const navigation = useNavigation();
  const [cartAccessible, setCartAccessible] = useState(true);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const imageUrl = 'http://192.168.1.33:3333/image/'


  async function loadProducts() {
    const response = await api.get('/profile/products');
    setProducts(response.data);
  }

  useEffect(() => {
    loadProducts();
  }, [])

  function navigateToDetails(product) {
    navigation.navigate('Produtos', {
      screen: 'ProductDetails',
      params: { product: product }
    });
  }

  function openCart() {
    setIsCartVisible(true);
  }
  function closeCart() {
    setIsCartVisible(false);
  }

  function finalizePurchase() {
    setIsCartVisible(false);
    navigation.navigate('Produtos', { screen: 'FinalizePurchase' });
  }



  return (
    <View style={{ flex: 1 }}>

      <Modal
        propagateSwipe={true}
        isVisible={isCartVisible}
        avoidKeyboard={true}
        onBackdropPress={() => closeCart()}
        onSwipeComplete={() => closeCart()}
        swipeDirection={"down"}
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => closeCart()}>
            <View style={styles.cartHeader}>
              <Ionicons style={styles.closeCartIcon} name={'ios-arrow-down'} size={30} color={'#049434'} />
              <Text style={styles.cartHeaderText}>Carrinho de Compras</Text>
            </View>
          </TouchableWithoutFeedback>
          <ScrollView>
            <TouchableWithoutFeedback>
              <View style={{ marginTop: 10 }}>
                <View style={styles.cartContainer}>
                  <View style={styles.cartListing}>
                    <View style={styles.cartListingNameAndAmout}>
                      <Text style={styles.cartListingAmount}>5 <Text style={styles.cartListingObservation}>x</Text> <Text style={styles.cartListingProductName}>Maçã</Text> (KG)</Text>
                    </View>
                    <Text style={styles.cartListingObservation}>Observação: Não se se muito muito muito muito muito muito muito muito muito muitomuito Maduros</Text>
                    <Text style={styles.cartListingValue}>R$ 2,00</Text>
                  </View>
                  <Ionicons name={'ios-trash'} style={styles.cartListingDeleteIcon} size={30} color={'#737380'} />
                </View>
                <View style={styles.cartListingSeparator} />




                <TouchableWithoutFeedback onPress={() => closeCart()}>
                  <View style={styles.addMoreItensContainer}>
                    <Text>Adicionar mais itens</Text>
                    <Ionicons name={'ios-add'} style={{ marginLeft: 20, marginTop: 3 }} size={30} color={'#049434'} />
                  </View>
                </TouchableWithoutFeedback>



              </View>

            </TouchableWithoutFeedback>
          </ScrollView>
          <TouchableWithoutFeedback onPress={() => finalizePurchase()}>
            <View style={styles.finalizePurchase}>
              <Text style={styles.buyButton}>Concluir compra</Text>
              <Text style={styles.buyButton}>R$ 52,00</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={{ flex: 0, backgroundColor: '#049434' }} />

      <SafeAreaView style={{ flex: 1 }}>

        <View style={styles.container}>

          <FlatList
            style={styles.productsList}
            showsVerticalScrollIndicator={false}
            keyExtractor={product => String(product.id)}
            data={products}
            renderItem={({ item: product }) => (
              <TouchableOpacity onPress={() => navigateToDetails(product)} activeOpacity={0.8}>
                <View style={styles.product}>

                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.product_name}</Text>
                    <Text style={styles.productValue}><Text style={styles.productProperty}>{'Valor/' + product.measurement_unit + ': '}</Text>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</Text>
                    {product.unit_value !== null && <Text style={styles.productValue}><Text style={styles.productProperty}>{'Valor/UN: '}</Text>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.unit_price)}</Text>}
                  </View>
                  

                  <Image
                    style={styles.productImage}
                    source={{
                      uri: imageUrl + product.picture_path

                    }}
                  />

                </View>
              </TouchableOpacity>
            )}
          />

        </View>

      </SafeAreaView>

      {cartAccessible && <TouchableWithoutFeedback onPress={() => openCart()}>
        <View style={styles.showCartButton}>
          <Ionicons name={'ios-cart'} size={35} color={'white'} />
          <Text style={styles.showCartText}>Abrir Carrinho</Text>
        </View>
      </TouchableWithoutFeedback>}

    </View>
  );
}