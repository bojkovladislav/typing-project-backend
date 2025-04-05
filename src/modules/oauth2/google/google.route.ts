import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';

export function googleOAuth2Routes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  server.get(
    '/google/callback',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { token } =
        await server.GoogleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          request
        );

      reply.redirect(
        `http://localhost:5173/?access_token=${token.access_token}`
      );
    }
  );

  done();
}
