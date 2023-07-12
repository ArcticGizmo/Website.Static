import { createAuth0 } from '@auth0/auth0-vue';

export const Auth0Client = createAuth0({
  domain: "arcticgizmo.au.auth0.com",
  clientId: "78TbGawKtjkGoP4MGyWjeiuBHHtCeflc",
  authorizationParams: {
    redirect_uri: window.location.origin
  }
})