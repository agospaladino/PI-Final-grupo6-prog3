import React, { Component } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CrearPost from '../screens/CrearPost';
import MiPerfil from '../screens/MiPerfil';
import HomeStackNavigator from './HomeStackNavigator';

import { Ionicons } from '@expo/vector-icons';
import{ Entypo} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default class TabNavigator extends Component {
  render() {
    return (
      <Tab.Navigator>
         <Tab.Screen name="Home" component={HomeStackNavigator} options={ { headerShown: false, tabBarIcon: () => <Entypo name="home" size={24} color="black" />}} />
         <Tab.Screen name="CrearPost" component={CrearPost} options={ { headerShown: false, tabBarIcon: () => <Ionicons name="create-outline" size={24} color="black" /> } }/>
         <Tab.Screen name="MiPerfil" component={MiPerfil} options={ { headerShown: false, tabBarIcon: () => <MaterialCommunityIcons name="face-woman-profile" size={24} color="black" />}}/>
      </Tab.Navigator>
    )
  }
}
