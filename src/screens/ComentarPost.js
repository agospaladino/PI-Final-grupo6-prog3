import { Text, View, TextInput, Pressable, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../firebase/config'

export default class ComentarPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.route.params.postId,
      post: this.props.route.params.post,
      comentario: '',
      comentarios: [],
      loading: true,
      error: ''
    };
  }

  componentDidMount() {
    this.getComentarios();
  }

  getComentarios() {
    db.collection('comentarios')
      .where('postId', '==', this.state.postId)
      .onSnapshot((docs) => {
        const comentarios = [];
        docs.docs.forEach((doc) => {
          comentarios.push({
            id: doc.id,
            texto: doc.data().texto || '',
            owner: doc.data().owner || '',
            createdAt: doc.data().createdAt || 0
          });
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
          this.setState({ error: 'Error al publicar comentario' });
        });
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.error.length > 0 ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{this.state.error}</Text>
          </View>
        ) : null}
        <View style={styles.contentSection}>
          <View style={styles.postContainer}>
            <Text style={styles.ownerText}>{this.state.post.owner || 'Usuario'} posteó:</Text>
            <Text style={styles.postText}>{this.state.post.post || 'Sin contenido'}</Text>
          </View>

          <View style={styles.comentariosSection}>
            <Text style={styles.tituloComentarios}>Comentarios</Text>
            
            {this.state.loading ? (
              <Text style={styles.loadingText}>Cargando comentarios...</Text>
            ) : this.state.comentarios.length === 0 ? (
              <Text style={styles.noComentariosText}>No hay comentarios todavía</Text>
            ) : (
              <View>
                {this.state.comentarios.map((comentario, index) => {
                  return (
                    <View key={comentario.id} style={styles.comentarioCard}>
                      <Text style={styles.comentarioOwner}>{comentario.owner || 'Usuario'}</Text>
                      <Text style={styles.comentarioTexto}>{comentario.texto}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Comenta aquí tu post..."
            onChangeText={(text) => this.setState({ comentario: text, error: '' })}
            value={this.state.comentario}
          />
          <Pressable
            style={styles.button}
            onPress={() => this.publicarComentario()}
          >
            <Text style={styles.buttonText}>Publicar comentario</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16
  },
  contentSection: {
    flex: 1
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  ownerText: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 8
  },
  postText: {
    fontSize: 16,
    color: '#000'
  },
  comentariosSection: {
    marginBottom: 16
  },
  tituloComentarios: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000'
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20
  },
  noComentariosText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20
  },
  comentarioCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  comentarioOwner: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 4,
    fontWeight: '500'
  },
  comentarioTexto: {
    fontSize: 14,
    color: '#000'
  },
  inputSection: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500'
  },
  errorContainer: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center'
  }
});

