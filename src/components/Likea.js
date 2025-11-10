import { Text, View, Pressable, StyleSheet} from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../firebase/config';
import firebase from 'firebase';

export default class Likea extends Component {
 constructor(props) {
    super(props);
  }
  // fijarme si el usario ya likeo 
  usuarioDioLike() {
    var user = auth.currentUser;
    if (!user) { 
        return false 
    }
    var email = user.email || '';
    var likes = this.props.likes ? this.props.likes : [];
    var i = 0;
    while (i < likes.length) {
      if (likes[i] === email) { 
        return true 
    }
      i = i + 1;
    }
    return false
  }

  // Cmabiar entre dar like y sacarlo
  onMeGusta() {
    var postId = this.props.postId;
    if (!postId) { return; }

    var user = auth.currentUser;
    if (!user) { return; } 

    var email = user.email || '';
    var ya = this.usuarioDioLike();

    if (ya) {
      db.collection('posts')
        .doc(postId)
        .update({ likes: firebase.firestore.FieldValue.arrayRemove(email) })
        .catch(function(e){ console.log('dislike error', e); });
    } else {
      db.collection('posts')
        .doc(postId)
        .update({ likes: firebase.firestore.FieldValue.arrayUnion(email) })
        .catch(function(e){ console.log('like error', e); });
    }
   
  }

  render() {
    var likes = this.props.likes ? this.props.likes : [];
    var count = likes && likes.length ? likes.length : 0;
    var label = this.usuarioDioLike() ? 'Quitar me gusta' : 'Me gusta';

    return (
      <Pressable onPress={() => this.onMeGusta()}>
        <View style={styles.row}>
          <Text style={styles.text}>{label}</Text>
          <Text style={styles.count}>{count}</Text>
        </View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  row: { 
    flexDirection: 'row', 
    alignItems: 'center' 
},
  text: { 
    fontSize: 14, 
    color: '#007AFF', 
    fontWeight: '600', 
    marginRight: 8
 },
  count: { 
    fontSize: 14, 
    color: '#333' 
}
});