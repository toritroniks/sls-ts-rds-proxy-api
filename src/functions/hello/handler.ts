import 'source-map-support/register';

import { jsonRes, baseHandler, ApiHandler } from '@libs/helpers/ApiHelper';

import schema from './schema';

const hello: ApiHandler<typeof schema> = (event) => {
  return jsonRes({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  });
}

export const main = baseHandler(hello);
