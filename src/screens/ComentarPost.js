import { Text, View, TextInput, Pressable } from 'react-native'
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
      <View>
        <View>
          <Text>
            {post.owner || 'Usuario'} posteó
          </Text>
          <Text>{post.post || 'Sin contenido'}</Text>
        </View>

        <View>
          <Text>Comentarios</Text>
          
          {loading ? (
            <Text>Cargando comentarios...</Text>
          ) : comentarios.length === 0 ? (
            <Text>No hay comentarios todavía</Text>
          ) : (
            <View>
              {comentarios.map((comentario) => {
                return (
                  <View key={comentario.id}>
                    <Text>{comentario.owner || 'Usuario'}</Text>
                    <Text>{comentario.texto}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View>
          <TextInput
            placeholder="Comenta aquí tu post..."
            onChangeText={(text) => this.setState({ comentario: text })}
            value={comentario}
            multiline
          />
          <Pressable
            onPress={() => this.publicarComentario()}
          >
            <Text>Publicar comentario</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

