import { Text, View, TextInput, Pressable, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../firebase/config'

export default class ComentarPost extends Component {
  constructor(props) {
    super(props);
    const { post } = this.props.route.params;
    this.state = {
      postId: post.id,
      post: post,
      comentario: '',
      comentarios: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getComentarios();
  }

  getComentarios() {
    db.collection('comentarios')
      .where('postId', '==', this.state.postId)
      .orderBy('createdAt', 'desc')
      .onSnapshot((docs) => {
        const comentarios = docs.docs.map((doc) => {
          return {
            id: doc.id,
            texto: doc.data().texto || '',
            owner: doc.data().owner || ''
          };
        });
        this.setState({ comentarios, loading: false });
      });
  }

  publicarComentario() {
    if (this.state.comentario.trim() !== '') {
      const user = auth.currentUser;
      if (user) {
        db.collection('comentarios').add({
          postId: this.state.postId,
          texto: this.state.comentario,
          owner: user.email,
          createdAt: Date.now()
        })
        .then(() => {
          this.setState({ comentario: '' });
        })
        .catch((error) => {
          console.log('Error al publicar comentario:', error);
          alert('Error al publicar comentario');
        });
      }
    }
  }

  render() {
    const { post, comentarios, comentario, loading } = this.state;

    return (
      <View style={styles.pantalla} >
        <View style={styles.card}>
          <Text style={styles.postOwner}>
            {post.owner || 'Usuario'} posteó
          </Text>
          <Text style={styles.postTexto}>{post.post || 'Sin contenido'}</Text>
        </View>

        <View style={styles.comentariosContainer}>
          <Text style={styles.comentariosTitulo}>Comentarios</Text>
          
          {loading ? (
            <Text style={styles.cargando}>Cargando comentarios...</Text>
          ) : comentarios.length === 0 ? (
            <Text style={styles.cargando}>No hay comentarios todavía</Text>
          ) : (
            <View>
              {comentarios.map((comentario) => {
                return (
                  <View key={comentario.id}  style={styles.comentarioItem}>
                    <Text style={styles.comentarioOwner}>{comentario.owner || 'Usuario'}</Text>
                    <Text style={styles.comentarioTexto}>{comentario.texto}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.formComentario}>
          <TextInput
            style={styles.inputComentario}
            placeholder="Comenta aquí tu post..."
            onChangeText={(text) => this.setState({ comentario: text })}
            value={comentario}
            multiline
          />
          <Pressable
            style={styles.boton}
            onPress={() => this.publicarComentario()}
          >
            <Text style={styles.botonTexto}>Publicar comentario</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles= StyleSheet.create({
  pantalla:{
    flex: 1,
    backgroundColor: '#f4f4f4',   
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 10,
    width: '80%',
    maxWidth: 500
  },
  postOwner: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  postTexto: {
    fontSize: 15,
    textAlign: 'center',
  },
  comentariosContainer: {
    width: '80%',
    maxWidth: 500,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20
  },
  comentariosTitulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cargando: {
    fontSize: 14,
    color: '#666',
  },
  comentarioItem: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    paddingBottom: 8,
  },
  comentarioOwner: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  comentarioTexto: {
    fontSize: 14,
  },
  formComentario: {
    width: '80%',
    maxWidth: 500,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
  },
  inputComentario: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  boton: {
    backgroundColor: '#007AFF',   
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  }



});
