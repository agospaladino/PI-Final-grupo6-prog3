import React, { Component } from 'react';
import { Text, View, TextInput, Pressable, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/config';

export default class Register extends Component {
    constructor(props){
    super(props)
    this.state ={
      username: '',
      password: '',
      email: ''
        }
    }
    submit(email, password){
    console.log("creando usuario", {email, password})
    if(
      email.includes('@') &&
      password.length > 5
      
    ) {
      auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        db.collection('users').add({
                    owner: email,
                    createdAt: Date.now()
                    })
        
    })
      .then(
        this.props.navigation.navigate('Login')
      )
      .catch(() => console.log('Algo se rompio'))
  }
}

  render() {
    return (
        <View>
            <Text>Crea tu usuario: </Text>
            <TextInput 
                keyboardType='default' 
                onChangeText={(text) => this.setState({email: text})}
                value={this.state.email}
                />
            <TextInput 
                keyboardType='numeric'
                onChangeText={(text) => this.setState({password: text})}
                value={this.state.password}
                secureTextEntry= {true}
                />
            <Pressable
            onPress={() => this.submit(this.state.username, this.state.email, this.state.password)}>
            <Text> Enviar registro</Text>
            </Pressable>
        </View>
    )
  }
}
