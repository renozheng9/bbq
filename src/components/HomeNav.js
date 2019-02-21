import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { Alert, View, Text, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { observer, inject } from 'mobx-react';

let wrapperWidth = Dimensions.get('window').width * 0.9;

// @inject(["homeStore"])
// @observer
export default class HomeNav extends Component {
  constructor(props) {
    super(props);
    //this.store = this.props.homeStore;
  }
  render() {
    //const store = this.store;
    return(
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>首页</Text>
        </View>
        <View style={styles.iconWrapper}>
          <TouchableWithoutFeedback>
            <Icon name="edit" size={30} color="#fff" style={{marginRight: 14}} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <Icon name="search" size={35} color="#fff" />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#53BFA2'
  },
  iconWrapper: {
    flexDirection: 'row'
  },
  title: {
    fontSize: 21,
    color: '#fff',
    fontWeight: 'bold'
  }
})