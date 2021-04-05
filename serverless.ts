/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AWS } from '@serverless/typescript';

import functions from './apiFunctions';
import { allConfigs } from '@libs/config';

const serverlessConfiguration: AWS = {
  service: 'sls-ts-rds-proxy',
  frameworkVersion: '2',
  custom: {
    stage: '${opt:stage, "local"}',
    region: 'ap-northeast-1',
    runtime: {
      local: 'nodejs12.x', // serverless-offlineは14.xを対応していないため
    },
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    config: allConfigs,
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'rds-db:connect',
        Resource: '${self:custom.config.${self:custom.stage}.RDSProxyUserResource}',
      },
    ],
    runtime: '${self:custom.runtime.${self:custom.stage}, "nodejs14.x"}' as any,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    vpc: '${self:custom.config.${self:custom.stage}.vpc}' as any,
    region: '${self:custom.region}' as any,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      ENV: '${self:custom.stage}',
      REGION: '${self:custom.region}',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: functions,
};

module.exports = serverlessConfiguration;
