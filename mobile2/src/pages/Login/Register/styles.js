import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container: {
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    logo: {
        width: 200,
        height: 75,
        resizeMode: 'center',
        alignSelf: 'center'
    },
    title: {
        alignSelf: 'center',
        marginTop: 40,
        fontSize: 25,
        fontWeight: '500',
        color: '#737380',
        marginBottom: 10
    },
    inputContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        height: 45,
        width: 260,
        marginHorizontal: 0,
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'lightgray'
    },
    registerButton: {
        backgroundColor: '#049434',
        borderRadius: 18,
        height: 45,
        width: 260,
        marginHorizontal: 0,
        marginTop: 40,
        borderWidth: 1,
        borderColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500'
    },
    textInput: {
        marginHorizontal: 15,
        marginVertical: 12,
        fontSize: 18
    },
    errorTextContainer:{
        backgroundColor: '#cf0638',
        borderRadius: 3,
    },
    errorText:{
        marginHorizontal: 4,
        marginVertical: 5,
        color: 'white',
        fontSize: 15,
        fontWeight: '400',
        textAlign:'center'

    }

});