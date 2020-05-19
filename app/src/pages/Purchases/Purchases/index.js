import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import api from '../../../services/api';
import AuthContext from '../../../authcontext';
import { useNavigation } from '@react-navigation/native';


export default function Purchases({ navigation }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const navigator = useNavigation();
  const { signOut } = React.useContext(AuthContext);


  useEffect(() => {
    getPurchases();
    const unsubscribe = navigation.addListener('focus', () => {
      updateList();
    });
    return unsubscribe;
  }, [])

  async function updateList() {
    const needsUpdate = await AsyncStorage.getItem('needsUpdate')
    if (needsUpdate === 'true') {
      getPurchases();
    }
  }

  function navigateToDetails(purchase) {
    navigator.navigate('PurchaseDetails', {
      params: {
        purchase
      }
    })
  }

  async function getPurchases() {
    if (loading) {
      return;
    }
    const needsUpdate = await AsyncStorage.getItem('needsUpdate');
    if (totalPurchases > 0 && purchases.length == totalPurchases && needsUpdate == null) {
      return;
    }

    setLoading(true);

    try {
      const res = await api.get('profile/purchases', {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        },
        params: {
          page: needsUpdate === 'true' ? 1 : page
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          setLoading(false);
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          return signOut();
        } else throw err;
      })


      setTotalPurchases(res.headers['x-total-count']);
      if (needsUpdate === 'true') {
        setPurchases(res.data);
        setPage(2);
      }
      else {
        setPurchases([...purchases, ...res.data]);
        setPage(page + 1);
      }
      await AsyncStorage.removeItem('needsUpdate');

    } catch (err) {
      Alert.alert('Erro ao recuperar pedidos', 'Tente novamente mais tarde')
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {!loading && purchases.length === 0 && 
        <View style={styles.emptyListTextContainer}>
        <Text style={styles.emptyListText}>{'Você ainda não fez nenhum pedido'}</Text>
      </View>}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={purchases}
        onEndReached={getPurchases}
        onEndReachedThreshold={0.2}
        ListFooterComponent={<View style={{ height: 30 }} />}
        keyExtractor={purchase => String(purchases.indexOf(purchase))}
        renderItem={({ item: purchase }) => {

          function formatPrice(number) {
            return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number)
          }
          function formatDate(date) {
            return Intl.DateTimeFormat('pt-BR').format(date)
          }

          return (
            <TouchableWithoutFeedback onPress={() => navigateToDetails(purchase)}>
              <View style={styles.purchaseContainer}>
                <View style={styles.contentContainer}>
                  <View style={styles.content}>
                    <Text style={styles.property}>
                      Data de entrega: <Text style={styles.value}>
                        {formatDate(purchase.delivery_date)}
                      </Text>
                    </Text>
                    <Text style={styles.property}>
                      Período de entrega: <Text style={styles.value}>
                        {purchase.delivery_period === 'morning' ? 'Manhã' : 'Tarde'}
                      </Text>
                    </Text>
                    <Text style={styles.property}>
                      Endereço: <Text style={[styles.value, { textTransform: 'capitalize' }]}>
                        {`${purchase.street}, ${purchase.number}`}
                      </Text>
                    </Text>

                  </View>
                </View>
                <Text style={[styles.property, styles.priceProperty]}>
                  Valor do pedido: <Text style={[styles.value, styles.priceValue]}>
                    {formatPrice(purchase.value)}
                  </Text>
                </Text>
              </View>
            </TouchableWithoutFeedback>

          )
        }}
      />
      {loading && <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>}
    </View>

  );
}