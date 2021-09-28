<template>
<div>
  <!-- <h1>{{header}}</h1> -->
  <p>FOO</p>
  <p>token {{ token }}</p>
  <p>data {{ data }}</p>
  <nuxt-link to="/">top</nuxt-link>
</div>
</template>


<script lang="ts">
import {defineComponent} from "@nuxtjs/composition-api"
import { useShared } from "../composables/shared"

export default defineComponent({
  setup(){
    const {token, data} = useShared()
    return {
      token, data
    }
  }
})
</script>
