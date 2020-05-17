import * as React from 'react';
import { AsyncStorage, Alert } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import AuthContext from './authcontext';
import api from './services/api';

import Products from './pages/ProductsTab/Products';
import ProductDetails from './pages/ProductsTab/ProductDetails';
import FinalizePurchase from './pages/ProductsTab/FinalizePurchase';
import Purchases from './pages/Purchases/Purchases';
import PurchaseDetails from './pages/Purchases/PurchaseDetails';
import Profile from './pages/Profile/Profile';
import EditInfo from './pages/Profile/EditInfo';
import Help from './pages/Profile/Help';
import Addresses from './pages/Profile/Addresses';
import GetLocationFromMap from './pages/Profile/GetLocationFromMap';
import AddAddress from './pages/Profile/AddAddress';
import Login from './pages/Login/Login'
import Register from './pages/Login/Register'
import ForgotPassword from './pages/Login/ForgotPassword'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ProductsTab() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: 'Voltar',
      }}>
      <Stack.Screen
        name="Products"
        component={Products}
        options={{
          title: "Produtos",
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: 'white',
          },
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          title: "",
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#f2f2f2',
          },
        }}
      />
      <Stack.Screen
        name="FinalizePurchase"
        component={FinalizePurchase}
        options={{
          title: "",
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#f2f2f2',
            borderEndWidth: 0
          },
        }}
      />

    </Stack.Navigator>
  );
}

function ProfileTab() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          title: "Perfil"
        }}
      />
      <Stack.Screen
        name="EditInfo"
        component={EditInfo}
        options={{
          title: "",
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#f2f2f2',
          },
        }}
      />
      <Stack.Screen
        name="Help"
        component={Help}
        options={{
          title: "Ajuda",
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#f2f2f2',
            borderEndWidth: 0
          },
        }}
      />
      <Stack.Screen
        name="Addresses"
        component={Addresses}
        options={{
          title: "Endereços",
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#f2f2f2',
            borderEndWidth: 0
          },
        }}
      />
      <Stack.Screen
        name="GetLocationFromMap"
        component={GetLocationFromMap}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AddAddress"
        component={AddAddress}
        options={{
          title: "Adicionar Endereço",
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#f2f2f2',
            borderEndWidth: 0
          },
        }}
      />

    </Stack.Navigator>
  );
}
function PurchaseTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Purchases"
        component={Purchases}
        options={{
          title: "Pedidos",
          headerStyle: {
            backgroundColor: 'white',
          },
        }}
      />
      <Stack.Screen
        name="PurchaseDetails"
        component={PurchaseDetails}
        options={{
          title: "",
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#f2f2f2',
          },
        }}
      />

    </Stack.Navigator>
  );
}


export default function Routes() {

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('accessToken');
      } catch (e) {
        signOut();
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        try {
          const res = await api.post('session', {
            'email': data.email.replace(/^\s+|\s+$/g, ''),
            'password': data.password
          })
          AsyncStorage.setItem('accessToken', res.data.accessToken)
          AsyncStorage.setItem('name', res.data.name);
          dispatch({ type: 'SIGN_IN', token: res.data.accessToken });
        } catch (err) {
          if (err.response.status === 400)
            Alert.alert(err.response.data.error)
          else
            Alert.alert('Falha no login', 'Erro ao fazer login, tente novamente mais tarde.');
        }
      },
      signOut: async () => {
        AsyncStorage.clear();
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken == null ? (
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}>
            <Stack.Screen
              name="Login"
              component={Login}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
            />
            <Stack.Screen
              name="Register"
              component={Register}
            />

          </Stack.Navigator>
        ) : (
            <Tab.Navigator
              initialRouteName="Produtos"
              backBehavior="history"
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  let style;

                  if (route.name === 'Produtos') {
                    iconName = 'store-alt';
                    style = 'light'
                  } else if (route.name === 'Pedidos') {
                    iconName = 'clipboard';
                    style = focused ? 'solid' : 'light'
                  } else if (route.name === 'Perfil') {
                    iconName = 'user';
                    style = focused ? 'solid' : 'light'


                  }
                  if (style === 'solid')
                    return <FontAwesome5 name={iconName} size={size} color={color} solid />;
                  else
                    return <FontAwesome5 name={iconName} size={size} color={color} light />;

                },
              })}
              tabBarOptions={{
                activeTintColor: '#049434',
                inactiveTintColor: 'gray',
                keyboardHidesTabBar: true
              }}
            >
              <Tab.Screen name="Produtos" component={ProductsTab} />
              <Tab.Screen name="Pedidos" component={PurchaseTab} />
              <Tab.Screen name="Perfil"component={ProfileTab} />
            </Tab.Navigator>
          )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
