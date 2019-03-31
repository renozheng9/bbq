import React, { Component } from 'react';
import {
  StyleSheet,
  View,
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
import { api_article_attention } from '../global/Api';
import { getSign, imei } from '../global/Param';
import { inject, observer } from 'mobx-react';
import TrendItem from './TrendItem';

@inject(["globalStore"])
@observer
export default class Trend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelect: 0, // 0为子tab主题被选中,1为子tab用户被选中
      theme: [], // 关注主题数据集
      user: [] // 关注用户数据集
    }
  }

  componentDidMount() {
    axios({ // 获取关注的主题和用户
      url: api_article_attention,
      methods: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      }
    }).then(res => {
      let theme = [];
      let user = [];
      for(let i = 0; i < res.data.data.length; i++) {
        res.data.data[i].isUpvote = false;
        if(res.data.data[i].type == 1) { // 返回的数据项type字段为theme则添加至theme数组
          theme.push(res.data.data[i]);
        } else { // 返回的数据项type字段为user则添加至user数组
          user.push(res.data.data[i]);
        }
      }
      this.setState({
        theme: theme,
        user: user
      })
    }).catch(err => console.log(err));
  }

  select = () => {
    if(this.state.isSelect) {
      this.setState({
        isSelect: 0
      });
      this.viewpager.setPage(0)
    } else {
      this.setState({
        isSelect: 1
      });
      this.viewpager.setPage(1)
    }
  }

  updateData = (item) => { // Trend组件内同步数据
    if(item.type == 'theme') { // 如果改变的数据源为theme,则在user内寻找匹配的数据项进行同步
      for(let i = 0; i < this.state.user.length; i++) {
        if(this.state.user[i].article_id == item.article_id) {
          let data = this.state.user;
          data[i].likes = item.likes;
          data[i].isUpvote = item.isUpvote;
          this.setState({
            user: data
          });
          break;
        }
      }
    } else { // 如果改变的数据源为user,则在theme内寻找匹配的数据项进行同步
      for(let i = 0; i < this.state.theme.length; i++) {
        if(this.state.theme[i].article_id == item.article_id) {
          let data = this.state.theme;
          data[i].likes = item.likes;
          data[i].isUpvote = item.isUpvote;
          this.setState({
            theme: data
          });
          break;
        }
      }
    }
  }

  deleteArticle = (article_id) => {
    let user = this.state.user;
    let theme = this.state.theme;
    for(let i = 0; i < user.length; i++) {
      if(user[i].article_id == article_id) {
        user.splice(i, 1);
        break;
      }
    }
    for(let i = 0; i < theme.length; i++) {
      if(theme[i].article_id == article_id) {
        theme.splice(i, 1);
        break;
      }
    }
    this.setState({
      user: user,
      theme: theme
    })
  }

  render() {
    return (
      <Container>
        {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)}
        <Header
          androidStatusBarColor="#53BFA2"
          style={{height: 50, flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', backgroundColor: '#53BFA2'}}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableWithoutFeedback onPress={this.select}>
              <Text style={{color: '#fff', marginRight: 10, fontSize: this.state.isSelect ? FontSize(16) : FontSize(20), fontWeight: this.state.isSelect ? 'normal' : 'bold'}}>主题</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.select}>
              <Text style={{color: '#fff', fontSize: this.state.isSelect ? FontSize(20) : FontSize(16), fontWeight: this.state.isSelect ? 'bold' : 'normal'}}>用户</Text>
            </TouchableWithoutFeedback>
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
        <ViewPagerAndroid style={{flex: 1}} initialPage={0} ref={c => this.viewpager = c} onPageSelected={(event) => {this.setState({isSelect: event.nativeEvent.position})}}>
          <View style={{backgroundColor: '#EBEBEB'}} key="1">
            <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
              data={this.state.theme}
              keyExtractor={(item, index) => item.article_id.toString()}
              renderItem={({item, separators}) => 
                <TrendItem item={item} update={this.updateData} delete={this.deleteArticle} />
              }
            />
          </View>
          <View style={{backgroundColor: '#EBEBEB'}} key="2">
            <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
              data={this.state.user}
              keyExtractor={(item, index) => item.article_id.toString()}
              renderItem={({item, separators}) => 
                <TrendItem item={item} update={this.updateData} />
              }
            />
          </View>
        </ViewPagerAndroid>
        <Footer>
          <FooterTab style={{backgroundColor: '#fff'}}>
            <Button vertical onPress={Actions.home}>
              <Icon name="md-flame" style={{color: '#C3C3C3'}} />
              <Text style={{color: '#C3C3C3'}}>推荐</Text>
            </Button>
            <Button vertical>
              <Icon name="md-eye" style={{color: '#53BFA2'}} />
              <Text style={{color: '#53BFA2'}}>关注</Text>
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
    backgroundColor: '#fff'
  }
})