import { Text, View, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import {auth, db} from '../firebase/config'
import firebase from "firebase"

export default function PostCard(props) {
  let userEmail = auth.currentUser ? auth.currentUser.email : '';
  let userLikes = props.likes || [];
  let isLiked = userLikes.includes(userEmail);
  let likeText = isLiked ? 'Quitar me gusta' : 'Me gusta';

  return (
    <View style={styles.postCard}>
      <Text style={styles.postText}>{props.post || 'Sin contenido'}</Text>
      <Text style={styles.ownerText}>{props.owner || 'Usuario'}</Text>
      {props.showCommentButton && props.onComment ? (
        <Pressable
          style={styles.commentButton}
          onPress={() => props.onComment()}
        >
          <Text style={styles.commentButtonText}>Comentar</Text>
        </Pressable>
      ) : null}
      {props.showLikes ? (
        <Pressable
          onPress={() => {
            let userEmail = auth.currentUser.email;
            let postL = db.collection("posts").doc(props.postId);
            let userLikes = props.likes || [];

            if (userLikes.includes(userEmail)) {
              postL.update({
                likes: firebase.firestore.FieldValue.arrayRemove(userEmail),
              });
            } else {
              postL.update({
                likes: firebase.firestore.FieldValue.arrayUnion(userEmail),
              });
            }
          }}
          style={styles.likeButton}>
         <View style={styles.likeRow}>
         <Text style={styles.likeText}>{likeText}</Text>
          <Text style={styles.likeCount}>
            {(props.likes && props.likes.length) ? props.likes.length : 0}
          </Text>
         </View>
        </Pressable>
      ) : null}
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

