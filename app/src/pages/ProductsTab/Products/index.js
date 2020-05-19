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
  AsyncStorage,
  Alert,
  ActivityIndicator,

} from 'react-native';
import Modal from 'react-native-modal';
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
  const imageUrl = env.OBA_API_URL + 'image/'

  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [switchingCategory, setSwitchingCategory] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  async function loadProducts() {
    if (loading) return;
    if (totalProducts > 0 && products.length == totalProducts) return;
    setLoading(true);
    try {
      const response = await api.get('/profile/products', {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        },
        params: {
          page,
          category: selectedCategory,
          city: selectedCity
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

  async function loadNewCity(city) {
    setLoading(true);
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

  useEffect(() => {
    const abortController = new AbortController();
    loadProducts();
    const unsubscribe = navigation.addListener('focus', () => {
      updateCity();
    });
    return abortController.abort();
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
        subtotal: subtotalValue
      }
    });
  }
  async function removeFromCart(item) {
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
      setShoppingCart(shoppingCart.filter(Item => {
        return JSON.stringify(item) !== JSON.stringify(Item)
      }))
    } catch (err) {
      Alert.alert('Erro ao excluir item do carrinho.')
    }
  }



  return (
    <View style={{ flex: 1 }}>
    {isCartVisible ? <StatusBar backgroundColor="#4d4d4d"/> : <StatusBar backgroundColor="white"/> }
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
                  <Text>Adicionar mais itens</Text>
                  <Ionicons name={'ios-add'} style={{ marginLeft: 20, marginTop: 3 }} size={30} color={'#049434'} />
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
                          <Ionicons name={'md-trash'} size={25} color={'#737380'} />
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
            <ActivityIndicator size="large" color="#000" />
          </View>}

          <TouchableWithoutFeedback onPress={() => finalizePurchase()}>
            <View style={styles.finalizePurchase}>
              <Text style={styles.buyButton}>Concluir compra</Text>
              <Text style={styles.buyButton}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotalValue)}</Text>
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
            ListHeaderComponent={
              <View style={styles.categoryList}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ListFooterComponent={<View style={{ marginLeft: 15 }} />}
                  keyExtractor={category => category}
                  data={[
                    '',
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
                        <Text style={styles.categoryText}>{category === '' ? 'Todos os produtos' : category}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            }
            ListFooterComponent={<View style={{ marginBottom: 30 }} />}
            keyExtractor={product => String(product.id)}
            onEndReachedThreshold={0.1}
            onEndReached={() => loadProducts()}
            data={products}
            renderItem={({ item: product }) => (
              <TouchableOpacity  activeOpacity={0.8} onPress={() => navigateToDetails(product)}>
                <View style={styles.product}>

                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.product_name}</Text>
                    <Text style={styles.productValue}><Text style={styles.productProperty}>{'Valor/' + product.measurement_unit + ': '}</Text>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</Text>
                    {product.unit_price !== null && <Text style={styles.productValue}><Text style={styles.productProperty}>{'Valor/UN: '}</Text>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.unit_price)}</Text>}
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
          <TouchableWithoutFeedback onPress={() => openCart()}>
            <View style={styles.showCartButton}>
              <Ionicons name={'ios-cart'} size={35} color={'white'} />
            </View>
          </TouchableWithoutFeedback>
          {((loading && products.length === 0) || switchingCategory) && <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>}

        </View>
      </SafeAreaView>

    </View>
  );
}