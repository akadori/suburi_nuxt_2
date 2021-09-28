import {InjectionKey, inject} from "@nuxtjs/composition-api"

export const XAmazonOidcDataKey: InjectionKey<string> = Symbol("XAmazonOidcDataKey")
export const xAmazonOidcAccessTokenKey: InjectionKey<string> = Symbol("xAmazonOidcAccessTokenKey")

export const useShared = () => {
  const data = inject(XAmazonOidcDataKey)
  const token = inject(xAmazonOidcAccessTokenKey)

  return {data, token}
}