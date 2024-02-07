import { IHttpResponseInput, IHttpResponseWithData } from '../types/http-response';
const timestamp = new Date().toISOString();

export const Respond = ({ res, status, data = {} }: IHttpResponseInput) => {
  if (status === 200 || status === 201) {
    return res.status(status).json({
      data,
      success: true,
      status,
      timestamp,
    } satisfies IHttpResponseWithData);
  }
  return res.status(status).json({
    data,
    success: true,
    status,
    timestamp,
  } satisfies IHttpResponseWithData);
};
