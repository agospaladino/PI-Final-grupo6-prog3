import { Text, View, TextInput, Pressable, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import {auth, db} from '../firebase/config'

export default class Postea extends Component {
    constructor(props){
        super(props)
        this.state = {
            post: '',
            usuarioLogueado: null,
            publicando: false,
            error: ''
        }
    }
    componentDidMount(){
        auth.onAuthStateChanged(
            user =>{
                if(user){
                    this.setState({ usuarioLogueado: user })
                } else {
                    this.setState({usuarioLogueado: null})
                }
            }
        )
    }
    postear(texto){
        if(this.state.publicando) {
            return;
        }
        if(texto !== ''){
            if(auth.currentUser){
                this.setState({ publicando: true });
                db.collection('posts').add({
                    owner: auth.currentUser.email,
                    createdAt: Date.now(),
                    post: texto
                })
                .then((resp) => {
                    this.setState({ post: '', publicando: false });
                    this.props.navigation.navigate('Home');
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ publicando: false, error: 'Error al publicar el posteo' });
                })
            } else {
                this.setState({ error: 'Logueate para postear' });
            }
        }
    }

  render() {
    if(this.state.usuarioLogueado === null){
        return(
            <View style={styles.contenedor}>
                <Text style={styles.titulo}>
                    Tenés que iniciar sesión para hacer un posteo.
                </Text>
                <Pressable
                    style={styles.boton}
                    onPress={() => this.props.navigation.navigate('Login')}>
                    <Text style={styles.botonTexto}>Ir a iniciar sesión</Text>
                </Pressable>
            </View>
        )
    }
    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>Hace tu posteo:</Text>
            {this.state.error.length > 0 ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{this.state.error}</Text>
              </View>
            ) : null}
            <View>
            <TextInput
                style={styles.cajaTexto}
                keyboardType="default"
                onChangeText={(post) => this.setState({post: post, error: ''})}
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
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 200,
        width: '100%',        
        maxWidth: 420,        
        minWidth: 260,       
        height: 48,  

    },
    titulo: {
        fontSize: 18,
        marginBottom: 10
    },
    cajaTexto: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        textAlignVertical: "top",
        marginBottom: 15,
        width: '100%',        
        maxWidth: 420,        
        minWidth: 260,       
        height: 48,  


    },
    boton: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        width: '100%',        
        maxWidth: 420,        
        minWidth: 260,       
        height: 48,  

    },
    botonTexto: {
        color: "#fff",
        fontSize: 16
    },
    errorContainer: {
        backgroundColor: '#ff4444',
        padding: 12,
        borderRadius: 6,
        marginBottom: 12,
        width: '100%'
    },
    errorText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center'
    }
    }
)