import { RDS } from 'aws-sdk';
import {
  createConnection as mysql2CreateConnection,
  Connection,
  ConnectionOptions,
} from 'mysql2/promise';
import config from '@libs/config';
import exceptions from '@libs/enums/exceptions';

const signer = new RDS.Signer({
  region: process.env['REGION'],
  hostname: config.dbEndpoint,
  port: config.dbPort,
  username: config.dbUser,
});

export async function createConnection(): Promise<Connection> {
  console.info('DBコネクションを作成します。');
  try {
    let connectionConfig: ConnectionOptions;
    if (config.dbEndpoint === 'localhost') {
      connectionConfig = getDBLocalConnectionConfig();
    } else {
      connectionConfig = getDBConnectionConfig();
    }

    const connection = await mysql2CreateConnection(connectionConfig);
    console.info(`DBの接続id: ${connection.threadId}`);
    return connection;
  } catch (err) {
    console.error('DBに接続できませんでした。');
    console.error(err);
    throw exceptions.server.internalError;
  }
}

export async function execute(
  connection: Connection,
  query: string,
  params?: unknown[]
): Promise<unknown[]> {
  try {
    console.info('クエリー実行:', query);
    console.debug('パラメータ:', params);
    return await connection.execute(query, params ?? []);
  } catch (err) {
    console.error('クエリー実行に失敗しました。');
    console.error(err);
    throw exceptions.server.internalError;
  }
}

function getDBLocalConnectionConfig() {
  const connectionConfig: ConnectionOptions = {
    host: config.dbEndpoint,
    user: config.dbUser,
    port: config.dbPort,
    database: config.database,
    ssl: { rejectUnauthorized: false },
    timezone: config.dbTimezone,
  };
  return connectionConfig;
}

function getDBConnectionConfig() {
  const token = signer.getAuthToken({ username: config.dbUser });

  console.info('IAMトークン取得完了');

  const connectionConfig: ConnectionOptions = {
    host: config.dbEndpoint,
    user: config.dbUser,
    port: config.dbPort,
    database: config.database,
    ssl: 'Amazon RDS',
    password: token,
    authPlugins: {
      mysql_clear_password: () => async () =>
        await signer.getAuthToken({ username: config.dbUser }),
    },
    timezone: config.dbTimezone,
  };
  return connectionConfig;
}
