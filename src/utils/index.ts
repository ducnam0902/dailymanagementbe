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

export const weekdays = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};
