import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
    },
    content:{
        flex: 1,
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
        height: 45,
        width: 260,
        marginHorizontal: 0,
        marginTop: 10,
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        justifyContent:'flex-end'
    },
    focusedInputContainer: {
        height: 45,
        width: 260,
        marginHorizontal: 0,
        marginTop: 10,
        borderBottomWidth: 2,
        borderColor: '#049434',
        justifyContent:'flex-end'
    },
    editProfileButton: {
        flexDirection: 'row',
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
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
    textInput: {
        marginHorizontal: 2,
        marginVertical: 2,
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

    },
    changePasswordContainer:{
        marginTop: 25,
        height: 40,
        justifyContent: 'center'
    },
    changePasswordText:{
        fontSize: 17,
        fontWeight: '600',
    },
    loadingInfoIndicator:{
        position: 'absolute',
        right: 10,
        bottom: 4
    }

});