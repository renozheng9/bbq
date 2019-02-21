import React, {
  AsyncStorage,
  Alert
} from 'react-native';

export default class DeviceStorage {
  static async saveJsonObject(key, value) {
    return await this.saveString(key, JSON.stringify(value));
  }

  static async getJsonObject(key, defaultObject) {
    let result = null;
    try {
      result = await this.getString(key, null);
      result = await JSON.parse(result);
    } catch(err) {
      if(defaultObject) {
        return Promise.resolve(defaultObject);
      } else {
        return Promise.reject(err);
      }
    }
    return result;
  }

  static async saveString(key, value) {
    if (key != null && value != null) {
      try {
         await AsyncStorage.setItem(key, value)
      } catch(err) {
        return Promise.reject(err)
      }
      return Promise.resolve(true);
    } else {
      return Promise.reject({"msg": "Key and value can not be null"});
    }
  }

  static async getString(key, defaultValue) {
    let result = null;
    let noDataError = {"msg": "No value found !"};
    if(key != null) {
      result = await AsyncStorage.getItem(key);
      return result ? result : defaultValue != null ? defaultValue : Promise.reject(noDataError);
    } else {
      if(defaultValue) {
        return Promise.resolve(defaultValue);
      } else {
        return Promise.reject(noDataError);
      }
    }
  }

  static async remove(key) {
    let result = true;
    try {
      result = await AsyncStorage.removeItem(key);
    } catch(err) {
      return Promise.reject(err)
    }
    return result;
  }

  static async getAllKeys() {
    let result = true;
    try {
      result = await AsyncStorage.getAllKeys();
    } catch(err) {
      return Promise.reject(err)
    }
    return result;
  }
}

// class DeviceStorage {
//   /**
//    * 获取
//    * @param key
//    * @returns {Promise<T>|*|Promise.<TResult>}
//    */

//   static get(key) {
//       return AsyncStorage.getItem(key).then((value) => {
//           const jsonValue = JSON.parse(value);
//           return jsonValue;
//       });
//   }


//   /**
//    * 保存
//    * @param key
//    * @param value
//    * @returns {*}
//    */
//   static save(key, value) {
//       return AsyncStorage.setItem(key, JSON.stringify(value));
//   }


//   /**
//    * 更新
//    * @param key
//    * @param value
//    * @returns {Promise<T>|Promise.<TResult>}
//    */
//   static update(key, value) {
//       return DeviceStorage.get(key).then((item) => {
//           value = typeof value === 'string' ? value : Object.assign({}, item, value);
//           return AsyncStorage.setItem(key, JSON.stringify(value));
//       });
//   }


//   /**
//    * 更新
//    * @param key
//    * @returns {*}
//    */
//   static delete(key) {
//       return AsyncStorage.removeItem(key);
//   }
// }

// export default DeviceStorage;