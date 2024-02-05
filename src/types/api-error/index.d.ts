export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}

export default interface IServerError {
  STATUS: HttpStatusCode;
  TITLE: string;
  MESSAGE: string;
  //   isOperational: boolean;
}

export type IAPIError = IServerError;
