import fastify from 'fastify';
import userRouter from './routes/user.router';
import loadConfig from './config/env.config';
import { utils } from './utils';
import formbody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import { registerGoogleOAuth2Provider } from './providers/google-oauth2';
import { registerCorsProvider } from './providers/cors';
import { googleOAuth2Routes } from './modules/oauth2/google/google.route';
import { githubOAuth2Routes } from './modules/oauth2/github/github.route';
import { registerGitHubOAuth2Provider } from './providers/github-oauth2';
import { AppError } from './helpers/errors.helper';
import { refreshRouter } from './routes/refresh.router';
// import fastifyCookie from '@fastify/cookie';

loadConfig();

const port = Number(process.env.API_PORT) || 5001;
const host = String(process.env.API_HOST);

const startServer = async () => {
  const server = fastify({
    logger: {
      level: process.env.LOG_LEVEL,
      transport: {
        target: 'pino-pretty',
      },
    },
  });

  registerGoogleOAuth2Provider(server);
  registerGitHubOAuth2Provider(server);
  registerCorsProvider(server);

  server.register(formbody);
  server.register(googleOAuth2Routes, { prefix: '/oauth2' });
  server.register(githubOAuth2Routes, { prefix: '/oauth2' });
  server.register(helmet);
  // server.register(fastifyCookie, {
  //   secret: process.env.COOKIE_SECRET,
  // });

  server.register(userRouter, { prefix: '/api/user' });

  // server.register(refreshRouter, { prefix: '/app/user/refresh-token' });

  server.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ message: error.message });
    }

    console.error('Unexpected error:', error);
    return reply.status(500).send({ message: 'Internal Server Error' });
  });

  server.get('/health', async (_request, reply) => {
    try {
      await utils.healthCheck();
      reply.status(200).send({
        message: 'Health check endpoint success.',
      });
    } catch (e) {
      reply.status(500).send({
        message: 'Health check endpoint failed.',
      });
    }
  });

  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      try {
        await server.close();
        server.log.error(`Closed application on ${signal}`);
        process.exit(0);
      } catch (err) {
        server.log.error(`Error closing application on ${signal}`, err);
        process.exit(1);
      }
    });
  });

  try {
    await server.listen({
      port,
      host,
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();
