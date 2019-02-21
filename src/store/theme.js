import { observable, action } from 'mobx';

class ThemeStore {
  @observable themeId;
  @observable themeList;
  @observable isNeedRefresh;

  constructor() {
    this.themeId = '';
    this.themeList = [];
  }

  @action.bound updateThemeId(themeId) {
    this.themeId = themeId;
  }
  @action.bound updateThemeList(themeList) {
    this.themeList = [...themeList];
  }
}

const themeStore = new ThemeStore();

export { themeStore };