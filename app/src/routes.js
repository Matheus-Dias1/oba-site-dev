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
import Purchases from './pages/Purchases';
import Profile from './pages/Profile/Profile';
import Login from './pages/Login/Login'
import Register from './pages/Login/Register'
import ForgotPassword from './pages/Login/ForgotPassword'
import { set } from 'react-native-reanimated';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ProductsTab() {
  return (
    <Stack.Navigator>
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
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('accessToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        try {
          const res = await api.post('session', {
            'email': data.email,
            'password': data.password
          })
          AsyncStorage.setItem('accessToken', res.data.accessToken)
          dispatch({ type: 'SIGN_IN', token: res.data.accessToken });
        } catch (err) {
          if (err.response.status === 400)
            Alert.alert(err.response.data.error)
          else
            Alert.alert('Falha no login','Erro ao fazer login, tente novamente mais tarde.');
        }
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
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
              }}
            >
              <Tab.Screen name="Produtos" component={ProductsTab} />
              <Tab.Screen name="Pedidos" component={Purchases} />
              <Tab.Screen name="Perfil" component={Profile} />
            </Tab.Navigator>
          )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
