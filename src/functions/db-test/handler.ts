import 'source-map-support/register';

import { execute } from '@libs/helpers/DatabaseHelper';
import { baseHandler, ApiHandler } from '@libs/helpers/apiHelper';
import { reqSchema, resSchema, ReqInterface, ResInterface } from './schema';

const handler: ApiHandler<ReqInterface, ResInterface> = async (_event, connection) => {
  const query = 'show tables';
  const [tables] = await execute(connection, query);
  return { tables };
};

export const main = baseHandler(handler, {
  reqSchema,
  resSchema,
});
