<template>
  <div class="container">
    <div>
      <nuxt-link to="/foo">foo</nuxt-link>
      <p>{{foo}}</p>
      <p v-for="post in posts">{{post}}</p>
      <button @click="test" value="test">test</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data(){
    return {
      foo: "FOOFOO",
    posts: []
    }
  },
  methods: {
    test() {
      //@ts-ignore
      console.log(this.$server);
    }
  },
  async fetch() {
    console.log("FETCHFETCH");
    // console.log('nuxtState :>> ', nuxtState);
    //@ts-ignore
    this.posts = await this.$axios.$get('https://api.nuxtjs.dev/posts')
  },
  middleware: ["mv"],
  fetchOnServer: true,
})
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
