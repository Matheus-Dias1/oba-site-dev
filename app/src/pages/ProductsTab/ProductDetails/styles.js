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
    },
    addToCartButton:{
        width: '90%',
        height: 60,
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: '#049434',
        alignItems: "center",
        borderRadius: 8,
        marginTop: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    addToCartText:{
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
});