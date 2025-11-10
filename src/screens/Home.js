import { Text, View, FlatList, Pressable, StyleSheet, Alert } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../firebase/config'

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postsRecuperados: [],
    };
    this.unsubscribe = null;
  }

  componentDidMount() {
    this.unsubscribe = db
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot((docs) => {
        const posts = [];
        docs.forEach((doc) => {
          posts.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        this.setState({ postsRecuperados: posts });
      });
  }

  componentWillUnmount() {
    if (this.unsubscribe) { this.unsubscribe(); }
  }

  irAComentar(item) {
    if (!auth.currentUser) {
      Alert.alert('Atención', 'Tenés que estar logueada para comentar.');
      this.props.navigation.navigate('Login');
      return;
    }
    this.props.navigation.navigate('ComentarPost', { postId: item.id, post: item.data });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.postsRecuperados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            var autor = item.data.ownerName && item.data.ownerName !== ''
              ? item.data.ownerName
              : (item.data.owner || 'Usuario');

            
            var cantLikes = item.data.likes && item.data.likes.length
              ? item.data.likes.length
              : 0;

            return (
              <View style={styles.postCard}>
                <Text style={styles.postText}>{item.data.post || 'Sin contenido'}</Text>
                <Text style={styles.ownerText}>{autor}</Text>
                <Text style={styles.likesText}>{cantLikes} {cantLikes === 1 ? 'like' : 'likes'}</Text>

                <Pressable
                  style={styles.commentButton}
                  onPress={() => this.irAComentar(item)}
                >
                  <Text style={styles.commentButtonText}>Comentar</Text>
                </Pressable>
              </View>
            );
          }}
          ListEmptyComponent={<Text style={styles.noPosts}>No hay posteos todavía</Text>}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f5f5f5' 
  },
  postCard: {
    marginBottom: 12,
     padding: 12, 
     borderWidth: 1, 
     borderColor: 'lightgray', 
     borderRadius: 8, 
     backgroundColor: '#fff'
  },
  postText: { 
    fontSize: 16, 
    marginBottom: 6, 
    color: '#000' 
  },
  ownerText: { 
    fontSize: 12, 
    color: 'gray', 
    marginBottom: 6 
  },
  likesText: { 
    fontSize: 12, 
    color: '#333', 
    marginBottom: 8 
  },
  commentButton: {
    backgroundColor: '#007AFF', 
    padding: 10, 
    borderRadius: 6, 
    alignItems: 'center', 
    marginTop: 5
  },
  commentButtonText: { 
    color: '#fff', 
    fontSize: 14,
     fontWeight: '500' 
    },
  noPosts: { 
    fontSize: 14, 
    color: '#999', 
    textAlign: 'center', 
    padding: 20 
  }
});