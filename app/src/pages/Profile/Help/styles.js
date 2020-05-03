import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'space-between'
    },
    content:{
        marginHorizontal: 25,
        marginTop: 20
    },
    bodyText:{
        textAlign: 'justify',
        fontSize: 16,
        fontWeight: '400',
        color: '#41414b',
        marginBottom: 25
    },
    property:{
        fontSize: 16,
        fontWeight: '700',
        marginTop: 10,
    },
    value:{
        fontWeight: '300'
    },
    buttonsContainer:{
        marginBottom: 25,
        flexDirection: 'row',
        marginHorizontal: 25,
        justifyContent: 'space-between',
        backgroundColor: '#049434',
        borderRadius: 8,
        height: 50
    },
    buttonContainer:{
        width: '33%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleButton:{
        borderRightColor: 'white',
        borderLeftColor: 'white',
        borderLeftWidth: 1,
        borderRightWidth: 1
    }


});