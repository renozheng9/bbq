import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import Swiper from 'react-native-swiper';

var { height, width } = Dimensions.get('window');

export default class ImgSwiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swiperShow: false,
    };
    this.list = [
      {'url': require('../images/swiper1.png')},
      {'url': require('../images/swiper2.png')},
      {'url': require('../images/swiper3.png')}
    ]
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        swiperShow: true
      });
    }, 0)
  }
  render() {
    let list = this.list;
    if(this.state.swiperShow) {
      return (
        <View style={styles.wrapper}>
          <Swiper style={styles.content} autoplay={true}>
            {
              list.map((item, index) => 
              <View key={item}><Image style={{width: width*0.9, height: width*0.378}} resizeMode="stretch" source={item.url}/></View>)
            }
          </Swiper>
        </View>
      )
    }
    else {
      return (
        <View></View>
      )
    }
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: width * 0.9,
    height: width * 0.378
  },
  content: {
    flex: 1
  }
})