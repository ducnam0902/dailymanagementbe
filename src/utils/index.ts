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

export enum NoteType {
  ACTIVITIES = 'ACTIVITIES',
  DEVELOPMENT = 'DEVELOPMENT',
  NEWROUTINE = 'NEWROUTINE',
  PLANNING = 'PLANNING',
  SHOPPING = 'SHOPPING',
  OTHER = 'OTHER'
}