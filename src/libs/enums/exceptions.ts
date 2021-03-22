import { ApiResponse } from "@libs/helpers/ApiHelper";

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: string, status: number, details?: unknown, message?: string) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.message = code;
  }

  public getResponse(): ApiResponse {
    return {
      statusCode: this.status,
      body: JSON.stringify({
        error: {
          code: this.code,
          details: this.details ?? undefined,
        },
      }),
    };
  }
}

const exceptions = Object.freeze({
  param: {
    notFound: new ApiError('PARAM.NOT_FOUND', 400),
    validationError: new ApiError('PARAM.VALIDATION_ERROR', 400),
  },
  access: {
    denied: new ApiError('ACCESS.DENIED', 403),
  },
  server: {
    internalError: new ApiError('SERVER.INTERNAL_ERROR', 500),
  },
  system: {
    unavailable: new ApiError('SYSTEM.UNAVAILABLE', 503),
  },
});

export default exceptions;
