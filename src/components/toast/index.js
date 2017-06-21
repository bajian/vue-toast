// let Toast=require('./toast');
import Toast from './toast.js';
import './toast.css';

const install = function(Vue) {
  Vue.prototype.$toast = Toast
};
if (window && window.Vue) {
  window.Toast = Toast;
  Vue.use(install); // eslint-disable-line
}
let i=Toast
if (Toast.$toast)
	i=Toast.$toast
i.install = install;
export default i