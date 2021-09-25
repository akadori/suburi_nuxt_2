import { Middleware } from "@nuxt/types"
import {onGlobalSetup, provide} from "@nuxtjs/composition-api"

const mw: Middleware = (context, next) => {
  onGlobalSetup(() => {
    console.log("ONGLOBALSETUP");
  })
  console.log("middleware calleddddddddddd!!!!!!!!!!!!!!!");
  const {
    app,
    store,
    route,
    params,
    query,
    env,
    isDev,
    isHMR,
    redirect,
    error,
    $config
  } = context
  // console.log(`app: ${app}`)
  // console.log(`store: ${store}`)
  // console.log(`route: ${route}`)
  // console.log(`params: ${params}`)
  // console.log(`query: ${query}`)
  // console.log(`env: ${env}`)
  // console.log(`isDev: ${isDev}`)
  // console.log(`isHMR: ${isHMR}`)
  // console.log(`redirect: ${redirect}`)
  // console.log(`error: ${error}`)
  // console.log('$config :>> ', $config);

  // Only available on the Server-side
  if (process.server) {
    const { req, res, beforeNuxtRender } = context
    beforeNuxtRender(({Components, nuxtState}) => {
      nuxtState.foo = "FOOOOOOOOOOOOOOOOo"
    })
  }

  // Only available on the Client-side
  if (process.client) {
    const { from, nuxtState } = context
    console.log('nuxtState.foo :>> ', nuxtState.foo);
  }
  next()
}

export default mw