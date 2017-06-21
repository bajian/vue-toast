# vue-toast

#### demo

[live-demo](https://rawgit.com/bajian/vue-toast/master/dist/demo2.html)

[github](https://github.com/bajian/vue-toast)

> A Vue.js project

## DEMO Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

#### How to install from code source 
``` js
import Toast from './components/toast'

//change any config u like refer to the `toastDefaultOptions`,such as this one below:（可以在初始化的时候修改参数，参照下面的例子：）
// Toast.config({
//  // position:'top'
// })

Vue.use(Toast)
```
#### How to install from NPM
``` js
npm install vue-bajiantoast --save

install into Vue:
import Toast from 'vue-bajiantoast'
import 'vue-bajiantoast/dist/vue-bajiantoast.min.css'

Vue.use(Toast)
```

#### How to use
``` js
  methods:{
    success(){
      this.$toast.success('我是标题','大家好，我是内容O(∩_∩)O~~')
    },
    title(){
      this.$toast.success('我是标题')
    },
    config(){
      //1、这种形式只能修改一次，如果想修改参数用config()
      // this.$toast.show({
      //   icon:null,
      //   // title:'我是标题123',
      //   text:"我是内容 我没有左边的图标,我不能被关闭",
      //   showCloseBtn:false
      // })
      //2、 config():
      this.$toast.config({
        icon:null,
        showCloseBtn:false,
        position:'top'
      })
      this.$toast.error('我是标题','大家好，我是内容O(∩_∩)O~~')
      this.$toast.text('我是标题','大家好，我是内容O(∩_∩)O~~')
    },
    error(){
      this.$toast.error('我是标题','大家好，我是内容O(∩_∩)O~~')
    },
    info(){
      this.$toast.info('我是标题','大家好，我是内容O(∩_∩)O~~')
    },
    warn(){
      this.$toast.warn('我是标题','大家好，我是内容O(∩_∩)O~~')
    },
    text(){
      this.$toast.text('我是标题','大家好，我是内容O(∩_∩)O~~')
    },
  }
```
####options
``` js
//this is the dafault options (这是默认的参数) 
// var toastDefaultOptions = {
//     duration: 5000,
//     position: 'bottom',//top,bottom,center + left,right,center.such as 'top right' or 'bottom left'
//     type: 'default',
//     //filter of the same toast (避免重复提示)
//     distinct: false,
//     mobile: isMobile,
//     icon: toastDefaultIcon,
//     showCloseBtn: !isMobile,
//     //toast gap (toast的间距)
//     gap: 5
// };
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
