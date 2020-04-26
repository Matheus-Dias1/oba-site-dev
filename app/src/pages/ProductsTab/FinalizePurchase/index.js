import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Modal from 'react-native-modal';
import * as MailComposer from 'expo-mail-composer';

import {
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableWithoutFeedback,
  TextInput,
  Linking,
  ScrollView,
} from 'react-native';



import styles from './styles';


export default function FinalizePurchase() {
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [changeFor, setChangeFor] = useState('R$ ');
  const [selectedDate, setSelectedDate] = useState('');
  const [observation, setObservation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);


  function navigateToNewAddress() {
    alert('new address');
  }

  function handlePaymentMethod(method) {
    if (method === 'Dinheiro')
      setShowChangeModal(true);
    else if (method === 'Transferência Bancaria')
      setShowTransferModal(true);
  }



  function paymentMethodGetIcon(str) {
    if (str === 'Dinheiro')
      return 'md-cash'
    else if (str === 'Cartão de Crédito' || str === 'Cartão de Débito')
      return 'md-card'
    else if (str === 'Transferência Bancaria')
      return 'md-swap'
  }


  function verifyChange(needsChange) {
    if (needsChange) {

    } else {
      setChangeFor('R$ ');
    }
    setShowChangeModal(false);
  }

  function sendEmail() {
    MailComposer.composeAsync({
      subject: 'Envio de Comprovante',
      recipients: ['obahortifruti20@gmail.com']
    })
  }

  function sendWhatsAppMessage() {
    Linking.openURL('whatsapp://send?phone=553497762094')
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
            <Text style={styles.modalPrice}>Total: R$ 60,00</Text>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.modalTitle}>Troco para</Text>
              <TextInput
                autoFocus={true}
                caretHidden={true}
                autoCompleteType="off"
                style={styles.changeForInput}
                keyboardType={'numeric'}
                value={changeFor}
                onChange={e => { if (e.nativeEvent.text === 'R$' || e.nativeEvent.text === '' || e.nativeEvent.text === 'R') { setChangeFor('R$ ') } else { setChangeFor(e.nativeEvent.text) } }}
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
                  <Text style={styles.transferModalBody}>Transfira a quantia ({'R$ 60,00'}) para uma das contas abaixo. Envie o comprovante da transferência para nosso WhatsApp ou para nosso e-mail.</Text>
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
        <StatusBar barStyle="dark-content" />
        <Text style={styles.subtitle}>Endereço de entrega</Text>
        <View style={styles.addressContainer}>
          <FlatList
            ListFooterComponent={listFooter}
            contentContainerStyle={styles.addressesList}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={address => String(address)}
            data={[0, 1]}
            renderItem={(address) => (

              <TouchableWithoutFeedback onPress={() => setSelectedAddress(address.item)} activeOpacity={0.8}>
                <View style={address.item === selectedAddress ? styles.selectedAddress : styles.address}>
                  <View style={styles.addressInfo}>
                    <Text style={styles.addressInfoStreet}>Av Morum Bernardino, 250</Text>
                    <Text style={styles.addressInfoNeighborhood}>Presidente Roosevelt</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>
        <Text style={styles.subtitle}>Data e período de entrega</Text>
        <View style={styles.dateContainer}>
          <FlatList
            ListFooterComponent={<View style={{ marginRight: 10 }} />}
            contentContainerStyle={styles.datesList}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={date => date}
            data={['20/04/2020', '21/04/2020', '22/04/2020', '23/04/2020', '24/04/2020',]}
            renderItem={(date) => (

              <TouchableWithoutFeedback onPress={() => setSelectedDate(date.item)} activeOpacity={0.8}>
                <View style={date.item === selectedDate ? styles.selectedDate : styles.date}>
                  <View style={styles.dateInfoContainer}>
                    <Text style={styles.dateInfo}>{date.item}</Text>
                    <Text style={styles.periodInfo}>Manhã</Text>
                    <Text style={styles.periodTimeSpan}>09h00 - 12h30</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
          />

          <Text style={styles.subtitle}>Observação sobre entrega</Text>
          <View style={styles.obsContainer}>
            <TextInput
              placeholder="Ex: Interfone não funciona, casa em reforma, casa sem número"
              style={styles.textArea}
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => setObservation(text)}
              value={observation}
            />
          </View>

          <Text style={styles.subtitle}>Pagamento</Text>
          <View style={styles.paymentContainer}>
            <View style={styles.paymentContent}>
              <View style={styles.paymentPropertyValue} >
                <Text style={styles.paymentTextSubtotal}>Subtotal</Text>
                <Text style={styles.paymentTextSubtotal}>R$ 52,00</Text>
              </View>
              <View style={styles.paymentPropertyValue} >
                <Text style={styles.paymentTextSubtotal}>Taxa de entrega</Text>
                <Text style={styles.paymentTextSubtotal}>R$ 8,00</Text>
              </View>
              <View style={styles.paymentPropertyValue} >
                <Text style={styles.paymentTextTotal}>Total</Text>
                <Text style={styles.paymentTextTotal}>R$ 60,00</Text>
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
              data={['Dinheiro', 'Transferência Bancaria', 'Cartão de Crédito', 'Cartão de Débito',]}
              renderItem={(method) => (

                <TouchableWithoutFeedback onPress={() => { setPaymentMethod(method.item), handlePaymentMethod(method.item) }} activeOpacity={0.8}>
                  <View style={method.item === paymentMethod ? styles.selectedPaymentMethod : styles.paymentMethod}>
                    <View style={styles.PaymentMethodContainer}>
                      <Ionicons name={paymentMethodGetIcon(method.item)} size={30} color={'green'} />
                      <Text style={styles.listPaymentMethodText}>{method.item}</Text>

                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          </View>

        </View>
        <TouchableWithoutFeedback>
          <View style={styles.finalizePurchaseButton}>
            <Text style={styles.finalizePurchaseButtonText}>Finalizar Compra</Text>
          </View>
        </TouchableWithoutFeedback>

      </KeyboardAwareScrollView>

    </View >

  );
}