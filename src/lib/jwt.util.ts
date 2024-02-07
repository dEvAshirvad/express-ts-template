import jwt from 'jsonwebtoken';

// sign jwt
export function signJWT(payload: object, expiresIn: string | number, secret: string) {
  return jwt.sign(payload, secret, { expiresIn });
}

// verify jwt
export function verifyJWT(token: string, secret: string) {
  try {
    const decoded = jwt.verify(token, secret);
    return { payload: decoded, expired: false };
  } catch (error) {
    return { payload: null, expired: true };
  }
}
