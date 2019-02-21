import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
} from 'react-native';
import ListItem from './ListItem';

export default class Trends extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.themeWrapper}>
          <Text style={styles.themeTitle}>热门主题</Text>
          <FlatList
            horizontal={true}
            ItemSeparatorComponent={() => {return (<View style={{ width: 20, backgroundColor: '#fff' }}></View>)}}
            data={[{source: '../images/person.png', username: '武理周杰伦', key: 'item1'},{source: 'search', username: '武理周杰伦', key: 'item2'},{source: 'search', username: '武理周杰伦', key: 'item3'},{source: 'search', username: '武理周杰伦', key: 'item4'},{source: 'search', username: '武理周杰伦', key: 'item5'},{source: 'search', username: '武理周杰伦', key: 'item6'}]}
            renderItem={({item, separators}) => (
              <ImageBackground style={styles.itemWrapper} source={require("../images/person.png")}>
                <View style={styles.themeBlank}></View>
                <Text style={styles.themeText}>主题</Text>
              </ImageBackground>
            )}
          />
        </View>
        <View style={styles.trendsWrapper}>
          <FlatList
            ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
            data={[{source: '../images/person.png', username: '武理周杰伦', key: 'item1'},{source: 'search', username: '武理周杰伦', key: 'item2'},{source: 'search', username: '武理周杰伦', key: 'item3'},{source: 'search', username: '武理周杰伦', key: 'item4'},{source: 'search', username: '武理周杰伦', key: 'item5'},{source: 'search', username: '武理周杰伦', key: 'item6'}]}
            renderItem={({item, separators}) => (
              <ListItem item={item} isShow={true} />
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  themeWrapper: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#AEAEAE'
  },
  themeTitle: {
    marginBottom: 12,
    fontSize: 20,
    color: '#404040',
    fontWeight: 'bold'
  },
  itemWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden'
  },
  themeText: {
    width: 60,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: '#fff',
  },
  themeBlank: {
    width: 100,
    height: 100,
    position: 'absolute',
    backgroundColor: 'black',
    opacity: 0.4
  },
  trendsWrapper: {
    flex: 1,
    padding: 10
  }
})