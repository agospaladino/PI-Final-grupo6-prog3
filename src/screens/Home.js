import { Text, View, FlatList, Pressable, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../firebase/config'

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts() {
    db.collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot((docs) => {
        const posts = docs.docs.map((doc) => {
          return {
            id: doc.id,
            post: doc.data().post || '',
            owner: doc.data().owner || ''
          };
        });
        this.setState({ posts, loading: false });
      });
  }

  renderPost = ({ item }) => {
    return (
      <View style={styles.postCard}>
        <Text style={styles.postUser}>
          {item.owner || 'Usuario'} posteó
        </Text>
        <Text style={styles.postText}>{item.post || 'Sin contenido'}</Text>
        <Pressable
          style={styles.commentButton}
          onPress={() => this.props.navigation.navigate('ComentarPost', { postId: item.id, post: item })}
        >
          <Text style={styles.commentButtonText}>Comentar</Text>
        </Pressable>
      </View>
    );
  }

  render() {
    const { posts, loading } = this.state;

    if (loading) {
      return (
        <View style={styles.container}>
          <Text>Cargando...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {posts.length === 0 ? (
          <Text style={styles.noPosts}>No hay posteos todavía</Text>
        ) : (
          <FlatList
            data={posts}
            renderItem={this.renderPost}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postUser: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  postText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
    marginBottom: 10,
  },
  commentButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 5,
  },
  commentButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  noPosts: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
});
