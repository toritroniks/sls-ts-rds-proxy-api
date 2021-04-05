/* eslint-disable @typescript-eslint/no-explicit-any */
import exceptions, { ApiError, errorSchema } from '@libs/enums/exceptions';
import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import middyValidator from '@middy/validator';
import { Context } from 'aws-lambda';

export function middify(handler: any, reqSchema: any, resSchema: any) {
  return middy(handler)
    .use(errorHandler)
    .use(middyJsonBodyParser())
    .use(responseSerializer)
    .use(
      middyValidator({
        inputSchema: buildInputSchema(reqSchema),
        outputSchema: buildOutputSchema(resSchema),
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

const responseSerializer: middy.MiddlewareObject<any, any, Context> = {
  after: serializeResponseBody,
  onError: serializeResponseBody,
};

function serializeResponseBody(handler: any, next: any) {
  handler.response.body = JSON.stringify(handler.response.body);
  next();
}

const errorHandler: middy.MiddlewareObject<any, any, Context> = {
  onError: (handler, next) => {
    const error = handler.error as Error & { statusCode?: number; details: unknown };
    if (error instanceof ApiError) {
      handler.response = error.getResponse();
    } else if (error.statusCode === 400) {
      const valError = exceptions.param.validationError;
      valError.details = error.details;
      handler.response = valError.getResponse();
    } else {
      console.error(error);
      handler.response = exceptions.server.internalError.getResponse();
    }
    next();
  },
};
