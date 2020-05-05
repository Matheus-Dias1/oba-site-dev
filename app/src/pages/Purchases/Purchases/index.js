import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  AsyncStorage,
} from 'react-native';
import styles from './styles';
import api from '../../../services/api';
import { useNavigation } from '@react-navigation/native';


export default function Purchases({ navigation }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const navigator = useNavigation();

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
      await AsyncStorage.removeItem('needsUpdate');
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
    if (totalPurchases > 0 && purchases.length === total && needsUpdate !== 'true') {
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
          alert('Faça login novamente para continuar');
        } else throw err;
      })


      setTotalPurchases(res.headers['X-Total-Count']);
      if (needsUpdate === 'true'){
        setPurchases(res.data);
        setPage(2);
      }
      else{
        setPurchases([...purchases, ...res.data]);
        setPage(page + 1);
      }
      
      setLoading(false);

    } catch (err) {
      console.log(err)
      Alert.alert('Erro ao recuperar pedidos', 'Tente novamente mais tarde')
    }
  }

  return (
    <View style={styles.container}>
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
            return Intl.DateTimeFormat('pt-BR').format(new Date(date))
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
    </View>

  );
}