import React, { Component } from 'react';
import { Text, View, Pressable, StyleSheet, FlatList } from 'react-native';
import { db, auth } from '../firebase/config';

export default class MiPerfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      username: '',
      posts: [],
      loading: true
    };
  }

  componentDidMount() {
    // Escuchar cambios en el estado de autenticación
    auth.onAuthStateChanged((user) => {
      if (user) {
        // Usuario autenticado, cargar datos
        this.getUserData();
        this.getUserPosts();
      } else {
        // Usuario no autenticado, redirigir a Login
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
            this.setState({ 
              username: userData.username || user.email
            });
          } else {
            // Si no hay datos, usar email como username
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
        .get()
        .then((docs) => {
          const posts = [];
          docs.docs.forEach((doc) => {
            posts.push({
              id: doc.id,
              text: doc.data().text || doc.data().content || '',
              createdAt: doc.data().createdAt
            });
          });
          this.setState({ posts });
        })
        .catch((error) => {
          console.log('Error al obtener posts:', error);
          this.setState({ posts: [] });
        });
    }
  }

  logout() {
    auth.signOut()
      .then(() => {
        alert('Sesión cerrada correctamente');
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        console.log('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión');
      });
  }

  renderPost = ({ item }) => {
    return (
      <View style={styles.postCard}>
        <Text style={styles.postUser}>
          {this.state.username} posteó
        </Text>
        <Text style={styles.postText}>{item.text || 'Sin contenido'}</Text>
      </View>
    );
  }

  render() {
    const { userEmail, username, posts, loading } = this.state;

    if (loading) {
      return (
        <View style={styles.container}>
          <Text>Cargando...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Mi Perfil</Text>
          
          <View style={styles.userInfo}>
            <Text style={styles.label}>Nombre de usuario:</Text>
            <Text style={styles.value}>{username}</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userEmail}</Text>
          </View>
        </View>

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Últimos posteos</Text>
          
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
  },
  postCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
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
});
