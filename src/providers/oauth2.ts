import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import OAuth2, { OAuth2Namespace } from '@fastify/oauth2';

declare module 'fastify' {
  interface FastifyInstance {
    GoogleOAuth2: OAuth2Namespace;
  }
}

const googleOAuth2Options = {
  // Namespace
  name: 'GoogleOAuth2',
  // Scopes
  scope: ['profile', 'email'],
  credentials: {
    client: {
      id: '', // get from .env file
      secret: '', // get from .env file
    },
    auth: OAuth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: '/oauth2/google',
  callbackUri: `http://localhost:3000/oauth2/google/callback`,
  generateStateFunction: (request: FastifyRequest, reply: FastifyReply) => {
    // @ts-ignore
    return request.query.state;
  },
  checkStateFunction: (request: FastifyRequest, callback: any) => {
    // @ts-ignore
    if (request.query.state) {
      callback();
      return;
    }
    callback(new Error('Invalid state'));
  },
};

export function registerGoogleOAuth2Provider(server: FastifyInstance) {
  server.register(OAuth2, googleOAuth2Options);
}
