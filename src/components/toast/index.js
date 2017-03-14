let Toast=require('./toast');
import './toast.css';

const install = function(Vue) {
  Vue.prototype.$toast = Toast
};
if (window && window.Vue) {
  window.Toast = Toast;
  Vue.use(install); // eslint-disable-line
}
if (Toast.$toast)
	Toast=Toast.$toast
Toast.install = install;
export default Toast