import { StyleSheet } from 'react-native';


export default StyleSheet.create({

    container: {
        flex: 1,
    },
    // header: {
    //     backgroundColor: '#049434',
    //     paddingBottom: 28,
    //     paddingLeft: 25
    // },
    // title: {
    //     fontSize: 35,
    //     fontWeight: 'bold',
    //     color: 'white'
    // },
    productsList: {
        paddingHorizontal: 12,
        paddingTop: 20,
    },
    product: {
        alignItems: "center",
        flexDirection: "row",
        padding: 5,
        borderRadius: 5,
        marginBottom: 8,
        backgroundColor: '#fff',
        justifyContent:'space-between',
    },
    productInfo: {
        marginLeft: 15,
    },
    productValue: {
        marginTop: 2,
        fontSize: 15,
        fontWeight: '200',
        color: "#737380"
    },
    productProperty: {
        fontSize: 14,
        color: "#41414b",
        fontWeight: "normal"
    },
    productName: {
        fontSize: 16,
        color: "#41414b",
        fontWeight: "800",
        marginBottom: 5,
    },
    productImage: {
        width: 120,
        height: 80,
        borderRadius: 3,
    },
    showCartButton: {
        height: 60,
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: '#049434',
        alignItems: "center",
    },
    showCartText: {
        color: 'white',
        fontWeight: 'bold'
    },
    modalContainer: {
        flex: 0.93,
        backgroundColor: '#f2f2f2',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,

    },
    modal: {
        margin: 0,
        padding: 0,
        justifyContent: 'flex-end',

    },
    cartHeader: {
        flexDirection: 'row',
        margin: 20,
        justifyContent: 'center',
        height: 20
    },
    closeCartIcon: {
        position: 'absolute',
        left: 5,
        top: -5,
    },
    cartHeaderText: {
        fontWeight: '600',
        fontSize: 16
    },
    cartListingNameAndAmout: {
        flexDirection: 'row',
    },
    cartContainer: {
        marginHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',

    },
    cartListingDeleteIcon: {
        marginRight: 15,
    },
    cartListingObservation: {
        fontWeight: '200'
    },
    cartListingProductName: {
        fontWeight: '600'
    },
    cartListing: {
        maxWidth: 280,
    },
    cartListingSeparator: {
        marginVertical: 10,
        backgroundColor: '#41414b',
        opacity: 0.2,
        height: 1,
        marginHorizontal: 20,
    },
    addMoreItensContainer: {
        flexDirection: "row",
        marginTop: -10,
        height: 50,
        alignItems: "center",
        justifyContent: 'center',
    },
    finalizePurchase: {
        alignItems: 'center',
        height: 100,
        backgroundColor: '#049434',
        flexDirection: "row",
        justifyContent: "space-around",
    },
    buyButton: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 30,
    },

});