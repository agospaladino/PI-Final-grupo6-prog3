import React, { Component } from 'react';
import { Text, View, Pressable, StyleSheet, FlatList } from 'react-native';
import { db, auth } from '../firebase/config';
import PostCard from '../components/PostCard';

export default class MiPerfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      username: '',
      posts: [],
      loading: true,
      error: ''
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.getUserData();
        this.getUserPosts();
      } else {
        this.props.navigation.navigate('Login');
      }
    });
  }

  getUserData() {
    const user = auth.currentUser;
    if (user) {
      this.setState({ userEmail: user.email });
      
      // Buscar datos del usuario en Firestore
      db.collection('users')
        .where('owner', '==', user.email)
        .get()
        .then((docs) => {
          if (docs.empty === false) {
            const userData = docs.docs[0].data();
            console.log('Datos del usuario encontrados:', userData);
            const nombreUsuario = userData.username || userData.nombre || user.email;
            this.setState({ 
              username: nombreUsuario
            });
          } else {
            // Si no hay datos, usar email como username
            console.log('No se encontraron datos del usuario');
            this.setState({ 
              username: user.email
            });
          }
          this.setState({ loading: false });
        })
        .catch((error) => {
          console.log('Error:', error);
          this.setState({ 
            username: user.email,
            loading: false 
          });
        });
    }
  }

  getUserPosts() {
    const user = auth.currentUser;
    if (user) {
      db.collection('posts')
        .where('owner', '==', user.email)
        .onSnapshot((docs) => {
          const posts = [];
          docs.docs.forEach((doc) => {
            posts.push({
              id: doc.id,
              data: doc.data()
            });
          });
          this.setState({ posts });
        });
    }
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        console.log('Error al cerrar sesión:', error);
        this.setState({ error: 'Error al cerrar sesión' });
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <Text>Cargando...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {this.state.error.length > 0 ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{this.state.error}</Text>
          </View>
        ) : null}
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Mi Perfil</Text>
          
          <View style={styles.userInfo}>
            <Text style={styles.label}>Nombre de usuario:</Text>
            <Text style={styles.value}>{this.state.username}</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{this.state.userEmail}</Text>
          </View>
        </View>

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Últimos posteos</Text>
          
          {this.state.posts.length === 0 ? (
            <Text style={styles.noPosts}>No hay posteos todavía</Text>
          ) : (
            <FlatList
              data={this.state.posts}
              renderItem={(itemData) => {
                let item = itemData.item;
                let autor = item.data.ownerName && item.data.ownerName !== ''
                  ? item.data.ownerName
                  : (item.data.owner || this.state.username || 'Usuario')

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
              keyExtractor={(item) => item.id}
            />
          )}
        </View>

        <Pressable
          style={styles.logoutButton}
          onPress={() => this.logout()}
        >
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </Pressable>
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
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  userInfo: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  postsSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    maxHeight: 400,
  },
  noPosts: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
