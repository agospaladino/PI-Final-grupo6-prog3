import { Text, View } from 'react-native';
import React, { Component } from 'react';
import Postea from '../components/Postea';


export default class CrearPost extends Component {
  render() {
    return (
      <View>
        <Postea navigation={this.props.navigation}/>
      </View>
    )
  }
}