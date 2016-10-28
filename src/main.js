import Vue from 'vue'
import App from './App'
import Toast from './components/toast'

//this is the dafault options (这是默认的参数) 
// var toastDefaultOptions = {
//     duration: 5000,
//     position: 'bottom',
//     type: 'default',
//     //filter of the same toast (避免重复提示)
//     distinct: false,
//     mobile: isMobile,
//     icon: toastDefaultIcon,
//     showCloseBtn: !isMobile,
//     //toast gap (toast的间距)
//     gap: 5
// };


// Toast.config({//change any config u like refer to the defaultoptions,such as this one below（//可以在初始化的时候修改参数，参照下面的例子：）
// 	// position:'top'
// })
Vue.use(Toast)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
