import { NextApiResponse } from 'next';

export const sendResponse = (
  res: NextApiResponse,
  statusCode: number,
  success: boolean,
  data: any = null,
  message: string = ''
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export const sendError = (res: NextApiResponse, statusCode: number, message: string) => {
  return sendResponse(res, statusCode, false, null, message);
};

export const sendSuccess = (res: NextApiResponse, data: any, message: string = 'Success') => {
  return sendResponse(res, 200, true, data, message);
};
