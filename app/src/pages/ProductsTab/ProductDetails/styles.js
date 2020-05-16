import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        alignItems: "center",
        justifyContent: 'space-between'
    },
    imageContainer: {
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 8,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,

    },
    textArea:{
        width: '88%',
        height: 160,
        marginHorizontal: 20,
        marginVertical: 10,
    },  
    image: {
        resizeMode: 'stretch',
        width: '100%',
        aspectRatio: 13/7,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 10,
        marginHorizontal: 5,
    },
    productDescription: {
        color: '#737380',
        marginTop: 5,
        marginBottom: 15,
        marginHorizontal: 5,
    },
    amountContainer: {
        marginTop: 15,
        backgroundColor: "white",
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        elevation: 1,
        shadowRadius: 2,
    },
    measurementUnit: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 50
    },
    intValueCounterContainer: {
        width: 80,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center"
    },
    AmountInputStyle: {
        width: 80,
        height: 25,
        textAlign: 'center'
    },
    obsContainer:{
        backgroundColor: 'white',
        borderRadius: 8,
        marginTop: 15,
        minHeight: 180,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    addToCartButton:{
        height: 55,
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: '#049434',
        alignItems: "center",
    },
    addToCartText:{
        color: 'white',
        fontSize: 17,
        fontWeight: '600'
    },
    loadingContainer: {
        width: 70,
        height: 70,
        backgroundColor: '#ccc',
        borderRadius: 12,
        opacity: 0.7,
        position: 'absolute',
        right: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        top: '45%',
    },
});