import { IAPIError } from '../types/api-error';

const ACCOUNT_ERROR = {
  ACCOUNT_ALREADY_EXISTS: {
    STATUS: 400,
    TITLE: 'ACCOUNT_ALREADY_EXISTS',
    MESSAGE: 'An account with the same user ID and account type already exists.',
  },
  ACCOUNT_NOT_FOUND: {
    STATUS: 404,
    TITLE: 'ACCOUNT_NOT_FOUND',
    MESSAGE: 'The account does not exist.',
  },
} satisfies {
  [error: string]: IAPIError;
};

export default ACCOUNT_ERROR;
