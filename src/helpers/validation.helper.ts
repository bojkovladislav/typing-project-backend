import * as yup from 'yup';
import { FastifyReply, FastifyRequest } from 'fastify';

export const validateSchema = (schema: yup.ObjectSchema<any>) => {
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
};
