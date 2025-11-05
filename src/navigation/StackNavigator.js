import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Login';
import Register from '../screens/Register';
import TabNavigator from './TabNavigator';


const Stack = createNativeStackNavigator();

export default function StackNavigator(){
    return(
        <Stack.Navigator>
            <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>            
            <Stack.Screen name='Register' component={Register} options={{headerShown: false}}/>
            <Stack.Screen name='TabNavigator' component={TabNavigator} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}