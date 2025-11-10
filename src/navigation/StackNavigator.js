import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../firebase/config';

import Login from '../screens/Login';
import Register from '../screens/Register';
import TabNavigator from './TabNavigator';
import ComentarPost from '../screens/ComentarPost';

const Stack = createNativeStackNavigator();

export default class StackNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      this.setState({
        loading: false,
        user: user
      });
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text>Cargando...</Text>
        </View>
      );
    }

    return (
      <Stack.Navigator>
        <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
        <Stack.Screen name='Register' component={Register} options={{headerShown: false}}/>
        <Stack.Screen name='TabNavigator' component={TabNavigator} options={{headerShown: false}}/>
        <Stack.Screen name='ComentarPost' component={ComentarPost} options={{headerShown: false}}/>
      </Stack.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});