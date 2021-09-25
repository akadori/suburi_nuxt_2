// import { Plugin } from "@nuxt/types"

// const plugin: Plugin = (context, inject) => {
// }

// export default plugin

import { onGlobalSetup, provide, defineNuxtPlugin } from '@nuxtjs/composition-api'

export default defineNuxtPlugin((ctx, inject) => {
  if(process.server) {
    console.log('ctx.req.headers :>> ', ctx.req.headers);
    // const {req, nuxtState} = ctx
    // nuxtState.headers = req.headers
    const {beforeNuxtRender} = ctx
    beforeNuxtRender(({Components, nuxtState}) => {
      nuxtState.headers = ctx.req.headers
    })
    onGlobalSetup(() => {
      console.log("ONGLOBALSETUP");
      provide('globalKey', true)
      provide("accessToken", ctx.req.headers)
    })
  }else{
    const {nuxtState} = ctx
    console.log('nuxtState :>> ', nuxtState);
    onGlobalSetup(() => {
      console.log("ONGLOBALSETUP CLIENT");
      provide('globalKey', true)
      provide("accessToken", nuxtState.headers)
    }) 
  }
})