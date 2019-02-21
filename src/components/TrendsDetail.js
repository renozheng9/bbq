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
  ImageBackground,
  ViewPagerAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ListItem from './ListItem';
import CommentItem from './CommentItem';
import SingleTrends from './SingleTrends';

export default class TrendsDetail extends Component {
  constructor(props) {
    super(props);
    this.item = {
      username: '武理周杰伦'
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.trends}>
          <SingleTrends />
        </View>
        <View style={styles.comment}>
          <Text style={styles.title}>最热评论</Text>
          <View style={styles.line}></View>
          <View style={styles.listWrapper}>
            <FlatList
              ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
              data={[{source: '../images/person.png', username: '武理周杰伦', key: 'item1'},{source: 'search', username: '武理周杰伦', key: 'item2'},{source: 'search', username: '武理周杰伦', key: 'item3'},{source: 'search', username: '武理周杰伦', key: 'item4'},{source: 'search', username: '武理周杰伦', key: 'item5'},{source: 'search', username: '武理周杰伦', key: 'item6'}]}
              renderItem={({item, separators}) => (
                <CommentItem />
              )}
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  trends: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff'
  },
  comment: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff'
  },
  title: {
    marginBottom: 10,
    fontSize: 16,
    color: '#666666'
  },
  line: {
    flexDirection: 'row',
    height: 1,
    backgroundColor: '#AEAEAE'
  },
  listWrapper: {
    flex: 1
  }
})