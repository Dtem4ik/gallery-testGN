import { useFetch } from "#app";
import { useRuntimeConfig } from "nuxt/app";

type UseFetchType = typeof useFetch;

export const useApi: UseFetchType = (path, options = {}) => {
  const config = useRuntimeConfig();
  const modifiedOptions = {
    ...options,
    headers: {
      ...options.headers,
    },
    baseURL: config.public.apiUrl,
  };

  return useFetch(path, modifiedOptions);
};
