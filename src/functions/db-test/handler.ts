import 'source-map-support/register';

import { jsonRes, baseHandler, ApiHandler } from '@libs/helpers/ApiHelper';

import schema from './schema';
import { execute } from '@libs/helpers/DatabaseHelper';

const dbTest: ApiHandler<typeof schema> = async (event, connection) => {
  const query = 'show tables';
  const [tables] = await execute(connection, query);
  return jsonRes({ tables });
};

export const main = baseHandler(dbTest);
