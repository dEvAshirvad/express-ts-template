export interface IHttpResponse {
  title: string;
  message: string;
  success: boolean;
  status: number;
  timestamp: string;
  //   isOperational: boolean;
}

export interface IHttpResponseWithData {
  title: string;
  message: string;
  data: Record<string, string>;
  success: boolean;
  status: number;
  timestamp: string;
}

export type IHttpResponse = IHttpResponse;
