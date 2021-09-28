import {defineNuxtPlugin} from "@nuxtjs/composition-api"
import rs from "jsrsasign"
import base64url from "base64url"

export default defineNuxtPlugin((ctx)=>{
  //@ts-ignore
  ctx.HOGE = "12345"


  const header = `${base64url.encode(JSON.stringify({
    "typ": "JWT",
    "kid": "df8e24c8-1894-4f88-b0a5-2078823058c7",
    "alg": "ES256",
    "iss": "https://accounts.google.com",
    "client": "283587983846-jgfbsd00l5jjt47lua0avnmpfplnnc7l.apps.googleusercontent.com",
    "signer": "arn:aws:elasticloadbalancing:ap-northeast-1:413815580661:loadbalancer/app/endpoint-tamaritamari-click/ccbd5f8a4a3ebb4f",
    "exp": 1632839298
  }))}`
  const payload = `${base64url.encode(JSON.stringify({
    "sub": "115734269471686574578",
    "picture": "https://lh3.googleusercontent.com/a-/AOh14GiC0bKQBths8LAdg6agav0laW7LKNSIZtFp-x-EUfY=s96-c",
    "exp": 1632839298,
    "iss": "https://accounts.google.com"
  }))}`

  const sign = rs.KJUR.jws.JWS.sign(null, {alg: "ES256"}, `${header}.${payload}` , `-----BEGIN PRIVATE KEY-----
  MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgevZzL1gdAFr88hb2
  OF/2NxApJCzGCEDdfSp6VQO30hyhRANCAAQRWz+jn65BtOMvdyHKcvjBeBSDZH2r
  1RTwjmYSi9R/zpBnuQ4EiMnCqfMPWiZqB4QdbAd0E7oH50VpuZ1P087G
  -----END PRIVATE KEY-----`)

  //@ts-ignore
  ctx.req.headers["x-amzn-oidc-data"] = `${header}.${payload}.${sign}`
  console.log('`${header}.${payload}.${sign}` :>> ', `${header}.${payload}.${sign}`);
  //@ts-ignore
  ctx.req.headers["x-amzn-oidc-accesstoken"] = `dummy`
})