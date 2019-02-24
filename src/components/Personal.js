import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableNativeFeedback,
  TouchableWithoutFeedback
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Toast } from 'native-base';
import { observer, inject } from 'mobx-react';
import { FontSize } from '../util/FontSize';
import { domain } from '../global/Global';

@inject(["globalStore"])
@observer
export default class Personal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
  }
  render() {
    return (
      <Container>
        {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)}
        <Header
          androidStatusBarColor="#53BFA2"
          style={styles.header}
        >
          <Text style={styles.title}>我的</Text>
        </Header>
        {
          this.props.globalStore.status != 0 ?
          <Content style={styles.content}>
            <View style={styles.wrapper}>
              <View style={styles.item}>
                <View style={styles.left}>
                  <Thumbnail source={require("../images/avatar.png")} style={styles.avatar} />
                  <Text style={styles.unloginText}>未登录</Text>
                </View>
                <TouchableWithoutFeedback onPress={Actions.login}>
                  <View style={styles.toBtn}>
                    <Text style={styles.toText}>去登录</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </Content>
          :
          <Content style={styles.content}>
            <View style={styles.wrapper}>
              <View style={styles.item}>
                <View style={styles.left}>
                  <Thumbnail source={this.props.globalStore.userInfo.avatar ? {uri: `${domain}image/${this.props.globalStore.userInfo.avatar}-80-100.png`} : require("../images/avatar.png")} style={styles.avatar} />
                  <View>
                    <Text style={{fontSize: FontSize(16), color: '#414141'}}>{this.props.globalStore.userInfo.nickname}</Text>
                    <Text style={{fontSize: FontSize(14), color: '#414141'}}>{this.props.globalStore.userInfo.signature}</Text>
                  </View>
                </View>
                <TouchableWithoutFeedback onPress={Actions.login}>
                  <View style={styles.toBtn}>
                    <Text style={styles.toText}>去认证</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View style={styles.wrapper}>
              <TouchableNativeFeedback onPress={() => {Actions.push('info')}}>
                <View style={styles.item}>
                  <View style={styles.left}>
                    <Icon name="md-create" style={{color: "#666666"}} />
                    <Text style={styles.btnText}>编辑我的个人资料</Text>
                  </View>
                  <Icon name="md-arrow-dropright" style={{color: "#666666"}} />
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.wrapper}>
              <TouchableNativeFeedback onPress={() => {Actions.push('message')}}>
                <View style={[styles.item, {borderBottomWidth : 1, borderBottomColor: '#C3C3C3'}]}>
                  <View style={styles.left}>
                    <Icon name="md-notifications" style={{color: "#666666"}} />
                    <Text style={styles.btnText}>我的消息</Text>
                  </View>
                  <Icon name="md-arrow-dropright" style={{color: "#666666"}} />
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() => {Actions.push('collection')}}>
                <View style={[styles.item, {borderBottomWidth : 1, borderBottomColor: '#C3C3C3'}]}>
                  <View style={styles.left}>
                    <Icon name="md-book" style={{color: "#666666"}} />
                    <Text style={styles.btnText}>我的收藏</Text>
                  </View>
                  <Icon name="md-arrow-dropright" style={{color: "#666666"}} />
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() => {Actions.push('attendTheme', {'nickname': '我'})}}>
                <View style={styles.item}>
                  <View style={styles.left}>
                    <Icon name="md-heart" style={{color: "#666666"}} />
                    <Text style={styles.btnText}>我关注的主题</Text>
                  </View>
                  <Icon name="md-arrow-dropright" style={{color: "#666666"}} />
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.wrapper}>
              <TouchableNativeFeedback onPress={() => {Actions.push('feedback')}}>
                <View style={[styles.item, {borderBottomWidth : 1, borderBottomColor: '#C3C3C3'}]}>
                  <View style={styles.left}>
                    <Icon name="md-bug" style={{color: "#666666"}} />
                    <Text style={styles.btnText}>意见反馈</Text>
                  </View>
                  <Icon name="md-arrow-dropright" style={{color: "#666666"}} />
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback>
                <View style={styles.item}>
                  <View style={styles.left}>
                    <Icon name="md-contacts" style={{color: "#666666"}} />
                    <Text style={styles.btnText}>关于我们</Text>
                  </View>
                  <Icon name="md-arrow-dropright" style={{color: "#666666"}} />
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.wrapper}>
              <TouchableNativeFeedback>
                <View style={styles.item}>
                  <View style={styles.left}>
                    <Icon name="md-exit" style={{color: "#FE5952"}} />
                    <Text style={styles.btnText}>注销</Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
            </View>
          </Content>
        }
        <Footer>
          <FooterTab style={{backgroundColor: '#fff'}}>
            <Button vertical onPress={Actions.home}>
              <Icon name="md-flame" style={{color: '#C3C3C3'}} />
              <Text style={{color: '#C3C3C3'}}>推荐</Text>
            </Button>
            <Button vertical onPress={Actions.trend}>
              <Icon name="md-eye" style={{color: '#C3C3C3'}} />
              <Text style={{color: '#C3C3C3'}}>关注</Text>
            </Button>
            <Button vertical>
              <Icon name="md-person" style={{color: '#53BFA2'}} />
              <Text style={{color: '#53BFA2'}}>我的</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  header: {
    height: 50,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#53BFA2'
  },
  title: {
    fontSize: FontSize(16),
    color: '#fff',
    fontWeight: 'bold'
  },
  wrapper: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#676767'
  },
  unloginText: {
    fontSize: FontSize(18),
    color: '#414141'
  },
  toText: {
    fontSize: FontSize(14),
    color: '#53BFA2'
  },
  toBtn: {
    width: 70,
    height: 36,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#53BFA2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    backgroundColor: '#EBEBEB'
  },
  avatar: {
    width: 46,
    height: 46,
    marginRight: 10
  }
})