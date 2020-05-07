import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container:{
        flex: 1
    },
    purchaseContainer:{
        marginHorizontal: 15,

        marginTop: 20,
        borderRadius: 8,
        backgroundColor: '#049434',
        borderColor: 'lightgray',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    contentContainer:{
        backgroundColor: 'white',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
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
    loadingContainer:{
        width: 70,
        height: 70,
        backgroundColor:'#ccc',
        borderRadius: 12,
        opacity: 0.7,
        position: 'absolute',
        right: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        top: '20%',
    },

});