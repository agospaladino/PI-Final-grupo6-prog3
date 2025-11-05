import React, { Component } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import MiPerfil from '../screens/MiPerfil';

const Tab = createBottomTabNavigator();

export default class TabNavigator extends Component {
  render() {
    return (
      <Tab.Navigator>
         <Tab.Screen name="Home" component={Home} options={{ headerShown: false, title: 'Home' }} />
         <Tab.Screen name="MiPerfil" component={MiPerfil} options={{ headerShown: false, title: 'Mi Perfil' }} />
      </Tab.Navigator>
    )
  }
}