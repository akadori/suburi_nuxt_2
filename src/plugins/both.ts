import { onGlobalSetup, provide, defineNuxtPlugin } from "@nuxtjs/composition-api"
import rs from "jsrsasign"
import { NuxtAxiosInstance } from "@nuxtjs/axios"
import { XAmazonOidcDataKey, xAmazonOidcAccessTokenKey } from "../composables/shared"
interface IncomingHttpHeaders {
    "x-amzn-oidc-data": string
    "x-amzn-oidc-accesstoken": string
}
/**
 * ALBが追加したRequest Headerからアクセストークンとユーザークレームを取り出し、
 * global stateに追加する。
 * なお、ALBからの送信であることを検証するため、署名の検証も行う。
 */
export default defineNuxtPlugin(async (ctx) => {
    if (process.server) {
        let { "x-amzn-oidc-data": xAmazonOidcData, "x-amzn-oidc-accesstoken": xAmazonOidcAccessToken } = ctx.req.headers as typeof ctx.req.headers & IncomingHttpHeaders
        xAmazonOidcData="eyJ0eXAiOiJKV1QiLCJraWQiOiJkZjhlMjRjOC0xODk0LTRmODgtYjBhNS0yMDc4ODIzMDU4YzciLCJhbGciOiJFUzI1NiIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImNsaWVudCI6IjI4MzU4Nzk4Mzg0Ni1qZ2Zic2QwMGw1amp0NDdsdWEwYXZubXBmcGxubmM3bC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInNpZ25lciI6ImFybjphd3M6ZWxhc3RpY2xvYWRiYWxhbmNpbmc6YXAtbm9ydGhlYXN0LTE6NDEzODE1NTgwNjYxOmxvYWRiYWxhbmNlci9hcHAvZW5kcG9pbnQtdGFtYXJpdGFtYXJpLWNsaWNrL2NjYmQ1ZjhhNGEzZWJiNGYiLCJleHAiOjE2MzI4MzkyOTh9.eyJzdWIiOiIxMTU3MzQyNjk0NzE2ODY1NzQ1NzgiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2lDMGJLUUJ0aHM4TEFkZzZhZ2F2MGxhVzdMS05TSVp0RnAteC1FVWZZPXM5Ni1jIiwiZXhwIjoxNjMyODM5Mjk4LCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20ifQ==._k6JN40GxBT3zKJeoAH9wudjpJFS-4DylfhpgdfBcTD6rwC5V9yh9SyppiCZYKJRsXjM5OpObRyP6VHTvuuRKQ=="
        const isTokenValid = await verifyToken(xAmazonOidcData, ctx.$axios)

        if (!isTokenValid) {
            throw new Error("失敗")
        }

        ctx.beforeNuxtRender(({ nuxtState }) => {
            nuxtState.xAmazonOidcData = xAmazonOidcData
            nuxtState.xAmazonOidcAccessToken = xAmazonOidcAccessToken
        })
        onGlobalSetup(() => {
            provide(XAmazonOidcDataKey, xAmazonOidcData)
            provide(xAmazonOidcAccessTokenKey, xAmazonOidcAccessToken)
        })
    } else {
        onGlobalSetup(() => {
            provide(XAmazonOidcDataKey, ctx.nuxtState.xAmazonOidcData)
            provide(xAmazonOidcAccessTokenKey, ctx.nuxtState.xAmazonOidcAccessToken)
        })
    }
})

const verifyToken = async (token: string, axios: NuxtAxiosInstance) => {
    try {
        const decodedJwt = rs.KJUR.jws.JWS.parse(token) as rs.KJUR.jws.JWS.JWSResult & { headerObj: { kid: string } }
        const kid = decodedJwt.headerObj.kid
        // ```
        // クレームに基づいて認証を行う前に、署名を検証することもお勧めします。
        // パブリックキーを取得するには、JWT ヘッダーからキー ID を取得し、それを使用して次のリージョンエンドポイントからパブリックキーを検索します。
        // > https://public-keys.auth.elb.region.amazonaws.com/key-id
        // ```
        // https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/listener-authenticate-users.html
        const pubKey = await axios.$get<string>(`https://public-keys.auth.elb.ap-northeast-1.amazonaws.com/${kid}`)
        const isValid = rs.KJUR.jws.JWS.verify(token, pubKey as any as string, ["ES256"])
        return isValid
    } catch (e) {
        console.error(e)
        throw new Error("認証が取得できませんでした。")
    }
}
