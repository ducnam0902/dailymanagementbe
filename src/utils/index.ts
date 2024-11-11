import { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  maxAge: 60 * 1000 * 60 * 60,
};

export type ResponseCreatedData = {
  ok: boolean;
};

export type ResponseOKData = {
  ok: boolean;
};
