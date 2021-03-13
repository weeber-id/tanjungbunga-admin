import { Handler, withIronSession } from 'next-iron-session';

export const withSession = (handler: Handler) => {
  return withIronSession(handler, {
    password: process.env.IRON_SESSION_PASSWORD!,
    cookieName: 'next/user',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60,
    },
  });
};
