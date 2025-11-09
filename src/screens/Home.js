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
  render(){
    return(
      <Text>Estas en el home</Text>
    )

  }
}