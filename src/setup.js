import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import App from './App';
import store from './store';

export default function setup() {
  class Root extends Component {
    render() {
      return(
        <Provider {...store}>
          <App />
        </Provider>
      )
    }
  }
  return Root;
}