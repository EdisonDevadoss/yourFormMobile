import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/secure/home';
import UserScreen from '../screens/secure/user';
import SettingScreen from '../screens/secure/setting';
import ChatScreen from '../screens/secure/chat'
import HomeTab from './tab/Tab';

const HomeStack = createStackNavigator();

function SecuredRootStack() {
  return (
    <HomeStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="HomeTab">
      <HomeStack.Screen name="HomeTab" component={HomeTab} />
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="User" component={UserScreen} />
      <HomeStack.Screen name="Setting" component={SettingScreen} />
      <HomeStack.Screen name="ChatScreen" component={ChatScreen} />
    </HomeStack.Navigator>
  );
}
export default SecuredRootStack;
