import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  ViewPagerAndroid,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Image,
  Text
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Thumbnail } from 'native-base';
import { bold } from 'ansi-colors';
import axios from 'axios';
import { observer, inject } from 'mobx-react';

@inject(["personalStore"])
@observer
export default class EditInfo extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.personalStore;
  }
  componentDidMount() {
  }
  render() {
    return (
      <Container>
        {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)}
        <Header
          androidStatusBarColor="#53BFA2"
          style={{height: 80, justifyContent:'center', backgroundColor: '#53BFA2'}}
        >
          <TouchableWithoutFeedback>
            <Icon name="ios-arrow-back" style={{color: '#fff', fontSize: 20}} />
          </TouchableWithoutFeedback>
        </Header>
        <Content style={{backgroundColor: '#EBEBEB'}}>

        </Content>
        {/* <Footer>
          <FooterTab style={{backgroundColor: '#fff'}}>
            <Button vertical>
              <Icon name="md-flame" style={{color: '#C3C3C3'}} />
              <Text style={{color: '#C3C3C3'}}>推荐</Text>
            </Button>
            <Button vertical>
              <Icon name="md-eye" style={{color: '#C3C3C3'}} />
              <Text style={{color: '#C3C3C3'}}>关注</Text>
            </Button>
            <Button vertical>
              <Icon name="md-person" style={{color: '#53BFA2'}} />
              <Text style={{color: '#53BFA2'}}>我的</Text>
            </Button>
          </FooterTab>
        </Footer> */}
      </Container>
    );
  }
}
const styles = StyleSheet.create({

})