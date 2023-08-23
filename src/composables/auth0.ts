import { createAuth0 } from '@auth0/auth0-vue';

const scopes = [
  'openid',
  'profile',
  'email',
  'offline_access',
  // users and IAM
  'manage:users',
  // library
  'read:library',
  'write:library',
];

export const Auth0Client = createAuth0({
  domain: import.meta.env['VITE_AUTH0__DOMAIN'],
  clientId: import.meta.env['VITE_AUTH0__CLIENT_ID'],
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: import.meta.env['VITE_AUTH0__AUDIENCE'],
    organization: import.meta.env['VITE_AUTH0__ORG_ID'],
    scope: scopes.join(' '),
    prompt: 'select_account',
  },
});

export const useAuth = () => {
  return {
    login: Auth0Client.loginWithRedirect,
    logout: Auth0Client.logout,
    isAuthenticated: Auth0Client.isAuthenticated,
    isLoading: Auth0Client.isLoading,
    user: Auth0Client.user,
    getAccessToken: Auth0Client.getAccessTokenSilently,
  };
};
