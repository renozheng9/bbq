import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  ImageBackground,
  Platform,
  TouchableWithoutFeedback,
  ViewPagerAndroid
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Form, Item, Label, Input, Textarea } from 'native-base';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import axios from 'axios';
import { api_theme_attention_user } from '../global/Api';
import { getSign, imei } from '../global/Param';
import { inject, observer } from 'mobx-react';
import ThemeListitem from './ThemeListitem';

@inject(["globalStore"])
@observer
export default class AttendTheme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: [] // 关注主题数据集
    }
  }

  componentDidMount() {
    axios({
      url: api_theme_attention_user,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei,
        'access_user_token': this.props.globalStore.token
      },
      params: {
        'id': this.props.userID
      }
    }).then(res => {
      let theme = [];
      for(let i = 0; i < res.data.data.length; i++) {
        res.data.data[i].id = res.data.data[i].theme_id;
        theme.push(res.data.data[i]);
      }
      this.setState({
        theme: theme
      })
    }).catch(err => {console.log(err)});
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
              <Icon name="ios-arrow-back" style={{fontSize: FontSize(30), color: '#fff'}} />
            </TouchableWithoutFeedback>
            <Text style={{color: '#fff', fontSize: FontSize(16), marginLeft: 10, fontWeight: 'bold'}}>{this.props.nickname}关注的主题</Text>
          </View>
        </Header>
        <Content style={{backgroundColor: '#EBEBEB'}}>
          <View>
            <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
              data={this.state.theme}
              keyExtractor={(item, index) => item.theme_id.toString()}
              renderItem={({item, separators}) => 
                <ThemeListitem item={item} />
              }
            />
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})