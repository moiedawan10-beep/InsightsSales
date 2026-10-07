import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/login';
import Dashboard from './src/screens/Dashboard';
import Splash from './src/screens/Splash';
import { StatusBar } from 'react-native';
import Theme from './src/constants/Theme';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Orientation from 'react-native-orientation-locker';

const Stack = createNativeStackNavigator();

export default function App() {
  Orientation.lockToPortrait();

  return (
    <Provider store={store}>
      <PaperProvider>
        <StatusBar
          hidden={false}
          animated={true}
          backgroundColor={Theme.COLORS.StatusBarVariant}
        />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="splash" component={Splash} />
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
