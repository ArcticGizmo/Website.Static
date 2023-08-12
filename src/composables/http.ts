import wretch, { FetchLike, WretchOptions, WretchResponseChain } from 'wretch';
import FormDataAddon from 'wretch/addons/formData';
import QueryStringAddon from 'wretch/addons/queryString';

import { useAuth } from '@/composables/auth0';
import { useToast } from 'vue-toast-notification';

const BASE_URL = import.meta.env['VITE_API_URL'];

setTimeout(() => {
  console.log(`Connecting to API at ${BASE_URL}`);
}, 1500);

const toast = useToast({ position: 'top' });

const authMiddleware = (next: FetchLike) => async (url: string, opts: WretchOptions) => {
  const token = await useAuth().getAccessToken();
  if (token) {
    return next(url, {
      ...opts,
      headers: {
        ...(opts.headers || {}),
        Authorization: 'Bearer ' + token,
      },
    });
  }
  return next(url, opts);
};

const wretchClient = wretch()
  .addon(FormDataAddon)
  .addon(QueryStringAddon)
  .resolve(resolver =>
    resolver
      .badRequest(() => {
        toast.warning('400: Bad Request');
      })
      .unauthorized(() => {
        toast.error('401: Unauthenticated');
      })
      .forbidden(() => {
        toast.error('403: Unauthorized');
      })
      .notFound(() => {
        toast.warning('404: Not Found');
      }),
  );

export function useHttp() {
  const httpClient = wretchClient.middlewares([authMiddleware]);

  const http = (url: string) => httpClient.url(`${BASE_URL}${url}`);

  return { http };
}

export function useAnonymousHttp() {
  const http = (url: string) => wretchClient.url(`${BASE_URL}${url}`);

  return { http };
}

export type WretchFunction = ReturnType<typeof useHttp>['http'];
export type WretcherResponse = WretchResponseChain<
  typeof FormDataAddon & typeof QueryStringAddon,
  unknown,
  undefined
> &
  Promise<unknown>;
