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
        console.log('xAmazonOidcData :>> ', xAmazonOidcData);
        console.log('xAmazonOidcAccessToken :>> ', xAmazonOidcAccessToken);
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
