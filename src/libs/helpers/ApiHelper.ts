/* eslint-disable @typescript-eslint/no-explicit-any */
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler, Context } from 'aws-lambda';
import { Connection, createConnection } from './databaseHelper';
import { middify } from './middyHelper';

export const baseHandler = (handler: ApiHandler<any, any>, apiOptions: ApiOptions) => {
  const middyHandler = async (event: ParsedProxyEvent<any>, context: Context) => {
    let connection: Connection | undefined;
    try {
      connection = await createConnection();
      return jsonRes(await handler(event, connection, context));
    } finally {
      if (connection) await connection.end();
    }
  };
  return middify(middyHandler, apiOptions.reqSchema, apiOptions.resSchema);
};

export const jsonRes = (response?: Record<string, unknown>): ApiResponse => {
  return {
    statusCode: 200,
    body: response ?? 'OK',
  };
};

type ParsedProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: S;
};
export type ApiEvent<S> = Handler<ParsedProxyEvent<S>, APIGatewayProxyResult>;

export type ApiHandler<S, R> = (
  event: ParsedProxyEvent<S>,
  connection: Connection,
  context: Context
) => Promise<R> | R;
export interface ApiResponse {
  statusCode: number;
  body: any;
}

export interface ApiOptions {
  reqSchema?: any;
  resSchema?: any;
}
