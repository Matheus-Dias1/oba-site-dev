import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    addressInfo: {
        margin: 10,
        height: 60,
        width: 200,
        justifyContent: 'space-between'
    },
    subtitle: {
        marginTop: 20,
        marginLeft: 20,
        fontSize: 18,
        fontWeight: '700',
    },
    addAddressButton: {
        alignSelf: 'center',
    },
    addAddressButtonContainer: {
        height: 90,
        width: 90,
        marginHorizontal: 10,
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center'

    },
    addressInfoStreet: {
        textTransform: 'capitalize',
        fontSize: 15,
        fontWeight: '600'
    },
    addressInfoNeighborhood: {
        textTransform: 'capitalize',
        fontSize: 12,
        fontWeight: '400'
    },
    selectedAddress: {
        marginLeft: 10,
        backgroundColor: 'white',
        height: 90,
        width: 220,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#049434'
    },
    address: {
        marginLeft: 10,
        backgroundColor: 'white',
        width: 220,
        height: 90,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'white'

    },
    addressContainer: {
        marginVertical: 10,
        height: 100,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,

    },
    addressesList: {
        alignItems: 'center'
    },
    selectedDate: {
        marginLeft: 10,
        backgroundColor: 'white',
        width: 140,
        height: 80,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#049434',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,

    },
    date: {
        marginLeft: 10,
        backgroundColor: 'white',
        width: 140,
        height: 80,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    dateInfoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 76,
        
    },
    datesList: {
        marginVertical: 15,
    },
    dateInfo: {
        fontWeight: '700',
        marginBottom: 8,
    },
    periodInfo: {
        fontWeight: '500'
    },
    periodTimeSpan: {
        fontWeight: '200',
        fontSize: 12,
    },
    textArea: {
        borderRadius: 8,
        height: 130,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    obsContainer: {
        borderRadius: 8,
        height: 150,
        marginVertical: 15,
        marginHorizontal: 15,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,

    },
    paymentContainer: {
        backgroundColor: 'white',
        marginHorizontal: 15,
        marginVertical: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,

    },
    paymentContent: {
        marginHorizontal: 20,
        marginVertical: 10
    },

    paymentInfoSeparator: {
        marginVertical: 10,
        backgroundColor: '#41414b',
        opacity: 0.2,
        height: 1,
        marginHorizontal: 20,
    },
    paymentPropertyValue: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paymentTextSubtotal: {
        fontSize: 15,
        marginBottom: 5,
        color: '#41414b',
        fontWeight: '300'
    },
    paymentTextTotal: {
        fontSize: 18,
        marginTop: 10,
        fontWeight: '600'
    },
    paymentMethodText: {
        marginLeft: 20,
        marginTop: 5,
        fontSize: 16,
        fontWeight: '500',
        color: '#41414b',
    },
    paymentMethodList: {
        marginVertical: 15
    },
    selectedPaymentMethod: {
        marginLeft: 10,
        backgroundColor: 'white',
        height: 50,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#049434'
    },
    paymentMethod: {
        marginLeft: 10,
        backgroundColor: 'white',
        height: 50,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#f2f2f2',
    },
    PaymentMethodContainer: {
        marginHorizontal: 20,
        height: 46,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    listPaymentMethodText: {
        marginLeft: 15
    },
    modalContainer: {
        flex: 0.8,
        backgroundColor: '#f2f2f2',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,

    },
    modal: {
        margin: 0,
        padding: 0,
        justifyContent: 'flex-end',

    },
    modalContent: {
        margin: 30,
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'space-between'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 30,
    },
    modalPrice: {
        fontSize: 18,
        fontWeight: '700'
    },
    modalButton: {
        height: 40,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 30,
    },
    modalButtonText: {
        fontSize: 15,
        fontWeight: '500'
    },
    changeForInput: {
        height: 60,
        width: 200,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,

    },
    transferModalTitle: {
        fontSize: 18,
        fontWeight: '500',
        alignSelf: 'center'
    },
    transferModalBody: {
        fontSize: 15,
        fontWeight: '400',
        alignSelf: 'baseline',
        textAlign: 'justify'
    },
    transferModalInfoContainer: {
        marginTop: 15,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    transferModalInfoContent: {
        marginHorizontal: 20,
        marginVertical: 15
    },
    transferModalTwoButtonContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 30
    },
    transferModalTwoButton: {
        height: 50,
        width: 120,
        borderRadius: 3,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    transferModalButton: {
        height: 80,
        borderRadius: 3,
        backgroundColor: '#049434',
        alignItems: 'center',
    },
    transferModalButtonText: {
        marginTop: 20,
        color: 'white',
        fontSize: 17,
        fontWeight: '500'
    },
    finalizePurchaseButton:{
        marginHorizontal: 15,
        marginVertical: 20,
        borderRadius: 8,
        height: 65,
        backgroundColor: '#049434',
        alignItems: 'center',
        justifyContent: 'center'
    },
    finalizePurchaseButtonText:{
        color: 'white',
        fontSize: 20,
        fontWeight: '700'
    },
    cuponContainer:{
        marginVertical: 15,
        flexDirection: 'row',
        marginHorizontal: 15,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        height: 45,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    cuponTextInput:{
        marginLeft: 15,
        fontSize: 15,
        width: 150,
        height: 35,
    },
    cuponButtonContainer:{
        height: 30,
        borderLeftColor: 'lightgray',
        borderLeftWidth: 1,
        justifyContent: 'center',
        
    },
    cuponButtonText:{
        fontSize: 15,
        fontWeight: '600',
        marginHorizontal: 15,
        color: '#049434'
    }



});