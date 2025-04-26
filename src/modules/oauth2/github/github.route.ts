import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';

export function githubOAuth2Routes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  server.get(
    '/github/callback',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { token } =
        await server.GitHubOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          request
        );

      reply.redirect(
        `http://localhost:5173/authorize/?github_access_token=${token.access_token}`
      );
    }
  );

  done();
}
