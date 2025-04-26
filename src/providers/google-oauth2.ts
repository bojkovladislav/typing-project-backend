import { FastifyInstance } from 'fastify';
import { OAuth2Namespace } from '@fastify/oauth2';
import { registerOAuth2Provider } from '../helpers/registerOAuthProvider.helper';

declare module 'fastify' {
  interface FastifyInstance {
    GoogleOAuth2: OAuth2Namespace;
  }
}

export function registerGoogleOAuth2Provider(server: FastifyInstance) {
  registerOAuth2Provider(server, {
    name: 'GoogleOAuth2',
    clientId: process.env.CLIENT_GOOGLE_ID!,
    clientSecret: process.env.CLIENT_GOOGLE_SECRET!,
    authorizeHost: 'https://accounts.google.com',
    authorizePath: '/o/oauth2/v2/auth',
    tokenHost: 'https://oauth2.googleapis.com',
    tokenPath: '/token',
    scope: ['email', 'profile'],
    startRedirectPath: '/oauth2/google',
    callbackUri: 'http://localhost:3000/oauth2/google/callback',
  });
}
