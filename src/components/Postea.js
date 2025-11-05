import { Text, View, TextInput, Pressable, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import {auth, db} from '../firebase/config'

export default class Postea extends Component {
    constructor(props){
        super(props)
        this.state = {
            post: ''
        }
    }
    postear(texto){
        if(texto !==''){
        db.collection('posts').add({
            owner: auth.currentUser.email,
            createdAt: Date.now(),
            post: texto})
        .then((resp) => this.props.navigation.navigate('Home'))
        .catch((err) => console.log(err))
    }}

  render() {
    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>Hace tu posteo:</Text>
            <View>
            <TextInput
                style={styles.cajaTexto}
                keyboardType="default"
                onChangeText={(post) => this.setState({post: post})}
                value = {this.state.post}
            /> 
            <Pressable
            style={styles.boton}
            onPress={() => this.postear(this.state.post)}
            >
                <Text style={ styles.botonTexto}>Publicar </Text>
            </Pressable>


            </View>

        </View>
    )
  }
}

const styles = StyleSheet.create(
    {
    contenedor: {
        flex: 1,
        padding: 20,
        backgroundColor: "#ffffff",
        justifyContent: 'center',
        alignItems: 'center',
        width: '20%',
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 200

    },
    titulo: {
        fontSize: 18,
        marginBottom: 10
    },
    cajaTexto: {
        height: 120,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        textAlignVertical: "top",
        marginBottom: 15,


    },
    boton: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",

    },
    botonTexto: {
        color: "#fff",
        fontSize: 16
    }
    }
)