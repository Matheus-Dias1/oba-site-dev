import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    title: {
        alignSelf: 'center',
        fontSize: 25,
        fontWeight: '500',
        color: '#737380',
        marginBottom: 10
    },
    inputContainer: {
        height: 45,
        marginHorizontal: 0,
        marginTop: 20,
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        justifyContent: 'flex-end'
    },
    focusedInputContainer: {
        height: 45,
        marginHorizontal: 0,
        marginTop: 20,
        borderBottomWidth: 2,
        borderColor: '#049434',
        justifyContent: 'flex-end'
    },
    recoverButton: {
        backgroundColor: '#049434',
        borderRadius: 8,
        height: 45,
        width: 260,
        marginHorizontal: 0,
        marginTop: 40,
        borderWidth: 1,
        borderColor: '#049434',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30
    },
    textInput: {
        marginHorizontal: 2,
        marginVertical: 2,
        fontSize: 18,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    content: {
        marginHorizontal: 25
    },
    bodyText: {
        marginTop: 20,
        color: '#737380',
        fontSize: 17,
        fontWeight: '300',
        textAlign: 'justify'
    },
});