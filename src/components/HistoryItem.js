import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Text } from 'native-base';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import { inject, observer } from 'mobx-react';

@inject(["globalStore"])
@observer
export default class HistoryItem extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  clear = () => {
    this.props.onClearHistory(this.props.date);
  }

  render() {
    return (
      <View style={styles.searchItem}>
        <Text style={styles.itemText}>{this.props.item}</Text>
        <Text style={styles.itemText} onPress={this.clear}>X</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
    borderBottomColor: '#AEAEAE',
    borderBottomWidth: 1,
    paddingBottom: 2
  },
  itemText: {
    color: '#666666',
    fontSize: FontSize(13)
  },
})