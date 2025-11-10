import { Text, View, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import {auth, db} from '../firebase/config'
import firebase from "firebase"

export default function PostCard(props) {
  const { post, owner, showCommentButton, onComment, postId, likes, showLikes } = props;

  function likePost(postId, userLikes){
    let userEmail = auth.currentUser.email;
    let postL = db.collection("posts").doc(postId);

    if (userLikes.includes(userEmail)) {
      postL.update({
        likes: firebase.firestore.FieldValue.arrayRemove(userEmail),
      });
    } else {
      postL.update({
        likes: firebase.firestore.FieldValue.arrayUnion(userEmail),
      });
    }
  }

  return (
    <View style={styles.postCard}>
      <Text style={styles.postText}>{post || 'Sin contenido'}</Text>
      <Text style={styles.ownerText}>{owner || 'Usuario'}</Text>
      {showCommentButton && onComment && (
        <Pressable
          style={styles.commentButton}
          onPress={() => onComment()}
        >
          <Text style={styles.commentButtonText}>Comentar</Text>
        </Pressable>
      )}
      <Pressable
        onPress={() => likePost(postId, likes || [])}
        style={styles.likeButton}>
       <View style={styles.likeRow}>
       <Text style={styles.likeText}>Me gusta</Text>
        <Text style={styles.likeCount}>
          {(likes && likes.length) ? likes.length : 0}
        </Text>
       </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
  likeButton: {
    alignSelf: 'flex-start',   
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 6,
    marginTop: 5
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  likeText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 8
  },
  likeCount: {
    fontSize: 14,
    color: '#333'
  }
});

