/* eslint-disable @typescript-eslint/no-explicit-any */
import exceptions, { ApiError, errorSchema } from '@libs/enums/exceptions';
import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import middyValidator from '@middy/validator';

export function middify(handler: any, reqSchema: any, resSchema: any) {
  return middy(handler)
    .use(errorHandler)
    .use(cors)
    .use(eventLogger)
    .use(middyJsonBodyParser())
    .use(responseSerializer)
    .use(
      middyValidator({
        inputSchema: buildInputSchema(reqSchema),
        outputSchema: buildOutputSchema(resSchema),
        ajvOptions: {
          coerceTypes: false,
        },
      })
    );
}

function buildInputSchema(reqSchema: any) {
  return {
    type: 'object',
    properties: {
      body: reqSchema,
    },
  };
}

function buildOutputSchema(resSchema: any) {
  return {
    type: 'object',
    properties: {
      body: {
        anyOf: [resSchema, errorSchema],
      },
    },
  };
}

const responseSerializer: middy.MiddlewareObj = {
  after: serializeResponseBody,
  onError: serializeResponseBody,
};

function serializeResponseBody(handler: any) {
  handler.response.body = JSON.stringify(handler.response.body);
}

const errorHandler: middy.MiddlewareObj = {
  onError: handler => {
    const error = handler.error as Error & { statusCode?: number; details: unknown };
    if (error instanceof ApiError) {
      handler.response = error.getResponse();
    } else if (error.statusCode === 400 && error.details) {
      const valError = exceptions.param.validationError;
      valError.details = error.details;
      handler.response = valError.getResponse();
    } else {
      console.error(error);
      handler.response = exceptions.server.internalError.getResponse();
    }
  },
};

const eventLogger: middy.MiddlewareObj = {
  before: handler => {
    console.info(`API処理開始:${handler.event.path}`);
    console.debug(JSON.stringify(handler.event, null, 2));
  },
  after: handler => {
    console.debug(JSON.stringify(handler.response, null, 2));
    console.info(`API処理終了:${handler.event.path}`);
  },
  onError: handler => {
    console.debug(JSON.stringify(handler.response, null, 2));
    console.info(`API処理終了:${handler.event.path}`);
  },
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

const cors: middy.MiddlewareObj = {
  after: handler => {
    handler.response.headers = CORS_HEADERS;
  },
  onError: handler => {
    handler.response.headers = CORS_HEADERS;
  },
};
