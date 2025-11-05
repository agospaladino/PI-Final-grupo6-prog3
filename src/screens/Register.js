import React, { Component } from 'react';
import { Text, View, TextInput, Pressable, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/config';

export default class Register extends Component {
    constructor(props){
    super(props)
    this.state ={
      username: '',
      password: '',
      email: '',
      nombre: ''
        }
    }
    submit(nombre, email, password){
    console.log("creando usuario", {nombre, email, password})
    if(
      nombre.length > 3 &&
      email.includes('@') &&
      password.length > 5
      
    ) {
      auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        db.collection('users').add({
                    nombre: nombre,
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
        <View style = {styles.container}>
            <Text style = {styles.title} >Crea tu usuario: </Text>
            <Text> Nombre de usuario: </Text>
            <TextInput 
                keyboardType='default'
                onChangeText={(text) => this.setState({nombre: text})}
                value={this.state.nombre}
                style = {styles.input}
                />
            <Text>Email: </Text>
            <TextInput 
                keyboardType='default' 
                onChangeText={(text) => this.setState({email: text})}
                value={this.state.email}
                style = {styles.input}
                />
            <Text>Password: </Text>
            <TextInput 
                keyboardType='default'
                onChangeText={(text) => this.setState({password: text})}
                value={this.state.password}
                secureTextEntry= {true}
                style = {styles.input}
                />
            <Pressable
            onPress={() => this.submit(this.state.nombre, this.state.email, this.state.password)}
            style = {styles.button}
            >
            <Text style = {styles.textoBoton} > Enviar registro</Text>
            </Pressable>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 20,
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '20%',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5
  },
  textoBoton: {
    color: 'white'
  }
});