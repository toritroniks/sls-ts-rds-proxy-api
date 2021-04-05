import 'source-map-support/register';

import { baseHandler, ApiHandler } from '@libs/helpers/apiHelper';
import { reqSchema, resSchema, ReqInterface, ResInterface } from './schema';

const handler: ApiHandler<ReqInterface, ResInterface> = async event => {
  return {
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  };
};

export const main = baseHandler(handler, {
  reqSchema,
  resSchema,
});
