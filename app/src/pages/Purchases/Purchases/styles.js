import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container:{
        flex: 1
    },
    purchasesList:{
        marginHorizontal: 15,
    },
    purchaseContainer:{
        marginTop: 20,
        borderRadius: 8,
        backgroundColor: '#049434',

    },
    contentContainer:{
        backgroundColor: '#f8fff5',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    content:{
        marginHorizontal: 15,
        marginBottom: 10,
        marginTop: 8,
        backgroundColor: '#f8fff5'
    },
    property:{
        marginTop: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#41414b'
    },
    value:{
        fontWeight: '300',
        color: '#41414b'
    },
    priceProperty:{
        marginHorizontal: 15,
        marginBottom: 8,

        fontWeight:'700',
        color: 'white',
        fontSize:16
    },
    priceValue:{
        color: 'white'
    },

});