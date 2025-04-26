import { OAuth2Namespace } from '@fastify/oauth2';
import { FastifyInstance } from 'fastify';
import { registerOAuth2Provider } from '../helpers/registerOAuthProvider.helper';

declare module 'fastify' {
  interface FastifyInstance {
    GitHubOAuth2: OAuth2Namespace;
  }
}

export function registerGitHubOAuth2Provider(server: FastifyInstance) {
  registerOAuth2Provider(server, {
    name: 'GitHubOAuth2',
    clientId: process.env.CLIENT_GITHUB_ID!,
    clientSecret: process.env.CLIENT_GITHUB_SECRET!,
    authorizeHost: 'https://github.com',
    authorizePath: '/login/oauth/authorize',
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    scope: ['user:email'],
    startRedirectPath: '/oauth2/github',
    callbackUri: 'http://localhost:3000/oauth2/github/callback',
  });
}
