import { FastifyReply, FastifyRequest } from 'fastify';
import { createToken, verifyToken } from 'src/helpers/auth.helper';
import { ERRORS, handleServerError } from 'src/helpers/errors.helper';

export const refreshRouter = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const token = request.cookies.refreshToken;

    if (!token) {
      throw ERRORS.invalidToken;
    }

    const payload = verifyToken(token);

    const newAccessToken = createToken(
      payload as object,
      process.env.APP_JWT_SECRET,
      '15m'
    );

    reply.setCookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60,
    });

    reply.code(200).send({ message: 'Access token refreshed' });
  } catch (error) {
    return handleServerError(reply, error);
  }
};
