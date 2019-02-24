import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  TouchableWithoutFeedback,
  ImageBackground
} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail } from 'native-base';
import { Actions } from 'react-native-router-flux'
import { observer, inject } from 'mobx-react';
import HomeItem from './HomeItem';
import { width, height } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import { api_article_recommend, api_slideimg } from '../global/Api';
import Carousel from 'react-native-snap-carousel';
import { domain } from '../global/Global';

@inject(["globalStore"])
@observer
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [], // 动态列表
      offset: 0, // 偏移值
      slideImg: [], // 轮播图列表
      refreshing: false // 是否在刷新
    }
  }
  componentDidMount() {
    axios({ // 获取推荐动态
      url: api_article_recommend,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
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
    }).catch(err => console.log(err));
    axios({ // 获取轮播图
      url: api_slideimg,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei
      }
    }).then(res => {
      if(res.data.status) {
        let data = res.data.data;
        data.sort((a,b) => {
          return a.img_order - b.img_order;
        });
        this.setState({
          slideImg: [...data]
        })
      }
    }).catch(err => console.log(err));
  }

  deleteArticle = (article_id) => {
    let list = this.state.list;
    for(let i = 0; i < list.length; i++) {
      if(list[i].article_id == article_id) {
        list.splice(i, 1);
        this.setState({
          list: list
        });
        break;
      }
    }
  }

  loadMore = () => {
    axios({ // 获取更多推荐动态
      url: api_article_recommend,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
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
    }).catch(err => console.log(err));
  }

  refresh = () => {
    this.setState({refreshing: true})
    axios({ // 重新获取推荐动态
      url: api_article_recommend,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei
      },
      params: {
        'offset': 0
      }
    }).then(res => {
      this.setState({
        list: [...res.data.data.admin_recommend, ...res.data.data.most_like],
        offset: 30,
        refreshing: false
      })
    }).catch(err => console.log(err));
  }

  _renderImgItem = ({item, index}) => {
    return (
      <ImageBackground source={{uri: `${domain}image/${item.img_url}-500-100.png`}} style={{width: width*0.9, height: width*0.378, justifyContent: 'flex-end', alignItems: 'center'}}>
        <Text style={{fontSize: FontSize(24), color: '#fff', fontWeight: 'bold'}}>{item.img_description}</Text>
      </ImageBackground>
    );
  }

  _renderSeparator = () => {
    return (<View style={{height: 1, backgroundColor: '#AEAEAE'}}></View>)
  }

  _renderListItem = ({item, separators}) => {
    return (<HomeItem item={item} page="home" delete={this.deleteArticle} />)
  }

  render() {
    return (
      <Container>
        {/* {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)} */}
        <StatusBar barStyle="light-content" hidden={false} translucent={false} backgroundColor="transparent" />
        <Header
          androidStatusBarColor="#53BFA2"
          style={styles.header}
        >
          <View>
            <Text style={styles.title}>首页</Text>
          </View>
          <View style={styles.operations}>
            <TouchableWithoutFeedback onPress={() => Actions.push('edit')}>
              <Icon name="md-create" style={styles.createIcon} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => Actions.push('search')}>
              <Icon name="md-search" style={styles.searchIcon} />
            </TouchableWithoutFeedback>
          </View>
        </Header>
        <View style={styles.wrapper}>
        {/* <Content style={{backgroundColor: '#fff'}}> */}
          <View style={styles.carouselWrapper}>
            <Carousel
              ref={(c) => {this._carousel = c}}
              data={this.state.slideImg}
              renderItem={this._renderImgItem}
              sliderWidth={width}
              itemWidth={width*0.9}
              autoplay={true}
              loop={true}
            />
          </View>
          <View style={styles.flatlistWrapper}>
            <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this._renderSeparator}
              data={this.state.list}
              keyExtractor={(item, index) => item.article_id.toString()}
              onEndReached={this.loadMore}
              onEndReachedThreshold={0.2}
              onRefresh={this.refresh}
              refreshing={this.state.refreshing}
              renderItem={this._renderListItem}
            />
          </View>
        </View>
        {/* </Content> */}
        <Footer>
          <FooterTab style={styles.footertab}>
            <Button vertical>
              <Icon name="md-flame" style={styles.active} />
              <Text style={styles.active}>推荐</Text>
            </Button>
            <Button vertical onPress={Actions.trend}>
              <Icon name="md-eye" style={styles.inactive} />
              <Text style={styles.inactive}>关注</Text>
            </Button>
            <Button vertical onPress={Actions.personal}>
              <Icon name="md-person" style={styles.inactive} />
              <Text style={styles.inactive}>我的</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    backgroundColor: '#53BFA2'
  },
  title: {
    fontSize: FontSize(16),
    color: '#fff',
    fontWeight: 'bold'
  },
  operations: {
    flexDirection: 'row'
  },
  createIcon: {
    fontSize: FontSize(20),
    color: '#fff',
    marginRight: 20
  },
  searchIcon: {
    fontSize: FontSize(22),
    color: '#fff'
  },
  wrapper: {
    flex: 1
  },
  carouselWrapper: {
    alignItems: 'center',
    paddingTop: 10
  },
  flatlistWrapper: {
    flex: 1,
    paddingTop: 20
  },
  footertab: {
    backgroundColor: '#fff'
  },
  active: {
    color: '#53BFA2'
  },
  inactive: {
    color: '#C3C3C3'
  }
})