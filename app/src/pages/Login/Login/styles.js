import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        backgroundColor: '#f2f2f2'
    },

    logo: {
        width: 200,
        height: 75,
        resizeMode: 'center',
        alignSelf: 'center'
    },
    loginText: {
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
        marginTop: 5,
        borderWidth: 1,
        borderColor: 'lightgray'
    },
    TextInput: {
        marginHorizontal: 15,
        marginVertical: 12,
        fontSize: 18
    },
    loginButton: {
        backgroundColor: '#049434',
        borderRadius: 18,
        height: 45,
        width: 260,
        marginHorizontal: 0,
        marginTop: 20,
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
    navigateText: {
        marginLeft: 5,
        fontSize: 16,
        fontWeight: '300',
        color: '#737380'
    },
    navigateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 3,
        height: 30
    },
});