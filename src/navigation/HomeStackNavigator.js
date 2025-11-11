import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import ComentarPost from '../screens/ComentarPost';

const Stack = createNativeStackNavigator();

export default class HomeStackNavigator extends Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="ComentarPost" component={ComentarPost} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
}

