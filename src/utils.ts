import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import * as JWT from 'jsonwebtoken';
import * as yup from 'yup';
import { FastifyReply, FastifyRequest } from 'fastify';

export const prisma = new PrismaClient();

export const utils = {
  isJSON: (data: string) => {
    try {
      JSON.parse(data);
    } catch (e) {
      return false;
    }
    return true;
  },

  getTime: (): number => {
    return new Date().getTime();
  },

  genSalt: (saltRounds: number, value: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) return reject(err);
        bcrypt.hash(value, salt, (err, hash) => {
          if (err) return reject(err);
          resolve(hash);
        });
      });
    });
  },

  compareHash: async (hash: string, value: string): Promise<boolean> => {
    try {
      console.log('Plain text password:', value);
      console.log('Stored hashed password:', hash);

      return await bcrypt.compare(value, hash);
    } catch (error) {
      throw new Error(`Error comparing password: ${error.message}`);
    }
  },

  healthCheck: async (): Promise<void> => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      throw new Error(`Health check failed: ${e.message}`);
    }
  },

  getTokenFromHeader: (
    authorizationHeader: string | undefined
  ): string | null => {
    if (!authorizationHeader) return null;
    const token = authorizationHeader.replace('Bearer ', '');
    return token || null;
  },

  verifyToken: (token: string): any => {
    try {
      return JWT.verify(token, process.env.APP_JWT_SECRET as string);
    } catch (err) {
      return null;
    }
  },

  validateSchema: (schema: yup.ObjectSchema<any>) => {
    return (data: any) => {
      try {
        schema.validateSync(data, { abortEarly: false });
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          throw new Error(error.errors.join(', '));
        }
        throw error;
      }
    };
  },

  preValidation: (schema: yup.ObjectSchema<any>) => {
    return (
      request: FastifyRequest,
      reply: FastifyReply,
      done: (err?: Error) => void
    ) => {
      try {
        schema.validateSync(request.body, { abortEarly: false });
        done();
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          done(new Error(error.errors.join(', ')));
        } else {
          done(error);
        }
      }
    };
  },
};
