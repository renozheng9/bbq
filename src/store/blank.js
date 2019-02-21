import { observable, action } from 'mobx';

class BlankStore {
  @observable text;
  @observable num;
  @observable theme;
  @observable imgUrl;

  constructor() {
    this.text = '';
    this.num = 12;
    this.theme = [];
    this.imgUrl = '';
  }

  @action.bound getData(arr) {
    this.theme = [].concat(arr);
  }

  @action.bound changeUrl(url) {
    this.imgUrl = url;
  }

  @action.bound changeText(text) {
    this.text = text;
  }
}

const blankStore = new BlankStore();

export { blankStore };