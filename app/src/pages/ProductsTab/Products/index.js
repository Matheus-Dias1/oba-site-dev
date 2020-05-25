import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  AsyncStorage,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons'
import env from '../../../variables';
import api from './../../../services/api'
import AuthContext from '../../../authcontext';

import styles from './styles';
export default function Products() {
  const { signOut } = React.useContext(AuthContext);
  const navigation = useNavigation();
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [subtotalValue, setSubtotalValue] = useState(0);
  const [deletingItem, setDeletingItem] = useState(-1)
  const imageUrl = env.OBA_API_URL + 'image/'

  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [switchingCategory, setSwitchingCategory] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  async function registerForPushNotificationsAsync() {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        if (await AsyncStorage.getItem('ExpoPushToken') !== null) {
          updatePushToken('');
          await AsyncStorage.removeItem('ExpoPushToken');
        }
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      const oldToken = await AsyncStorage.getItem('ExpoPushToken');
      if (token !== oldToken) {
        updatePushToken(token);
        await AsyncStorage.setItem('ExpoPushToken', token);
      }

    }
    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  async function updatePushToken(token) {
    try {
      await api.put('/push', {
        token
      }, {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        }
      })
    } catch (err) {

    }
  }

  async function loadProducts() {
    if (loading) return;
    if (totalProducts > 0 && products.length == totalProducts) return;
    setLoading(true);
    let city = null;
    if (!selectedCity) {
      city = await AsyncStorage.getItem('selectedCity')
      if (city){
        setSelectedCity(city)
      }
    }
    try {
      const response = await api.get('/profile/products', {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        },
        params: {
          page,
          category: selectedCategory,
          city: city ? city : selectedCity
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          return signOut();
        } else throw err;
      });
      setProducts([...products, ...response.data]);
      setTotalProducts(response.headers['x-total-count']);
      setPage(page + 1);
    } catch (err) {
      Alert.alert('Erro ao carregar produtos', 'Tente novamente mais tarde')
    } finally {
      setLoading(false);
    }

  }


  async function loadNewCategory(category) {
    setLoading(true);
    setProducts([])
    setSwitchingCategory(true);
    try {
      const response = await api.get('/profile/products', {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        },
        params: {
          page: 1,
          category: category,
          city: selectedCity
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          return signOut();
        } else throw err;
      });
      setProducts(response.data);
      setTotalProducts(response.headers['x-total-count']);
      setPage(2);
      setSelectedCategory(category);

    } catch (err) {
      alert('Erro ao carregar nova categoria', 'Tente novamente mais tarde')
    } finally {
      setLoading(false);
      setSwitchingCategory(false);
    }

  }

  function calculateDealText(prod) {
    if (!prod.full_unit_price)
      return 100 - Math.ceil(prod.price * 100 / prod.full_price)
    if (!prod.full_price)
      return 100 - Math.ceil(prod.unit_price * 100 / prod.full_unit_price)
    const un = 100 - Math.ceil(prod.unit_price * 100 / prod.full_unit_price);
    const mu = 100 - Math.ceil(prod.price * 100 / prod.full_price)

    return un >= mu ? un : mu
  }

  async function loadNewCity(city) {
    setLoading(true);
    setProducts([])
    setSwitchingCategory(true);
    try {
      const response = await api.get('/profile/products', {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        },
        params: {
          page: 1,
          city: city
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          return signOut();
        } else throw err;
      });
      setProducts(response.data);
      setTotalProducts(response.headers['x-total-count']);
      setPage(2);

    } catch (err) {
      Alert.alert('Erro ao carregar nova categoria', 'Tente novamente mais tarde')
    } finally {
      setLoading(false);
      setSwitchingCategory(false);
    }

  }


  _handleNotification = async notification => {
    if (JSON.stringify(notification.data))
      await AsyncStorage.setItem('pushCupon', JSON.stringify(notification.data))
  };

  useEffect(() => {
    Notifications.addListener(_handleNotification)
    registerForPushNotificationsAsync();
    loadProducts();
    navigation.addListener('focus', () => {
      updateCity();
    });
  }, [])

  function handleCategoryClick(category) {
    if (switchingCategory) return;
    if (category === selectedCategory) return;
    loadNewCategory(category);
  }

  function navigateToDetails(product) {
    navigation.navigate('Produtos', {
      screen: 'ProductDetails',
      params: { product: product },
    });
  }

  async function openCart() {
    setShoppingCart([])
    setLoadingCart(true);
    setIsCartVisible(true);
    try {
      const response = await api.get('profile/shopping_cart', {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          return signOut();
        } else throw err;
      });
      setShoppingCart(response.data);

      const cartValue = await api.get('/profile/shopping_cart/value', {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          return signOut();
        } else throw err;
      });

      setSubtotalValue(cartValue.data.cartValue);

    } catch (err) {
      Alert.alert('Erro ao carregar o carrinho, tente novamente.');
    } finally {
      setLoadingCart(false);
    }

  }

  async function updateCity() {
    if (!!await AsyncStorage.getItem('newCity')) {
      await AsyncStorage.removeItem('newCity');
      setSelectedCity(await AsyncStorage.getItem('selectedCity'));
      loadNewCity(await AsyncStorage.getItem('selectedCity'));
      setSelectedCategory('');
    }
  }

  function closeCart() {
    setIsCartVisible(false);
  }

  function finalizePurchase() {
    if (loadingCart) return;
    setIsCartVisible(false);
    navigation.navigate('Produtos', {
      screen: 'FinalizePurchase',
      params: {
        cartSize: shoppingCart.length,
        subtotal: subtotalValue,
      }
    });
  }
  async function removeFromCart(item) {
    if (deletingItem >= 0) return;
    setDeletingItem(shoppingCart.indexOf(item))
    try {
      await api.delete('profile/shopping_cart', {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        },
        params: {
          id: item.id,
          amount: item.amount,
          observation: item.observation,
          unit: item.unit,
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          return signOut();
        } else throw err;
      });
      var price;
      if (item.unit === 'UN' && item.unit_price !== null)
        price = item.unit_price * item.amount
      else
        price = item.price * item.amount
      setSubtotalValue(subtotalValue - price)
      setDeletingItem(-1)
      setShoppingCart(shoppingCart.filter(Item => {
        return JSON.stringify(item) !== JSON.stringify(Item)
      }))
    } catch (err) {
      Alert.alert('Erro ao excluir item do carrinho.')
    }
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
          <FlatList
            style={styles.productsList}
            ListFooterComponent={(
              <TouchableWithoutFeedback onPress={() => closeCart()}>
                <View style={styles.addMoreItensContainer}>
                  {!loadingCart &&
                    <View>
                      {shoppingCart.length > 0 ?
                        <View style={styles.addItensToCart}>
                          <Text>Adicionar mais itens</Text>
                          < Ionicons name={'ios-add'} style={{ marginLeft: 20, marginTop: 3 }} size={30} color={'#049434'} />
                        </View>
                        :
                        <View style={styles.emptyCartContainer}>
                          <Text>Adicionar itens</Text>
                          < Ionicons name={'ios-add'} style={{ marginLeft: 10, marginTop: 3 }} size={30} color={'#049434'} />
                        </View>
                      }
                    </View>
                  }
                </View>
              </TouchableWithoutFeedback>
            )}
            showsVerticalScrollIndicator={false}
            data={shoppingCart}
            keyExtractor={item => String(shoppingCart.indexOf(item))}
            renderItem={({ item }) => {

              function formatPrice(item) {
                var price;
                if (item.unit === 'UN' && item.unit_price !== null)
                  price = item.unit_price * item.amount
                else
                  price = item.price * item.amount
                return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)
              }

              return (
                <TouchableWithoutFeedback>
                  <View>
                    <View style={styles.cartContainer}>
                      <View style={styles.cartListing}>
                        <View style={styles.cartListingNameAndAmout}>
                          <Text style={styles.cartListingAmount}>{`${String(item.amount).replace('.', '*').replace(',', '.').replace('*', ',')} `}<Text style={styles.cartListingObservation}>x</Text> <Text style={styles.cartListingProductName}>{item.name}</Text> ({item.unit})</Text>
                        </View>
                        {!!item.observation && <Text style={styles.cartListingObservation}>Observação: {item.observation}</Text>}
                        <Text style={styles.cartListingValue}>{formatPrice(item)}</Text>
                      </View>
                      <TouchableWithoutFeedback onPress={() => removeFromCart(item)}>
                        <View style={styles.removeFromCartIcon}>
                          {
                            deletingItem === shoppingCart.indexOf(item)
                              ? <ActivityIndicator size="small" color="#737380" />
                              : <Ionicons name={'md-trash'} size={25} color={'#737380'} />

                          }
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.cartListingSeparator} />

                  </View>
                </TouchableWithoutFeedback>

              )
            }}
          />
          {loadingCart && <View style={{ marginBottom: 300 }}>
            <ActivityIndicator size="small" color="#000" />
          </View>}

          <TouchableWithoutFeedback onPress={() => { (loadingCart || shoppingCart.length === 0) ? {} : finalizePurchase() }}>
            <View style={styles.finalizePurchase}>
              <Text style={styles.buyButton}>Concluir compra</Text>
              <Text style={styles.buyButton}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotalValue)}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>

      <SafeAreaView style={{ flex: 0, backgroundColor: '#049434' }} />

      <SafeAreaView style={{ flex: 1 }}>

        <View style={styles.container}>

          <FlatList
            style={styles.productsList}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.categoryList}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ListFooterComponent={<View style={{ marginLeft: 15 }} />}
                  keyExtractor={category => category}
                  data={[
                    '',
                    'ofertas',
                    'frutas',
                    'verduras',
                    'folhas',
                    'ovos',
                    'temperos',
                    'queijos',
                    'congelados',
                    'carnes',
                    'doces',
                  ]}
                  renderItem={({ item: category }) => (
                    <TouchableOpacity onPress={() => {
                      handleCategoryClick(category);
                    }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.categoryContainer}>
                        <Text style={styles.categoryText}>{category === '' ? 'Todos os produtos' : (category === 'ofertas' ? 'Promoções' : category)}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            }
            ListFooterComponent={
              <View style={styles.emptyListText} >
                {!loading && products.length === 0 &&
                  <Text style={styles.productProperty}>Nenhum produto nessa categoria</Text>
                }
                {loading &&
                  <ActivityIndicator size="small" color="#000" />
                }
              </View>}
            keyExtractor={product => String(product.id)}
            onEndReachedThreshold={0.1}
            onEndReached={() => loadProducts()}
            data={products}
            renderItem={({ item: product }) => (
              <TouchableOpacity activeOpacity={0.8} onPress={() => navigateToDetails(product)}>
                <View style={styles.product}>

                  <View style={styles.productInfo}>

                    <Text style={styles.productName}>
                      {product.product_name}
                    </Text>
                    <Text style={styles.productValue}>
                      <Text style={styles.productProperty}>{'Valor/' + product.measurement_unit + ': '}</Text>
                      {product.full_price && <Text style={styles.dealValueText}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.full_price)}</Text>}
                      {product.full_price && ' '}
                      {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </Text>
                    {product.unit_price !== null &&
                      <Text style={styles.productValue}>
                        <Text style={styles.productProperty}>{'Valor/UN: '}</Text>
                        {product.full_unit_price && <Text style={styles.dealValueText}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.full_unit_price)}</Text>}
                        {product.full_unit_price && ' '}
                        {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.unit_price)}
                      </Text>
                    }
                  </View>

                  <Image
                    style={styles.productImage}
                    source={{
                      uri: imageUrl + product.picture_path

                    }}
                  />

                  {(product.full_price || product.full_unit_price) &&
                    <View style={styles.dealContainer}>
                      <Text style={styles.dealText}>{`${calculateDealText(product)}% de desconto`}</Text>
                    </View>
                  }

                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableWithoutFeedback onPress={() => openCart()}>
            <View style={styles.showCartButton}>
              <Ionicons name={'ios-cart'} size={35} color={'white'} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>

    </View>
  );
}