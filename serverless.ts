import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import dbTest from '@functions/db-test';

const serverlessConfiguration: AWS = {
  service: 'sls-rest-api',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      ENV: '${opt:stage, "local"}',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { hello, dbTest },
};

module.exports = serverlessConfiguration;
