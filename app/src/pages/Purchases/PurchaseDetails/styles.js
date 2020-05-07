import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container:{
        flex: 1
    },
    content:{
        marginVertical: 15,
        marginHorizontal: 15
    },
    sectionContainer:{
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionContent:{
        marginHorizontal: 15,
        marginVertical: 10
    },
    property:{
        fontSize:15,
        fontWeight: '500',
        marginBottom: 3,
        color: '#41414b'
    },
    value:{
        fontWeight: '300'
    },
    cartListingObservation: {
        fontWeight: '200'
    },
    cartListingProductName: {
        fontWeight: '600'
    },
    itemsTitleText:{
        marginBottom: 5,
        color: '#41414b',
        fontSize: 16,
        fontWeight: '700'
    },
    loadingContainer:{
        height: 150,
        justifyContent: 'center'
    }

});