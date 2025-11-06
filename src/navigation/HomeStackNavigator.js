import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/Home';
import ComentarPost from '../screens/ComentarPost';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="ComentarPost" component={ComentarPost} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

