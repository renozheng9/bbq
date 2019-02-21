import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  Image,
  FlatList,
  StatusBar,
  TouchableWithoutFeedback
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Form, Item, Label, Input, Textarea } from 'native-base';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import axios from 'axios';
import { api_theme_attention_user } from '../global/Api';
import { getSign, imei } from '../global/Param';
import { inject, observer } from 'mobx-react';
import ThemeDetailListitem from './ThemeDetailListitem';
import CommentItem from './CommentItem';

export default class TrendDetail extends Component {
  constructor(props) {
    super(props);
    this.item = {
      username: '武理周杰伦'
    }
  }
  render() {
    return (
      <Container>
        {/* {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)} */}
        <StatusBar barStyle="light-content" hidden={false} translucent={false} backgroundColor="transparent" />
        <Header
          androidStatusBarColor="#53BFA2"
          style={{height: 50, flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', backgroundColor: '#53BFA2'}}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableWithoutFeedback onPress={() => {Actions.pop()}}>
              <Icon name="ios-arrow-back" style={{fontSize: FontSize(30), color: '#fff', marginRight: 10}} />
            </TouchableWithoutFeedback>
            <Text style={{color: '#fff', fontSize: FontSize(16), fontWeight: 'bold'}}>动态详情</Text>
          </View>
        </Header>
        <Content style={{backgroundColor: '#EBEBEB'}}>
          <View style={{backgroundColor: '#fff'}}>
            <ThemeDetailListitem item={this.props.item} />
          </View>
          <View>
            {/* <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
              data={this.state.theme}
              keyExtractor={(item, index) => item.theme_id.toString()}
              renderItem={({item, separators}) => 
                <ThemeListitem item={item} />
              }
            /> */}
          </View>
        </Content>
      </Container>
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