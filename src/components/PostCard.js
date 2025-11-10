import { Text, View, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import Likea from './Likea'

export default function PostCard(props) {
  const { post, owner, showCommentButton, onComment, postId, likes, showLikes } = props;

  return (
    <View style={styles.postCard}>
      <Text style={styles.postText}>{post || 'Sin contenido'}</Text>
      <Text style={styles.ownerText}>{owner || 'Usuario'}</Text>
      {showLikes && postId && (
        <Likea
          postId={postId}
          likes={likes || []}
        />
      )}
      {showCommentButton && onComment && (
        <Pressable
          style={styles.commentButton}
          onPress={() => onComment()}
        >
          <Text style={styles.commentButtonText}>Comentar</Text>
        </Pressable>
      )}
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
  }
});

