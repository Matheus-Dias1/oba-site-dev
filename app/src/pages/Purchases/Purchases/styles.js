import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container:{
        flex: 1
    },
    purchasesList:{
        marginHorizontal: 15,
    },
    purchaseContainer:{
        backgroundColor: 'white',
        marginTop: 15,
        borderRadius: 8,
        backgroundColor: '#049434',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    contentContainer:{
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    content:{
        marginHorizontal: 15,
        marginBottom: 10,
        marginTop: 8,
        backgroundColor: 'white'
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