import { Text, View, FlatList, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../firebase/config'
import PostCard from '../components/PostCard'

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postsRecuperados: [],
      error: ''
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

  render() {
    return (
      <View style={styles.container}>
        {this.state.error.length > 0 ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{this.state.error}</Text>
          </View>
        ) : null}
        <FlatList
          data={this.state.postsRecuperados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(itemData) => {
            let item = itemData.item;
            let autor = item.data.ownerName && item.data.ownerName !== ''
              ? item.data.ownerName
              : (item.data.owner || 'Usuario')

            return (
              <PostCard
                post={item.data.post}
                owner={autor}
                postId={item.id}
                likes={item.data.likes || []}
                showLikes={true}
                showCommentButton={true}
                onComment={() => {
                if (!auth.currentUser) {
                  this.setState({ error: 'Debe estar logueado para comentar.' });
                  this.props.navigation.navigate('Login');
                } else {
                  this.setState({ error: '' });
                  this.props.navigation.navigate('ComentarPost', { postId: item.id, post: item.data });
                }
              }}

              />
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
  noPosts: { 
    fontSize: 14, 
    color: '#999', 
    textAlign: 'center', 
    padding: 20 
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