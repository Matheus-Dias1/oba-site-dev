import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('screen').width

export default StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',

    },
    inputContainer: {
        marginHorizontal: 20,
        marginTop: 35,
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        width: width * 0.90
    },
    focusedInputContainer: {
        marginHorizontal: 20,
        marginTop: 35,
        alignSelf: 'stretch',
        borderBottomWidth: 2,
        borderColor: '#049434',
    },
    addAddressButton: {
        flexDirection: 'row',
        backgroundColor: '#049434',
        borderRadius: 8,
        height: 45,
        marginHorizontal: 20,
        alignSelf: 'stretch',
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
        fontSize: 17
    },
    inputGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    group1InputContainer: {
        marginLeft: 20,
        marginTop: 35,
        flex: 1,
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderColor: 'lightgray',
    },
    focusedGroup1InputContainer: {
        marginLeft: 20,
        marginTop: 35,
        flex: 1,
        alignSelf: 'stretch',
        borderBottomWidth: 2,
        borderColor: '#049434',
    },
    group2InputContainer: {
        marginRight: 20,
        marginLeft: 10,
        marginTop: 35,
        width: 65,
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderColor: 'lightgray',
    },
    focusedGroup2InputContainer: {
        marginRight: 20,
        marginLeft: 10,
        marginTop: 35,
        width: 65,
        alignSelf: 'stretch',
        borderBottomWidth: 2,
        borderColor: '#049434',
    },
    infoActivityIndicatorContainer:{
        position: 'absolute',
        bottom: 4,
        right: 10
    }

});