/* eslint-disable @typescript-eslint/no-explicit-any */
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler, Context } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';
import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { Connection } from 'mysql2/promise';
import { createConnection } from './DatabaseHelper';
import exceptions, { ApiError } from '@libs/enums/exceptions';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};
export type ApiEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;
export type ApiHandler<S> = (
  event: ValidatedAPIGatewayProxyEvent<S>,
  connection: Connection,
  context: Context
) => Promise<ApiResponse> | ApiResponse;
export interface ApiResponse {
  statusCode: number;
  body: string;
}

export const baseHandler = (
  handler: ApiHandler<any>
): middy.Middy<ValidatedAPIGatewayProxyEvent<any>, ApiResponse, Context> => {
  const middyHandler = async (event: ValidatedAPIGatewayProxyEvent<any>, context: Context) => {
    console.debug(`EVENT: ${JSON.stringify(event, null, 2)}`);
    let connection;
    try {
      console.log(process.env);
      connection = await createConnection();
      return await handler(event, connection, context);
    } catch (err) {
      return handleErrors(err);
    } finally {
      if (connection) connection.end();
      console.info('API処理終了:', event.path);
    }
  };
  return middy(middyHandler).use(middyJsonBodyParser());
};

export const jsonRes = (response: Record<string, unknown>): ApiResponse => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};

function handleErrors(err: Error) {
  let e: ApiError;
  if (err instanceof ApiError) {
    if (err == exceptions.server.internalError) console.error(err);
    else console.info(err);
    e = err;
  } else {
    console.error(err);
    e = exceptions.server.internalError;
  }
  return e.getResponse();
}
