import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        alignItems: "center",
    },
    imageContainer: {
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 8,
        width: 325,

    },
    textArea:{
        width: 285,
        height: 150,
        marginHorizontal: 20,
        marginVertical: 10,
    },  
    image: {
        resizeMode: 'stretch',
        width: 325,
        height: 175,
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
        width: 325,
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
        alignItems: 'center'
    },
    addToCartButton:{
        width: 325,
        height: 60,
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: '#049434',
        alignItems: "center",
        borderRadius: 8,
        marginTop: 15,
        marginBottom: 20,
    },
    addToCartText:{
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
});