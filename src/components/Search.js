import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Platform, TouchableWithoutFeedback, StyleSheet, FlatList, View} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Icon, Thumbnail, Toast, Input, Item, List, ListItem, Accordion } from 'native-base';
import { FontSize } from '../util/FontSize';
import { width } from '../util/AdapterUtil';
import HomeItem from './HomeItem';
import UserItem from './UserItem';
import ThemeItem from './ThemeItem';
import HistoryItem from './HistoryItem';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import { api_search } from '../global/Api';
import DeviceStorage from '../util/DeviceStorage';

@inject(["globalStore"])
@observer
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchStr: '', // 搜索的关键字
      userList: [], // 用户列表
      themeList: [], // 主题列表
      articleList: [], // 动态列表
      isSearch: false, // 是否已经搜索
      historyComponents: [], // 搜索历史item组件
      hasHistory: false, // 是否有搜索历史
      history: {} // 搜索历史
    }
  }

  componentDidMount() {
    // 从缓存读取搜索历史
    DeviceStorage.getJsonObject('searchHistory', {}).then(data => {
      if(JSON.stringify(data) != '{}') {
        let historyComponents = [];
        for(let i in data) {
          historyComponents.push(
            <HistoryItem date={i} item={data[i]} key={i} onClearHistory={this.clearItem} />
          )
        }
        this.setState({
          historyComponents: historyComponents,
          hasHistory: true,
          history: {...data}
        })
      }
    })
  }

  // 搜索
  search = () => {
    // 将搜索关键词缓存
    let history = {...this.state.history};
    let date = new Date();
    date = date.getTime();
    for(let i in history) {
      if(history[i] == this.state.searchStr) {
        delete history[i];
        break;
      }
    }
    history[date] = this.state.searchStr;
    DeviceStorage.saveJsonObject('searchHistory', history).then(data => {
    }).catch(err => console.log(err));
    this.setState({
      history: history
    });
    // 调用搜索接口
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
        userList: res.data.data.users,
        themeList: res.data.data.themes,
        articleList: res.data.data.articles,
        isSearch: true
      })
    }).catch(err => console.log(err));
  }

  // 清除某一条历史纪录
  clearItem = (date) => {
    let history = this.state.history;
    let index = 0;
    for(let i in history) {
      if(i == date) {
        delete history[i];
        let historyComponents = this.state.historyComponents;
        historyComponents.splice(index, 1);
        let hasHistory = historyComponents.length == 0 ? false : true;
        this.setState({
          historyComponents: historyComponents,
          hasHistory: hasHistory
        });
        break;
      }
      index++;
    }
    DeviceStorage.saveJsonObject('searchHistory', history).then(data => {
    }).catch(err => console.log(err));
    this.setState({
      history: history
    })
  }

  // 清除历史记录
  clearHistory = () => {
    DeviceStorage.remove('searchHistory').then(data => {
      this.setState({
        hasHistory: false
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
          style={{height: 50, justifyContent:'center', alignItems: 'center', backgroundColor: '#53BFA2'}}
        >
          <TouchableWithoutFeedback onPress={() => {Actions.pop()}}>
            <Icon name="ios-arrow-back" style={{fontSize: FontSize(30), color: '#fff', marginRight: 10}} />
          </TouchableWithoutFeedback>
          <View style={styles.searchWrapper}>
            <Icon name="md-search" style={styles.searchIcon} />
            <Input style={styles.searchInput} placeholder="Token招新" onSubmitEditing={this.search} onChangeText={(text) => this.setState({searchStr: text})} />
          </View>
        </Header>
        <Content style={styles.content}>
          {/* <Accordion
            headerStyle={{backgroundColor: '#fff'}}
            dataArray={[{'title': '用户', 'data': this.state.userList}]}
            icon="md-arrow-dropdown"
            expandedIcon="md-arrow-dropup"
            renderContent={this._renderUserItem}
          />
          <Accordion
            headerStyle={{backgroundColor: '#fff'}}
            dataArray={[{'title': '主题', 'data': this.state.themeList}]}
            icon="md-arrow-dropdown"
            expandedIcon="md-arrow-dropup"
            renderContent={this._renderThemeItem}
          />
          <Accordion
            headerStyle={{backgroundColor: '#fff'}}
            dataArray={[{'title': '动态', 'data': this.state.articleList}]}
            icon="md-arrow-dropdown"
            expandedIcon="md-arrow-dropup"
            renderContent={this._renderArticleItem}
          /> */}
          {
            this.state.isSearch ?
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
            :
              <View>
                <Text style={styles.searchText}>搜索历史</Text>
                {
                  this.state.hasHistory ?
                    <View>
                      {this.state.historyComponents}
                      <View style={styles.clearWrapper}>
                        <Text style={styles.itemText} onPress={this.clearHistory}>清除历史记录 <Icon name="md-trash" style={styles.itemText} /></Text>
                      </View>
                    </View>
                  :
                    <View style={styles.noSearch}>
                      <Text style={styles.noText}>暂无搜索记录···</Text>
                    </View>
                }
              </View>
          }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
  },
  searchWrapper: {
    height: 34,
    width: width*0.9,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingRight: 6,
    paddingLeft: 6
  },
  searchIcon: {
    fontSize: FontSize(20),
    color: '#888888'
  },
  searchInput: {
    fontSize: FontSize(12),
    color: '#888888'
  },
  searchText: {
    color: '#404040',
    fontSize: FontSize(13),
    fontWeight: 'bold'
  },
  clearWrapper: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end'
  },
  clearBtn: {
    flexDirection: 'row'
  },
  noSearch: {
    alignItems: 'center'
  },
  noText: {
    color: '#666666',
    fontSize: FontSize(13)
  },
  itemText: {
    color: '#666666',
    fontSize: FontSize(13)
  },
})