import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  TouchableWithoutFeedback,
  Picker
} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail } from 'native-base';
import { Actions } from 'react-native-router-flux'
import { observer, inject } from 'mobx-react';
import HomeListitem from './HomeListitem';
import ImgSwiper from './ImgSwiper';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import { Encrypt, Decrypt } from '../util/Encrypt';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import { api_article_recommend } from '../global/Api';

@inject(["globalStore"])
@observer
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      offset: 0
    }
  }
  componentDidMount() {
    axios({
      url: api_article_recommend,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei
      },
      params: {
        'offset': this.state.offset
      }
    }).then(res => {
      this.setState({
        list: [...this.state.list, ...res.data.data.admin_recommend, ...res.data.data.most_like],
        offset: this.state.offset + 30
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
          style={{height: 50, flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', backgroundColor: '#53BFA2'}}
        >
          <View>
            <Text style={{fontSize: FontSize(16), color: '#fff', fontWeight: 'bold'}}>首页</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableWithoutFeedback onPress={() => {Actions.push('edit')}}>
              <Icon name="md-create" style={{fontSize: FontSize(20), color: '#fff', marginRight: 20}} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {Actions.push('search')}}>
              <Icon name="md-search" style={{fontSize: FontSize(22), color: '#fff'}} />
            </TouchableWithoutFeedback>
          </View>
        </Header>
        <Content style={{backgroundColor: '#fff', paddingLeft: width*0.02, paddingRight: width*0.02}}>
          <View style={styles.imgWapper}>
            <ImgSwiper />
          </View>
          <View style={styles.listWrapper}>
            <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
              data={this.state.list}
              keyExtractor={(item, index) => item.article_id.toString()}
              renderItem={({item, separators}) => 
                <HomeListitem item={item} page="home" />
              }
            />
          </View>
        </Content>
        <Footer>
          <FooterTab style={{backgroundColor: '#fff'}}>
            <Button vertical>
              <Icon name="md-flame" style={{color: '#53BFA2'}} />
              <Text style={{color: '#53BFA2'}}>推荐</Text>
            </Button>
            <Button vertical onPress={Actions.trend}>
              <Icon name="md-eye" style={{color: '#C3C3C3'}} />
              <Text style={{color: '#C3C3C3'}}>关注</Text>
            </Button>
            <Button vertical onPress={Actions.personal}>
              <Icon name="md-person" style={{color: '#C3C3C3'}} />
              <Text style={{color: '#C3C3C3'}}>我的</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.02,
    backgroundColor: '#fff'
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 5
  },
  imgWapper: {
    paddingTop: 10,
    alignItems: 'center'
  },
  listWrapper: {
    flex: 1,
    paddingTop: 20
  }
})