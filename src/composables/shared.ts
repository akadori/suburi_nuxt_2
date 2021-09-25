import {inject} from "@nuxtjs/composition-api"

export const useSharedState = () => {
  const token = inject("accessToken") as string;
  // const token = "TOKEN"
  return { token }
}