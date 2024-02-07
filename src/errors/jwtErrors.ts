// File: jwt-errors.ts

import { IAPIError } from '../types/api-error';

const JWT_ERRORS: { [error: string]: IAPIError } = {
  JWT_INVALID: {
    STATUS: 401,
    TITLE: 'JWT_INVALID',
    MESSAGE: 'Invalid JWT token.',
  },
  JWT_EXPIRED: {
    STATUS: 401,
    TITLE: 'JWT_EXPIRED',
    MESSAGE: 'JWT token has expired.',
  },
  JWT_VERIFICATION_FAILED: {
    STATUS: 500,
    TITLE: 'JWT_VERIFICATION_FAILED',
    MESSAGE: 'JWT verification failed.',
  },
};

export default JWT_ERRORS;
