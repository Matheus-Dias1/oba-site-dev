import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container:{
        flex: 1,
    },
    helloContainer:{
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 15

    },
    helloText:{
        fontSize: 30,
        fontWeight: '500'
    },
    optionContainer:{
        marginTop: 20,
        marginHorizontal: 20,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    optionText:{
        marginLeft: 15,
        color: '#737380',
        fontSize: 20,
        fontWeight: '400'
    },
    textIconView:{
        flexDirection: "row",
        alignItems: 'center'
    },
    arrowButton:{
        marginBottom: -6
    },
    logoutText:{
        marginLeft: 15,
        color: '#B22222',
        fontSize: 20,
        fontWeight: '400',
    }
});