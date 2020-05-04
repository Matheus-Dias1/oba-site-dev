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
        borderColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,
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
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    content: {
        marginHorizontal: 15,
        marginVertical: 10,
        maxWidth: '75%'
    },
    streetText: {
        textTransform: 'capitalize',
        fontSize: 17,
        fontWeight: '600',
        flexWrap: 'wrap'
    },
    neighborhoodText: {
        textTransform: 'capitalize',
        marginTop: 14,
        fontSize: 15,
        fontWeight: '300',
        color: '#737380',
        flexWrap: 'wrap'
    },
    cityText: {
        textTransform: 'capitalize',
        marginTop: 3,
        fontSize: 13,
        fontWeight: '800',
        color: '#737380',
        flexWrap: 'wrap'

    },
    addressDeleteIcon: {
        marginRight: 15
    },
    stateText:{
        textTransform: 'uppercase',
        flexWrap: 'wrap',
    },
    removeAddressContainer:{
        width: '15%',
        height: 45,
        alignItems: 'flex-end',
        justifyContent:'center' 
    }


});