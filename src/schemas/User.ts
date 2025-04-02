import * as yup from 'yup';

export interface IUserLoginDto {
  email: string;
  password: string;
}

export interface IUserSignupDto {
  username: string;
  email: string;
  password: string;
}

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

export const signupSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});
