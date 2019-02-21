import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { Alert, View, Text, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

let wrapperWidth = Dimensions.get('window').width * 0.85;

export default class TrendsDetailNav extends Component {
  constructor(props) {
    super(props);
  }
  _onPress() {
    Alert.alert('www')
  }
  render() {
    return(
      <View style={styles.container}>
        <TouchableWithoutFeedback>
          <Icon name='chevron-left' size={40} color="#fff" />
        </TouchableWithoutFeedback>
        <Text style={styles.title}>动态详情</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#53BFA2'
  },
  title: {
    fontSize: 18,
    color: '#fff'
  }
})