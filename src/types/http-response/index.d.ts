import { Response } from 'express';

export interface IHttpResponse {
  title: string;
  message: string;
  success: boolean;
  status: number;
  timestamp: string;
  //   isOperational: boolean;
}

export interface IHttpResponseInput {
  res: Response;

  status: number;

  data: Record<string, string>;
}

export interface IHttpResponseWithData {
  data: Record<string, string>;
  success: boolean;
  status: number;
  timestamp: string;
}

export type IHttpResponse = IHttpResponse;
