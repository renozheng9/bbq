import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Platform, TouchableWithoutFeedback, StyleSheet, FlatList, View} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Icon, Thumbnail, Toast, Input, Item, List, ListItem } from 'native-base';
import { FontSize } from '../util/FontSize';
import { width } from '../util/AdapterUtil';
import HomeItem from './HomeItem';
import UserItem from './UserItem';
import ThemeItem from './ThemeItem';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import { api_search } from '../global/Api';

@inject(["globalStore"])
@observer
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchStr: '',
      userList: [],
      themeList: [],
      articleList: []
    }
  }

  componentDidMount() {
  }

  search = () => {
    axios({
      url: api_search,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei
      },
      params: {
        'search_str': this.state.searchStr
      }
    }).then(res => {
      this.setState({
        userList: [...res.data.data.users],
        themeList: [...res.data.data.themes],
        articleList: [...res.data.data.articles]
      })
    }).catch(err => console.log(err));
  }

  deleteArticle = (article_id) => {
    let list = this.state.articleList;
    for(let i = 0; i < list.length; i++) {
      if(list[i].article_id == article_id) {
        list.splice(i, 1);
        this.setState({
          articleList: list
        });
        break;
      }
    }
  }

  render() {
    return(
      <Container style={{backgroundColor: '#F4F4F4'}}>
        {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)}
        <Header
          androidStatusBarColor="#53BFA2"
          style={{height: 50, justifyContent:'space-between', alignItems: 'center', backgroundColor: '#53BFA2'}}
        >
          <TouchableWithoutFeedback onPress={() => {Actions.pop()}}>
            <Icon name="ios-arrow-back" style={{fontSize: FontSize(30), color: '#fff', marginRight: 4}} />
          </TouchableWithoutFeedback>
          <Item style={{backgroundColor: '#fff', height: 30, width: width*0.8, borderRadius: 2}}>
            <Input style={{fontSize: FontSize(12)}} placeholder="Token招新" returnKeyType="search" onChangeText={(text) => {this.setState({searchStr: text})}} onEndEditing={this.search} />
          </Item>
          <TouchableWithoutFeedback onPress={this.search}>
            <Icon name="md-search" style={{fontSize: FontSize(30), color: '#fff'}} />
          </TouchableWithoutFeedback>
        </Header>
        <Content>
          <List>
            <ListItem itemDivider>
              <Text style={{fontSize: FontSize(14)}}>用户</Text>
            </ListItem>
            <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
              data={this.state.userList}
              keyExtractor={(item, index) => item.user_nickname.toString()}
              renderItem={({item, separators}) => 
                <UserItem item={item} />
              }
            />
            <ListItem itemDivider>
              <Text style={{fontSize: FontSize(14)}}>主题</Text>
            </ListItem>
            <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
              data={this.state.themeList}
              keyExtractor={(item, index) => item.theme_name.toString()}
              renderItem={({item, separators}) => 
                <ThemeItem item={item} />
              }
            />
            <ListItem itemDivider>
              <Text style={{fontSize: FontSize(14)}}>动态</Text>
            </ListItem>
            <FlatList
              style={{paddingLeft: 10, paddingRight: 10, backgroundColor: '#fff'}}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
              data={this.state.articleList}
              keyExtractor={(item, index) => item.article_id.toString()}
              renderItem={({item, separators}) => 
                <HomeItem item={item} delete={this.deleteArticle} />
              }
            />
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
})