import type { AWS } from '@serverless/typescript';

// TypeだけをExportするためのダミー変数
const slsAWS: AWS = {
  service: 'dummy',
  provider: {
    name: 'aws',
  },
  functions: {
    dummy: {},
  },
};
const slsFunctions = slsAWS.functions;
const slsFunction = slsFunctions!.dummy;
const slsRoleStatements = slsAWS.provider.iamRoleStatements;

export type SLSFunctions = typeof slsFunctions;
export type SLSFunction = typeof slsFunction;
export type SLSRoleStatements = typeof slsRoleStatements;
