import Toast from './toast';
import './toast.css';

const install = function(Vue) {
  Vue.prototype.$toast = Toast
};

if (window.Vue) {
  window.Toast = Toast;
  Vue.use(install); // eslint-disable-line
}

Toast.install = install;
export default Toast;//Vue.use(Toast)调用插件
