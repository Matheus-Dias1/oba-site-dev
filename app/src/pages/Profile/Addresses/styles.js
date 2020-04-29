import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container: {
        flex: 1
    },
    addAddressContainer: {
        backgroundColor: '#049434',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
    },
    addAddressText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
        marginLeft: 17,
        marginVertical: 17,
    },
    addressContainer: {
        backgroundColor: 'white',
        marginTop: 10,
        marginHorizontal: 15,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#f2f2f2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    selectedAddressContainer: {
        backgroundColor: 'white',
        marginTop: 10,
        marginHorizontal: 15,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#049434',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    content: {
        marginHorizontal: 15,
        marginVertical: 10,
    },
    streetText: {
        fontSize: 17,
        fontWeight: '600',
    },
    neighborhoodText: {
        marginTop: 14,
        fontSize: 15,
        fontWeight: '300',
        color: '#737380'
    },
    cityText: {
        marginTop: 3,
        fontSize: 13,
        fontWeight: '800',
        color: '#737380'

    },
    addressDeleteIcon: {
        marginRight: 15
    },


});