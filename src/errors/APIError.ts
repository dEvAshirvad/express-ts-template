import { HttpStatusCode, IAPIError } from '../types/api-error';
import { IHttpResponse } from '../types/http-response';
const timestamp = new Date().toISOString();

export class APIError extends Error {
  statusCode: HttpStatusCode;
  message: string;
  title: string;
  success: boolean;
  isOperational: boolean;

  constructor(option: IAPIError) {
    super(option.MESSAGE);
    Object.setPrototypeOf(this, APIError.prototype);
    this.title = option.TITLE;
    this.message = option.MESSAGE;
    this.statusCode = option.STATUS;
    (this.success = false), (this.isOperational = true);
  }

  serializeError() {
    return {
      title: this.title,
      message: this.message,
      success: this.success,
      status: this.statusCode,
      timestamp: timestamp,
    } satisfies IHttpResponse;
  }

  toString() {
    return 'APIError: ' + this.statusCode + ' - ' + this.title + ' - ' + this.message + '\n';
  }
}
