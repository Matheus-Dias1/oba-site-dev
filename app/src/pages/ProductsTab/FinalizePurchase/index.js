import React, { useState, useEffect } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons/'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Modal from 'react-native-modal';
import { TextInputMask } from 'react-native-masked-text'
import * as MailComposer from 'expo-mail-composer';
import { useNavigation, useRoute } from '@react-navigation/native';
import AuthContext from '../../../authcontext';
import api from '../../../services/api'
import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  TextInput,
  Linking,
  ScrollView,
  Keyboard,
  Alert,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';



import styles from './styles';


export default function FinalizePurchase() {
  const route = useRoute();

  const [selectedAddress, setSelectedAddress] = useState(-1);
  const [addresses, setAddresses] = useState([]);
  const [changeFor, setChangeFor] = useState('R$ ');
  const [selectedDate, setSelectedDate] = useState(-1);
  const [dates, setDates] = useState([]);
  const [observation, setObservation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showDeliveryFeeModal, setShowDeliveryFeeModal] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [total, setTotal] = useState(parseFloat(route.params.subtotal));
  const [cupon, setCupon] = useState('');
  const [cuponValidated, setCuponValidated] = useState(false);
  const [cuponDiscount, setCuponDiscount] = useState(0);
  const [addressLocked, setAddressLocked] = useState(false);
  const [lockedProducts, setLockedProduts] = useState('');
  const [dateLock, setDateLock] = useState(true);

  const [addressesLoading, setAddressesLoading] = useState(true);
  const [datesLoading, setDatesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cuponLoading, setCuponLoading] = useState(false);

  const { signOut } = React.useContext(AuthContext);

  const navigation = useNavigation();

  useEffect(() => {
    sendPixelInitiate();
    getAddresses();
    getSelectedAddress();
    getDates();
    setPushCupon();
  }, [])

  async function sendPixelInitiate() {
    try {
      await api.post('fbPixel/checkout/initiate', {
        email: await AsyncStorage.getItem('email'),
        name: await AsyncStorage.getItem('name'),
        numItems: route.params.cartSize
      }, {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        }
      })
    } catch (err) {

    }
  }

  async function setPushCupon() {
    const pushCupon = JSON.parse(await AsyncStorage.getItem('pushCupon'));
    if (pushCupon && pushCupon.exp > new Date().valueOf())
      setCupon(pushCupon.cupon)
    else
      await AsyncStorage.removeItem('pushCupon');
  }

  async function finalizePurchase() {
    if (loading) return;
    if (addressLocked) {
      Alert.alert('Não é possível concluir sua compra', lockedProducts)
      return;
    }
    if (selectedAddress == null || selectedAddress < 0)
      return Alert.alert('Nenhum endereço de entrega foi selecionado');
    if (selectedDate < 0)
      return Alert.alert('Nenhuma data e período de entrega foram selecionados');
    if (paymentMethod === '')
      return Alert.alert('Nenhum método de pagamento foi selecionado');

    setLoading(true);
    const data = {
      id_address: addresses[selectedAddress].id,
      delivery_date: dates[selectedDate].date,
      delivery_period: dates[selectedDate].period,
      cupon: cuponValidated ? cupon.replace(/^\s+|\s+$/g, '') : 'NO_CUPON',
      observation: observation.replace(/^\s+|\s+$/g, '').replace(/  +/g, ' '),
      change: changeFor === 'R$ ' ? 0 : (parseFloat(changeFor.replace('R$ ', '').replace(/\./g, '').replace(/,/g, '.')) - total),
      payment_method: paymentMethod,
      value: total
    }

    try {
      const res = await api.post('purchases', data, {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          setLoading(false);
          return signOut();
        } else throw err;
      })
      if (res.data.status === 'FAIL')
        Alert.alert(res.data.error)
      else {
        try {
          await api.post('fbPixel/checkout/finalize', {
            email: await AsyncStorage.getItem('email'),
            name: await AsyncStorage.getItem('name'),
            value: total,
            items: res.data.items,
            orderID: res.data.orderID,
            address: {
              city: addresses[selectedAddress].city,
              state: addresses[selectedAddress].state
            },
          }, {
            headers: {
              authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
            }
          })
        } catch (err) {

        }
        if (cuponValidated && await AsyncStorage.getItem('pushCupon') && cupon === JSON.parse(await AsyncStorage.getItem('pushCupon')).cupon)
          await AsyncStorage.removeItem('pushCupon');
        await AsyncStorage.setItem('needsUpdate', 'true');
        navigation.navigate('Pedidos', {
          screen: 'Purchases'
        });
        return navigation.goBack();
      }

      if (res.data.error === 'O cupom expirou ou foi usado por outra pessoa') {
        setCuponDiscount(0);
        setCuponValidated(false);
        setCupon('');
        if (paymentMethod === 'Dinheiro')
          setPaymentMethod('')
      }

    } catch (err) {
      Alert.alert('Não foi possível concluir sua compra', 'Tente novamente mais tarde')
    } finally {
      setLoading(false);
    }
  }

  async function validateCupon() {
    if (cuponLoading) return;
    if (cuponValidated)
      return Alert.alert('Você não pode utilizar mais de um cupom na mesma compra');
    if (cupon === '')
      return;
    setCuponLoading(true);
    try {
      const res = await api.get(`cupons/${cupon.replace(/^\s+|\s+$/g, '')}`, {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          setCuponLoading(false);
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          return signOut();
        } else throw err;
      });

      if (res.data.status === 'FAIL') {
        setCuponLoading(false);
        return Alert.alert(res.data.message);

      }
      if (res.data.result.min_value > parseFloat(route.params.subtotal)) {
        setCuponLoading(false);
        return Alert.alert('Valor mínimo do cupom não atingido', `Esse cupom tem um valor mínimo de ${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(res.data.result.min_value))} em produtos.`)

      }

      setCuponValidated(true);
      if (res.data.result.discount_type === '-') {
        setCuponDiscount(res.data.result.discount)
        setTotal((total - res.data.result.discount > 0) ? total - res.data.result.discount : 0)
      } else if (res.data.result.discount_type === '%') {
        setCuponDiscount(res.data.result.discount / 100 * parseFloat(route.params.subtotal))
        setTotal(total - (res.data.result.discount / 100 * parseFloat(route.params.subtotal)))
      }

    } catch (err) {
      Alert.alert('Erro ao validar cupom', 'Tente novamente mais tarde')
    } finally {
      setCuponLoading(false);
    }
  }


  async function getSelectedAddress() {
    setSelectedAddress(await AsyncStorage.getItem('selectedAddress'))
  }

  async function selectAddress(address) {
    await AsyncStorage.setItem('selectedAddress', String(address));
    const curCity = await AsyncStorage.getItem('selectedCity');
    if ((addresses[address].city).toLowerCase() === 'araguari') {
      if (curCity !== 'araguari') {
        await AsyncStorage.setItem('newCity', 'true');
        checkForCity('araguari');
        getDates('araguari');
        setSelectedDate(-1);
      }
      await AsyncStorage.setItem('selectedCity', 'araguari')
    }
    if (['uberlandia', 'uberlândia', 'udi'].includes((addresses[address].city).toLowerCase())) {
      if (curCity !== 'uberlandia') {
        await AsyncStorage.setItem('newCity', 'true');
        checkForCity('uberlandia');
        getDates('uberlandia');
        setSelectedDate(-1);
      }
      await AsyncStorage.setItem('selectedCity', 'uberlandia')
    }
    setSelectedAddress(address);
    setDeliveryFee(addresses[parseInt(address)].delivery_fee);
    if (parseFloat(route.params.subtotal) < 90) {
      setTotal(total + addresses[parseInt(address)].delivery_fee - deliveryFee)
    } else if (paymentMethod === 'Voucher Alimentação') {
      setTotal(total + addresses[parseInt(address)].delivery_fee - deliveryFee)
    } else {
      setFreeDelivery(true);
    }

  }

  async function checkForCity(city) {
    try {
      const res = await api.get('shopping_carts/check', {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        },
        params: {
          city: city
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          setAddressesLoading(false);
          return signOut();
        } else throw err;
      })

      if (res.data.status === 'OK') {
        setAddressLocked(false)
      }
      else {
        setAddressLocked(true)
        var str = '';
        for (let i in res.data.products) {
          str += res.data.products[i] + ', '
        }
        setLockedProduts('\nPor enquanto, não estregamos o(s) seguinte(s) produto(s) no endereço selecionado: ' + str.substring(0, str.length - 2))
        Alert.alert('Não entregamos algum item no endereço selecionado', '\nPor enquanto, não estregamos o(s) seguinte(s) produto(s) no endereço selecionado: ' + str.substring(0, str.length - 2))
      }

    } catch (err) {
      Alert.alert('Erro ao verificar carrinho', 'É possível que tenha produtos no seu carrinho que não entreguemos no endereço selecionado')
    }
  }

  async function getAddresses() {
    try {
      const res = await api.get('profile/addresses', {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          setAddressesLoading(false);
          return signOut();
        } else throw err;
      });
      setAddresses(res.data);
      if (await AsyncStorage.getItem('selectedAddress') === null)
        setDeliveryFee(0)
      else {
        setDeliveryFee(res.data[await AsyncStorage.getItem('selectedAddress')].delivery_fee)
        if (parseFloat(route.params.subtotal) < 90 && paymentMethod !== 'Voucher Alimentação')
          setTotal(total + res.data[await AsyncStorage.getItem('selectedAddress')].delivery_fee)
        else
          setFreeDelivery(true);
      }
    } catch (err) {
      Alert.alert('Erro ao carregar os endereços cadastrados', 'Tente novamente mais tarde')
    } finally {
      setAddressesLoading(false);
    }
  }

  async function getDates(paramCity) {
    const city = await AsyncStorage.getItem('selectedCity');
    if (!city && !paramCity) {
      setDateLock(true);
      setDatesLoading(false);
      return;
    };
    setDateLock(false);
    setDatesLoading(true);
    try {
      const res = await api.get('schedule', {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('accessToken')
        },
        params: {
          city: paramCity == null ? city : paramCity
        }
      }).catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          Alert.alert('Sessão expirada', 'Faça login novamente para continuar');
          setDatesLoading(false);
          return signOut();
        } else throw err;
      });
      setDates(res.data)

    } catch (err) {
      Alert.alert('Erro ao carregar os horários cadastrados', 'Tente novamente mais tarde')
    } finally {
      setDatesLoading(false);
    }
  }

  function navigateToNewAddress() {


    navigation.navigate('Perfil', {
      screen: 'Profile'
    });

    navigation.goBack();
  }

  function handlePaymentMethod(method) {
    if (parseFloat(route.params.subtotal) >= 90 && paymentMethod === 'Voucher Alimentação' && method !== 'Voucher Alimentação') {
      setFreeDelivery(true);
      setTotal(total - deliveryFee);
    } else if (parseFloat(route.params.subtotal) >= 90 && paymentMethod !== 'Voucher Alimentação' && method === 'Voucher Alimentação') {
      setFreeDelivery(false);
      setTotal(total + deliveryFee);
    }
    if (method === 'Dinheiro')
      setShowChangeModal(true);
    else if (method === 'Transferência Bancaria')
      setShowTransferModal(true);
    else if (method === 'Voucher Alimentação')
      setShowVoucherModal(true);
  }



  function getIcon(str) {
    if (str === 'Dinheiro')
      return <Ionicons name={'md-cash'} size={30} color={'green'} />
    else if (str === 'Cartão de Crédito' || str === 'Cartão de Débito')
      return <Ionicons name={'md-card'} size={30} color={'green'} />
    else if (str === 'Transferência Bancaria')
      return <MaterialCommunityIcons name={'bank-transfer'} size={33} color={'green'} />
    else if (str === 'Voucher Alimentação')
      return <MaterialCommunityIcons name="ticket-confirmation" size={30} color={'green'} />

  }


  function verifyChange(needsChange) {
    if (needsChange) {
      if (parseFloat(changeFor.replace('R$ ', '').replace(/\./g, '').replace(/,/g, '.')) < total)
        return Alert.alert('O valor digitado deve ser maior ou igual ao total da compra.')
    } else {
      setChangeFor('R$ ');
    }
    Keyboard.dismiss();
    setShowChangeModal(false);
  }

  function sendEmail() {
    MailComposer.composeAsync({
      subject: 'Envio de Comprovante',
      recipients: ['obahortifruti20@gmail.com']
    })
  }

  function sendWhatsAppMessage() {
    Linking.openURL('whatsapp://send?phone=5534997762094')
  }

  const listFooter = () => (
    <TouchableWithoutFeedback onPress={() => navigateToNewAddress()}>
      <View style={styles.addAddressButtonContainer}>
        <Ionicons style={styles.addAddressButton} name={'ios-add'} size={55} color={'#049434'} />
      </View>
    </TouchableWithoutFeedback>
  );


  return (
    <View style={styles.container}>
      <Modal
        isVisible={showChangeModal}
        avoidKeyboard={true}

        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalPrice}>Total: {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(total))}</Text>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.modalTitle}>Troco para</Text>
              <TextInputMask
                type={'money'}
                keyboardType={'number-pad'}
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$ ',
                  suffixUnit: ''
                }}
                style={styles.changeForInput}
                autoFocus={true}
                value={changeFor}
                onChangeText={text => setChangeFor(text)}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableWithoutFeedback onPress={() => verifyChange(true)}>
                <View style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Continuar</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => verifyChange(false)}>
                <View style={[styles.modalButton]}>
                  <Text style={styles.modalButtonText}>Não preciso de troco</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={showVoucherModal}
        avoidKeyboard={true}
        onBackdropPress={() => setShowVoucherModal(false)}
        onSwipeComplete={() => setShowVoucherModal(false)}
        swipeDirection={"down"}
        style={styles.modal}
      >
        <View style={styles.VoucherModalContainer}>
          <ScrollView>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View>
                  <Text style={styles.transferModalTitle}>Voucher Alimentação{'\n'}</Text>
                  <Text style={styles.transferModalBody}>
                    {`Aceitamos os seguintes vouchers: Alelo, Sodexo, Up e Valecard.\n\n`}
                    <Text style={{ fontWeight: '700' }}>{'Não'}</Text>
                    {' é possível pagar a taxa de entrega ('}
                    {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(deliveryFee))}
                    {') com o voucher, a mesma deve ser paga com dinheiro, cartão de crédito ou cartão de débito.'}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
          <TouchableWithoutFeedback onPress={() => setShowVoucherModal(false)}>
            <View style={styles.transferModalButton}>
              <Text style={styles.transferModalButtonText}>Entendi</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>

      <Modal
        isVisible={showDeliveryFeeModal}
        avoidKeyboard={true}
        onBackdropPress={() => setShowDeliveryFeeModal(false)}
        onSwipeComplete={() => setShowDeliveryFeeModal(false)}
        swipeDirection={"down"}
        style={styles.modal}
      >
        <View style={styles.VoucherModalContainer}>
          <ScrollView>
            <View style={styles.modalContent}>
              <View>
                <Text style={styles.transferModalTitle}>Taxa de entrega{'\n'}</Text>
                <Text style={styles.transferModalBody}>
                  A taxa de entrega é calculada de acordo com a distância
                    do endereço selecionado até nossa localização.{'\n\n'}
                    Em compras acima de R$90,00 a taxa não é cobrada
                    (não aplicável para compras feitas com vocher alimentação).

                  </Text>

              </View>
            </View>
          </ScrollView>
          <TouchableWithoutFeedback onPress={() => setShowDeliveryFeeModal(false)}>
            <View style={styles.transferModalButton}>
              <Text style={styles.transferModalButtonText}>Entendi</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>

      <Modal
        isVisible={showTransferModal}
        avoidKeyboard={true}
        propagateSwipe={true}
        onBackdropPress={() => setShowTransferModal(false)}
        onSwipeComplete={() => setShowTransferModal(false)}
        swipeDirection={"down"}
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View>
                  <Text style={styles.transferModalTitle}>Transferência Bancaria{'\n'}</Text>
                  <Text style={styles.transferModalBody}>Transfira a quantia (<Text style={{ fontWeight: '700' }}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(total))}</Text>) para uma das contas abaixo. Envie o comprovante da transferência para nosso WhatsApp ou para nosso e-mail.</Text>
                  <View style={styles.transferModalInfoContainer}>
                    <View style={styles.transferModalInfoContent}>
                      <Text selectable={true}>
                        {"Banco: Sicoob\nConta Corrente: 16015-6\nAgência: 3224\nUberlândia - MG\nCNPJ: 35.810.505/0001-04\nBeneficiário: Oba Hortifruti e Comercio Ltda"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.transferModalInfoContainer}>
                    <View style={styles.transferModalInfoContent}>
                      <Text selectable={true}>
                        {"Banco: Caixa Econômica Federal\nConta Corrente: 107518-1\nAgência: 0161\nUberlândia - MG\nCPF: 010.325.706-36\nBeneficiário: Andrea Carrijo Dias Gama"}
                      </Text>
                    </View>

                  </View>
                  <View style={styles.transferModalTwoButtonContainer}>
                    <TouchableWithoutFeedback onPress={() => sendWhatsAppMessage()}>
                      <View style={styles.transferModalTwoButton}>
                        <Ionicons name={'logo-whatsapp'} size={30} color={'#049434'} />
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => sendEmail()}>
                      <View style={styles.transferModalTwoButton}>
                        <Ionicons name={'ios-mail'} size={30} color={'#049434'} />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                <View style={{ alignSelf: 'stretch' }}>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
          <TouchableWithoutFeedback onPress={() => setShowTransferModal(false)}>
            <View style={styles.transferModalButton}>
              <Text style={styles.transferModalButtonText}>Continuar</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>Endereço de entrega</Text>
          <View style={styles.addressContainer}>
            {
              addressesLoading ?
                <View>
                  <ActivityIndicator size="small" color="#000" />
                </View>
                : <FlatList
                  ListFooterComponent={listFooter}
                  contentContainerStyle={styles.addressesList}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={address => String(addresses.indexOf(address))}
                  data={addresses}
                  renderItem={({ item: address }) => (

                    <TouchableWithoutFeedback onPress={() => selectAddress(addresses.indexOf(address))} activeOpacity={0.8}>
                      <View style={selectedAddress == addresses.indexOf(address) ? styles.selectedAddress : styles.address}>
                        <View style={styles.addressInfo}>
                          <Text style={styles.addressInfoStreet}>{`${address.street}, ${address.number}`}</Text>
                          <View>
                            <Text style={styles.addressInfoNeighborhood}>{address.neighborhood}</Text>
                            <Text style={styles.addressInfoNeighborhood}>{address.city}</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                />
            }
          </View>
          <Text style={styles.subtitle}>Data e período de entrega</Text>
          <View style={styles.dateContainer}>
            {
              datesLoading ?
                <View>
                  <ActivityIndicator size="small" color="#000" />
                </View>
                : (dateLock ?
                  <>
                    {dateLock && <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 15, color: '#41414b' }}>{'Selecione um endereço para continuar'}</Text>
                    </View>}
                  </>
                  : <FlatList
                    ListFooterComponent={<View style={{ marginRight: 10 }} />}
                    contentContainerStyle={styles.datesList}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={date => String(dates.indexOf(date))}
                    data={dates}
                    renderItem={({ item: date }) => (

                      <TouchableWithoutFeedback onPress={() => { setSelectedDate(dates.indexOf(date)) }} activeOpacity={0.8}>
                        <View style={dates.indexOf(date) === selectedDate ? styles.selectedDate : styles.date}>
                          <View style={styles.dateInfoContainer}>
                            <Text style={styles.dateInfo}>{Intl.DateTimeFormat('pt-BR').format(new Date(date.date))}</Text>
                            <Text style={styles.periodInfo}>{date.period === 'morning' ? 'Manhã' : (date.period === 'afternoon' ? 'Tarde' : 'Noite')}</Text>

                            {
                              addresses[selectedAddress] &&
                              ['uberlandia', 'uberlândia', 'udi'].includes(addresses[selectedAddress].city.toLowerCase()) &&
                              [1, 4].includes(new Date(date.date).getUTCDay()) &&
                              <Text style={styles.periodTimeSpan}>{date.period === 'morning' ? '10h30 - 13h00' : (date.period === 'afternoon' ? '15h00 - 19h30' : 'A partir das 18h00')}</Text>
                            }
                            {
                              addresses[selectedAddress] &&
                              ['araguari'].includes(addresses[selectedAddress].city.toLowerCase()) &&
                              [1, 4].includes(new Date(date.date).getUTCDay()) &&
                              <Text style={styles.periodTimeSpan}>{date.period === 'morning' ? '10h00 - 13h00' : (date.period === 'afternoon' ? '15h00 - 19h30' : 'A partir das 18h00')}</Text>
                            }
                            {[2, 3, 5].includes(new Date(date.date).getUTCDay()) && <Text style={styles.periodTimeSpan}>{date.period === 'morning' ? '10h00 - 13h00' : (date.period === 'afternoon' ? '15h00 - 19h30' : 'A partir das 18h00')}</Text>}
                            {new Date(date.date).getUTCDay() === 6 && <Text style={styles.periodTimeSpan}>{date.period === 'morning' ? '09h30 - 13h30' : (date.period === 'afternoon' ? '14h00 - 19h00' : 'A partir das 18h00')}</Text>}

                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    )}
                  />)
            }


          </View>
          <Text style={styles.subtitle}>Cupom</Text>
          <View style={styles.cuponContainer}>
            <View style={styles.cuponInputContainer}>
              <TextInput
                style={styles.cuponTextInput}
                placeholder="Ex: 9E4BC4"
                autoCorrect={false}
                maxLength={8}
                value={cupon}
                onChange={e => setCupon(e.nativeEvent.text)}
              />
            </View>
            <TouchableWithoutFeedback onPress={() => validateCupon()}>
              <View style={styles.cuponButtonContainer}>
                {cuponLoading
                  ? <ActivityIndicator size="small" color="#049434" />
                  : <Text style={styles.cuponButtonText}>Validar</Text>
                }
              </View>
            </TouchableWithoutFeedback>
          </View>



          <Text style={styles.subtitle}>Pagamento</Text>
          <View style={styles.paymentContainer}>
            <View style={styles.paymentContent}>
              <View style={styles.paymentPropertyValue} >
                <Text style={styles.paymentTextSubtotal}>Subtotal</Text>
                <Text style={styles.paymentTextSubtotal}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(route.params.subtotal))}</Text>
              </View>
              <TouchableWithoutFeedback onPress={() => setShowDeliveryFeeModal(true)} >
                <View style={styles.paymentPropertyValue} >
                  <View style={styles.deliveryFeeTextAndIcon}>
                    <Text style={styles.paymentTextSubtotal}>Taxa de entrega</Text>
                    <Ionicons style={{marginLeft: 8}}name="md-information-circle-outline" size={20} color="#41414b" />
                  </View>
                  {!freeDelivery && <Text style={styles.paymentTextSubtotal}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deliveryFee)}</Text>}
                  {freeDelivery && <Text style={[styles.paymentTextSubtotal, { textDecorationLine: 'line-through' }]}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deliveryFee)}</Text>}
                </View>
              </TouchableWithoutFeedback>

              {!!cuponDiscount && <View style={styles.paymentPropertyValue}>
                <Text style={styles.paymentTextSubtotal}>Cupom de desconto</Text>
                <Text style={styles.paymentTextSubtotal}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(-cuponDiscount)}</Text>
              </View>}
              <View style={styles.paymentPropertyValue} >
                <Text style={styles.paymentTextTotal}>Total</Text>
                <Text style={styles.paymentTextTotal}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(total))}</Text>
              </View>
            </View>
            <View style={styles.paymentInfoSeparator} />
            <Text style={styles.paymentMethodText}>Método de pagamento</Text>
            <FlatList
              ListFooterComponent={<View style={{ marginRight: 10 }} />}
              contentContainerStyle={styles.paymentMethodList}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={method => method}
              data={['Dinheiro', 'Transferência Bancaria', 'Cartão de Crédito', 'Cartão de Débito', 'Voucher Alimentação']}
              renderItem={(method) => (

                <TouchableWithoutFeedback onPress={() => { setPaymentMethod(method.item), handlePaymentMethod(method.item) }} activeOpacity={0.8}>
                  <View style={method.item === paymentMethod ? styles.selectedPaymentMethod : styles.paymentMethod}>
                    <View style={styles.PaymentMethodContainer}>
                      {getIcon(method.item)}
                      <Text style={styles.listPaymentMethodText}>{method.item}</Text>

                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          </View>
          <Text style={styles.subtitle}>Observação sobre entrega</Text>
          <View style={styles.obsContainer}>
            <TextInput
              placeholder="Ex: Interfone não funciona, casa em reforma, casa sem número"
              style={styles.textArea}
              multiline={true}
              textAlignVertical={'top'}
              numberOfLines={4}
              onChangeText={(text) => setObservation(text)}
              value={observation}
            />
          </View>
          <TouchableWithoutFeedback onPress={finalizePurchase}>
            <View style={styles.finalizePurchaseButton}>
              {
                loading
                  ? <ActivityIndicator size="small" color="white" />
                  : <Text style={styles.finalizePurchaseButtonText}>Finalizar Compra</Text>
              }
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAwareScrollView>


    </View >

  );
}