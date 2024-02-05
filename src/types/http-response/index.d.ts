export default interface IHttpResponse {
  title: string;
  message: string;
  success: boolean;
  status: number;
  timestamp: string;
  //   isOperational: boolean;
}

export type IAPIError = IHttpResponse;
