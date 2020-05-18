import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  AsyncStorage,
  Alert,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import AuthContext from '../../../authcontext';
import api from '../../../services/api';
import styles from './styles';


export default function Purchases() {
  const { signOut } = React.useContext(AuthContext);
  const route = useRoute();
  const [purchase, setPurchase] = useState({
    delivery_date: '1970-01-01T04:00:00Z'
  });
  const [productsPurchase, setProductsPurchase] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPurchase(route.params.params.purchase);
    getProductsPurchase();
  }, [])

  async function getProductsPurchase() {
    const id = route.params.params.purchase.id;
    try {
      const res = await api.get(`profile/productsPurchase/${id}`, {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          setLoading(false);
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          return signOut();
        } else throw err;
      });
      setProductsPurchase(res.data);
      setLoading(false);
    } catch (err) {
      Alert.alert('Erro ao recuperar item da compra', 'Tente novamente mais tarde');
    }
  }

  function formatChangeFor(n1, n2) {
    const a = n1 + n2;
    return formatPrice(a)
  }

  function formatPrice(number) {
    return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number)
  }
  function formatDate(date) {
    return Intl.DateTimeFormat('pt-BR').format(new Date(date))
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <StatusBar backgroundColor="#f2f2f2" />
        <View style={styles.content}>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionContent}>
              <Text style={[styles.property, { marginTop: 3 }]}>{'Data de entrega: '}
                <Text style={styles.value}>{formatDate(purchase.delivery_date)}</Text>
              </Text>
              <Text style={styles.property}>{'Período de entrega: '}
                <Text style={styles.value}>{purchase.delivery_period === 'morning' ? 'Manhã' : 'Tarde'}</Text>
              </Text>
              <Text style={styles.property}>{'Entregue: '}
                <Text style={styles.value}>{purchase.delivered ? 'Sim' : 'Não'}</Text>
              </Text>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionContent}>
              <Text style={[styles.property, { marginTop: 3, }]}>{'Endereço de entrega: '}
                <Text style={[styles.value, { textTransform: "capitalize" }]}>{purchase.street + ', ' + purchase.number}</Text>
              </Text>
              {!!purchase.complement && <Text style={styles.property}>{'Complemento: '}
                <Text style={styles.value}>{purchase.complement}</Text>
              </Text>}
              <Text style={styles.property}>{'Bairro: '}
                <Text style={[styles.value, { textTransform: "capitalize" }]}>{purchase.neighborhood}</Text>
              </Text>
              <Text style={styles.property}>{'Cidade: '}
                <Text style={[styles.value, { textTransform: "capitalize" }]}>{purchase.city + '/'}
                  <Text style={[styles.value, { textTransform: 'uppercase' }]}>{purchase.state}</Text>
                </Text>
              </Text>

            </View>
          </View>
          {!!purchase.observation && <View style={styles.sectionContainer}>
            <View style={styles.sectionContent}>
              <Text style={[styles.property, { marginTop: 3 }]}>{'Observação: '}
                <Text style={styles.value}>{purchase.observation}</Text>
              </Text>
            </View>
          </View>}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionContent}>
              <Text style={[styles.property, { marginTop: 3 }]}>{'Valor da compra: '}
                <Text style={styles.value}>{formatPrice(purchase.value)}</Text>
              </Text>
              <Text style={styles.property}>{'Método de pagamento: '}
                <Text style={styles.value}>{purchase.payment_method}</Text>
              </Text>
              {purchase.payment_method === 'Dinheiro' && <Text style={styles.property}>{'Troco para: '}
                <Text style={styles.value}>{formatChangeFor(purchase.value, purchase.change)}</Text>
              </Text>}
            </View>
          </View>
          <View style={[styles.sectionContainer, { marginTop: 10 }]}>
            <View style={[styles.sectionContent, { minHeight: 200 }]}>
              <Text style={styles.itemsTitleText}>Itens</Text>
              {loading ?
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#000" />
                </View>
                : productsPurchase.map(item => {

                  return (
                    <View key={productsPurchase.indexOf(item)} style={{ marginVertical: 5 }}>
                      <Text style={{ color: '#41414b' }}>{`${String(item.amount).replace('.', '*').replace(',', '.').replace('*', ',')} `}<Text style={styles.cartListingObservation}>x</Text> <Text style={styles.cartListingProductName}>{item.name}</Text> ({item.unit})</Text>
                      {!!item.observation && <Text style={styles.cartListingObservation}>Observação: {item.observation}</Text>}
                    </View>
                  )
                })
              }

            </View>
          </View>
        </View>
      </View>
    </ScrollView>

  );
}