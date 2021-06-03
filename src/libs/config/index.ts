import configLOCAL from './configLOCAL';
import configDEV from './configDEV';
import configPRD from './configPRD';

export interface Config {
  vpc: VPC;
  RDSProxyUserResource: string;
  dbEndpoint: string;
  dbPort: number;
  dbUser: string;
  dbPassword?: string;
  dbTimezone: string;
  database: string;
}

export interface VPC {
  securityGroupIds: string[];
  subnetIds: string[];
}

let config!: Config;

switch (process.env.ENV) {
  case 'prd':
    config = configPRD;
    break;
  case 'dev':
    config = configDEV;
    break;
  default:
    config = configLOCAL;
}

export default config;

export const allConfigs = {
  local: configLOCAL,
  dev: configDEV,
  prd: configPRD,
};
