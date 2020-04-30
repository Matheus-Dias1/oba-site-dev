import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container: {
        alignItems: 'center',
        flexGrow:1,
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
        marginHorizontal: 40,
        marginTop: 35,
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderColor: 'lightgray',
    },
    focusedInputContainer: {
        marginHorizontal: 40,
        marginTop: 35,
        alignSelf: 'stretch',
        borderBottomWidth: 2,
        borderColor: '#049434',
    },
    addAddressButton: {
        backgroundColor: '#049434',
        borderRadius: 18,
        height: 45,
        marginHorizontal: 65,
        alignSelf: 'stretch',
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
        marginHorizontal: 2,
        marginVertical: 2,
        fontSize: 17
    },
    inputGroup:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    group1InputContainer:{
        marginLeft: 40,
        marginTop: 35,
        flex: 1,
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderColor: 'lightgray',
    },
    focusedGroup1InputContainer:{
        marginLeft: 40,
        marginTop: 35,
        flex: 1,
        alignSelf: 'stretch',
        borderBottomWidth: 2,
        borderColor: '#049434',
    },
    group2InputContainer:{
        marginRight: 40,
        marginLeft: 10,
        marginTop: 35,
        width: 65,
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderColor: 'lightgray',
    },
    focusedGroup2InputContainer:{
        marginRight: 40,
        marginLeft: 10,
        marginTop: 35,
        width: 65,
        alignSelf: 'stretch',
        borderBottomWidth: 2,
        borderColor: '#049434',
    },


});