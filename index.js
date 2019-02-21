import { AppRegistry } from 'react-native';
import setup from './src/setup';
import { YellowBox } from 'react-native';
// import applyDecoratedDescriptor from '@babel/runtime/helpers/esm/applyDecoratedDescriptor';

// import initializerDefineProperty from '@babel/runtime/helpers/esm/initializerDefineProperty';

// Object.assign(babelHelpers, { applyDecoratedDescriptor, initializerDefineProperty });

//YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

YellowBox.ignoreWarnings(['Require cycle:']);

AppRegistry.registerComponent('BBQ', () => setup());
