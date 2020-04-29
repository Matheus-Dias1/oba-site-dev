import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    buttonContainer:{
        left: 0,
        right: 0,
        marginLeft: 0,
        marginTop: 0,
        position: 'absolute',
        top: '90%',
        alignItems: 'center',
    },
    button:{
        width: 200,
        height:50,
        backgroundColor: '#049434',
        borderRadius: 27,
        alignItems:'center',
        justifyContent:'center',
    },
    buttonText:{
        color: 'white',
        fontSize: 18,
        fontWeight: '600'
    },
    markerFixed: {
        left: 0,
        right: 0,
        marginLeft: 0,
        marginTop: 0,
        position: 'absolute',
        top: '48.5%',
        alignItems: 'center',
      },
      map:{
          flex:1
      }
});