<template>
  <div id="app">
    <button @click="success()">success</button>
    <button @click="error()">error</button>
    <button @click="info()">info</button>
    <button @click="warn()">warn</button>
    <button @click="text()">default</button>
    <button @click="title()">only title</button>
    <button @click="config()">change config</button>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
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
        position:'top right'
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
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
