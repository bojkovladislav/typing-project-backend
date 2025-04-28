import { utils } from '../utils';
import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../utils';
import * as JWT from 'jsonwebtoken';
import { ERRORS } from './errors.helper';

export const checkValidRequest = (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const token = utils.getTokenFromHeader(request.headers.authorization);
  if (!token) {
    return reply
      .code(ERRORS.unauthorizedAccess.statusCode)
      .send(ERRORS.unauthorizedAccess.message);
  }

  const decoded = utils.verifyToken(token);
  if (!decoded) {
    return reply
      .code(ERRORS.unauthorizedAccess.statusCode)
      .send(ERRORS.unauthorizedAccess.message);
  }
};

export const checkValidUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const token = utils.getTokenFromHeader(request.headers.authorization);
  if (!token) {
    return reply
      .code(ERRORS.unauthorizedAccess.statusCode)
      .send(ERRORS.unauthorizedAccess.message);
  }

  const decoded = utils.verifyToken(token);
  if (!decoded || !decoded.id) {
    return reply
      .code(ERRORS.unauthorizedAccess.statusCode)
      .send(ERRORS.unauthorizedAccess.message);
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!userData) {
      return reply
        .code(ERRORS.unauthorizedAccess.statusCode)
        .send(ERRORS.unauthorizedAccess.message);
    }

    request['authUser'] = userData;
  } catch (e) {
    return reply
      .code(ERRORS.unauthorizedAccess.statusCode)
      .send(ERRORS.unauthorizedAccess.message);
  }
};

export const createToken = <T extends object>(
  credentials: T,
  secret: string,
  expiresIn: string
) => {
  return JWT.sign({ ...credentials }, secret, { expiresIn });
};

export const verifyToken = (token: string) => {
  return JWT.verify(token, process.env.APP_JWT_REFRESH_SECRET as string);
};
