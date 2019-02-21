import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Image,
  FlatList,
  StatusBar,
  ImageBackground
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Toast } from 'native-base';
import { observer, inject } from 'mobx-react';
import { FontSize } from '../util/FontSize';
import { getSign, imei } from '../global/Param';
import { Encrypt, Decrypt } from '../util/Encrypt';
import axios from 'axios';
import DeviceStorage from '../util/DeviceStorage';
import { width } from '../util/AdapterUtil';
import { api_article_recommend, api_theme_article } from '../global/Api';
import ListItem from './ListItem';

@inject("globalStore", "listStore")
@observer
export default class List extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    switch(this.props.page) {
      case 'home': this.props.listStore.updateRecommend();break;
      case 'themeDetail': this.props.listStore.updateSingleTheme();break;
    }
  }
  render() {
    let data;
    switch(this.props.page) {
      case 'home': data = this.props.listStore.recommend;break;
      case 'themeDetail': data = this.props.listStore.singleTheme;break;
    }
    return (
      <View>
          {/* <TouchableWithoutFeedback onPress={() => {Alert.alert(JSON.stringify(this.props.listStore.recommendUpvote))}}>
            <Text>click</Text>
          </TouchableWithoutFeedback> */}
        <FlatList
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
          data={data}
          keyExtractor={(item, index) => item.article_id.toString()}
          renderItem={({item, separators}) => 
            <ListItem item={item} page={this.props.page} />
          }
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({

})