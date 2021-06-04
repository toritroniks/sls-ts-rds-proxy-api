import { RDS } from 'aws-sdk';
import {
  createConnection as mysql2CreateConnection,
  Connection as Mysql2Connection,
  ConnectionOptions,
} from 'mysql2/promise';
import config from '@libs/config';
import exceptions from '@libs/enums/exceptions';

const signer = new RDS.Signer({
  region: process.env.REGION,
  hostname: config.dbEndpoint,
  port: config.dbPort,
  username: config.dbUser,
});

export class Connection {
  private connection: Mysql2Connection;

  constructor(connection: Mysql2Connection) {
    this.connection = connection;
  }

  get instance() {
    return this.connection;
  }

  async execute<T = any>(query: string, params?: QueryParam[]): Promise<T[][]> {
    try {
      console.info('クエリー実行:', query);
      console.debug('パラメータ:', params);
      return (await this.connection.execute(query, params ?? [])) as unknown as T[][];
    } catch (err) {
      console.error('クエリー実行に失敗しました。');
      console.error(err);
      throw exceptions.server.internalError;
    }
  }

  async end() {
    await this.connection.end();
    console.info('コネクション終了');
  }
}

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
    return new Connection(connection);
  } catch (err) {
    console.error('DBに接続できませんでした。');
    console.error(err);
    throw exceptions.server.internalError;
  }
}

export type QueryParam = number | string | boolean;

function getDBLocalConnectionConfig() {
  const connectionConfig: ConnectionOptions = {
    host: config.dbEndpoint,
    user: config.dbUser,
    port: config.dbPort,
    database: config.database,
    password: config.dbPassword,
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
