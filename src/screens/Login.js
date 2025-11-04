import { Pressable, Text, View, StyleSheet, TextInput } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from "../firebase/config"

export default class Login extends Component {
  constructor(props){
    super(props)
    this.state={
      email: '',
      password: '',
    }
  }

  submit(email, password) {

    console.log('Usuario Logeado:', { email, password });
    if(password.length < 5){
        alert('La contraseña debe tener al menos 5 caracteres');
        return;
    }    
     auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      // solo entra acá si las credenciales son correctas
      alert('Inicio de sesión exitoso');
      this.props.navigation.navigate('TabNavigator', { screen: 'Home' });
    })
    .catch((error) => {
      // si el email o la contraseña son incorrectos
     console.log('Error en el inicio de sesión:', error);
      alert('Credenciales incorrectas');
    });
}
  render() {
    return (
        <View style={styles.container}>
        <Text style = {styles.title}>Inciá sesión</Text>
         <TextInput 
                style={styles.input}
                    keyboardType='email-address'
                    placeholder='Email'
                    onChangeText={(text) => this.setState({ email: text })}
                    value={this.state.email}
                />
                 <TextInput 
                   style={styles.input}
                   placeholder="Contraseña"
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({ password: text })}
                    value={this.state.password}
                />
        <Pressable style={styles.button}
          onPress={() =>
            this.props.navigation.navigate("Register")
          }>
          <Text style={styles.buttontext}>Ir al Registro</Text>
        </Pressable>

         <Pressable
        style={styles.button}
        onPress={() => this.submit(this.state.email, this.state.password)}>
        <Text style={styles.buttontext}>Enviar login</Text>
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
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '400', 
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '25%', 
    height: 40,   
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    width: '20%',  
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 8,
    color: "white"
  },
  buttontext: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '400', 
  },
});

