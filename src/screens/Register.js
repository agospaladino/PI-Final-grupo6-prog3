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
      nombre: '',
      error: ''
        }
    }
    submit(nombre, email, password){
      const errores = []
    console.log("creando usuario", {nombre, email, password})
    if(nombre.length <= 3){
      errores.push("El nombre de usuario tiene que tener mas de tres caracteres")

    }
    if(!email.includes('@')){
      errores.push("El mail ingresado no es valido")

    }
    if(password.length <= 5){
      errores.push("La password tiene que tener mas de cinco caracteres")
      return;
    }

    if(errores.length > 0){
      this.setState({error: errores})
    }
      auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        return db.collection('users').add({
          username: nombre,
          owner: email,
          createdAt: Date.now()
        })
      })
      .then(() => {
        console.log('Usuario guardado correctamente');
        this.setState({ error: ''})
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        console.log('Error al registrar:', error);
      })
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
                keyboardType='email-address'
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

            <Pressable onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={styles.textlink}>Ya tengo cuenta</Text>
            </Pressable>
            {this.state.error.length > 0 ?
            (
              this.state.error.map((error, i) => (
                <Text key={i} style={styles.error}> {error} </Text>
              ))
            ) : null }
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
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    width: '100%',        
    maxWidth: 420,        
    minWidth: 260,       
    height: 48,  
  },
  button: {
    backgroundColor: 'black',
    width: '100%',      
    maxWidth: 420,       
    minWidth: 260,       
    height: 48, 
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white'
  },
  textlink: {
    fontWeight: '450',
    color: '#000',
    fontSize: 15,
    marginTop: 10
  },
  error: {
    color: 'red'
  }

});