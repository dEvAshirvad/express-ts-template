import { IAPIError } from '../types/api-error';

const MONGO_ERRORS: { [error: string]: IAPIError } = {
  DUPLICATE_KEY_ERROR: {
    STATUS: 400,
    TITLE: 'DUPLICATE_KEY_ERROR',
    MESSAGE: 'A document with the same unique key already exists.',
  },
  INTERNAL_SERVER_ERROR: {
    STATUS: 500,
    TITLE: 'INTERNAL_SERVER_ERROR',
    MESSAGE: 'An internal server error occurred while processing the request.',
  },
  // Add more MongoDB error types as needed...
};

export default MONGO_ERRORS;
