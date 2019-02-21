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

export default class SingleTrends extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.item}>
        <View style={styles.header}>
          <View style={styles.infoWrapper}>
            <Image style={styles.avatar} source={require("../images/face.png")} />
            <View style={styles.info}>
              <Text style={styles.username}>武理周杰伦</Text>
              <Text style={styles.autograph}>啦啦啦，啦啦啦，我是卖报的小行家！</Text>
            </View>
          </View>
          <View style={styles.btns}>
            <TouchableWithoutFeedback>
              <View style={styles.starBtn}>
                <Icon name="add" size={20} color='#53BFA2' />
                <Text style={styles.starText}>关注</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
              <View>
                <Text style={styles.date}>2018-1-18</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <Text style={styles.content}>周董生日快乐！等你下课非常的棒。让我想起了那天在夕阳下的奔跑，那是我已逝的青春。</Text>
        <View style={styles.imageWrapper}>
          <FlatList
            horizontal={true}
            data={[{source: '../images/person.png', key: 'item1'},{source: 'search', key: 'item2'},{source: 'search', key: 'item3'}]}
            renderItem={({item, separators}) => (
              <Image source={require("../images/person.png")} style={{margin: width*0.005, width: width*0.31, height: width*0.22}} />
            )}
          />
        </View>
        <TouchableWithoutFeedback>
          <View style={styles.tipWrapper}>
            <Text style={styles.tip}>理工大又有什么好吐槽的</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.operations}>
          <TouchableWithoutFeedback>
            <View style={styles.operation}>
              <Icon name="share" color="#666666" size={20} />
              <Text style={styles.share}>转发</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <View style={styles.operation}>
              <Icon name="sms" color="#666666" size={20} />
              <Text style={styles.sms}>评论</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <View style={styles.operation}>
              <Icon name="thumb-up" color="#666666" size={20} />
              <Text style={styles.like}>赞</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    paddingTop: 10,
    paddingBottom: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoWrapper: {
    flexDirection: 'row'
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 5
  },
  username: {
    fontSize: 16,
    marginTop: 6,
    color: '#666666'
  },
  autograph: {
    fontSize: 14,
    color: '#888888'
  },
  btns: {
    alignItems: 'center'
  },
  starBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 4,
    borderWidth: 1.8,
    borderColor: '#53BFA2',
    borderRadius: 5
  },
  starText: {
    fontSize: 14,
    color: '#53BFA2'
  },
  date: {
    fontSize: 14,
    color: '#888888'
  },
  content: {
    marginBottom: 8,
    fontSize: 16,
    color: '#404040',
  },
  tipWrapper: {
    marginTop: 6,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  tip: {
    padding: 5,
    borderWidth: 2,
    borderColor: '#53BFA2',
    borderRadius: 8,
    fontSize: 16,
    color: '#53BFA2',
  },
  operations: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10
  },
  operation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20
  },
  share: {
    paddingLeft: 4,
    fontSize: 16,
    color: '#666666'
  },
  sms: {
    paddingLeft: 4,
    fontSize: 16,
    color: '#666666' 
  },
  like: {
    paddingLeft: 4,
    fontSize: 16,
    color: '#666666'
  }
})