<template>
<div>
  <!-- <h1>{{header}}</h1> -->
  <p>FOO</p>
  <p>token {{ token }}</p>
  <nuxt-link to="/">top</nuxt-link>
</div>
</template>


<script lang="ts">
import {defineComponent} from "@nuxtjs/composition-api"
import { useSharedState } from "../composables/shared"

export default defineComponent({
  setup(){
    const {token} = useSharedState()
    return {
      token
    }
  }
})
</script>
