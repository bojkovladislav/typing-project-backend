import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import OAuth2, { FastifyOAuth2Options, OAuth2Namespace } from '@fastify/oauth2';

export interface OAuthProviderOptions {
  name: string;
  clientId: string;
  clientSecret: string;
  authorizeHost: string;
  authorizePath: string;
  tokenHost: string;
  tokenPath: string;
  scope: string[];
  startRedirectPath: string;
  callbackUri: string;
}

export function registerOAuth2Provider(
  server: FastifyInstance,
  options: OAuthProviderOptions
) {
  const oauth2Options: FastifyOAuth2Options = {
    name: options.name,
    scope: options.scope,
    credentials: {
      client: {
        id: options.clientId,
        secret: options.clientSecret,
      },
      auth: {
        authorizeHost: options.authorizeHost,
        authorizePath: options.authorizePath,
        tokenHost: options.tokenHost,
        tokenPath: options.tokenPath,
      },
    },
    startRedirectPath: options.startRedirectPath,
    callbackUri: options.callbackUri,
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

  server.register(OAuth2, oauth2Options);
}
