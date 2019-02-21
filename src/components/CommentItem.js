import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Image,
  FlatList,
  TouchableHighlight,
  ViewPagerAndroid,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';

var { height, width } = Dimensions.get('window');

export default class CommentItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.item}>
        <View style={styles.left}>
          <Image source={require("../images/face.png")} style={styles.avatar} />
        </View>
        <View style={styles.right}>
          <View style={styles.wrapper}>
            <View style={styles.info}>
              <Text style={styles.username}>武理周杰伦</Text>
              <Text style={styles.date}>2018-1-10</Text>
            </View>
            <View style={styles.likeWrapper}>
              <Text style={styles.likeNum}>22</Text>
              <Icon name="thumb-up" size={25} color="#666666" />
            </View>
          </View>
          <View>
            <Text style={styles.content}>周董生日快乐！周董生日快乐！周董生日快乐！周董生日快乐！周董生日快乐！周董生日快乐！</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 10
  },
  right: {
    flex: 1
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  likeWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  username: {
    fontSize: 16,
    color: '#666666'
  },
  date: {
    fontSize: 14,
    color: '#666666'
  },
  likeNum: {
    marginRight: 6,
    fontSize: 14,
    color: '#666666'
  },
  content: {
    fontSize: 16,
    color: '#404040'
  }
})