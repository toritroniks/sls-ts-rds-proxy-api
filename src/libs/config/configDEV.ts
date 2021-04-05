import { Config } from '.';

const configDEV: Config = {
  vpc: {
    securityGroupIds: [],
    subnetIds: [],
  },
  RDSProxyUserResource: 'arn:aws:rds-db:ap-northeast-1:123456789999:dbuser:prx-0a987654321b1234b/*',
  dbEndpoint: 'dummy-dev-rds-proxy.proxy-abcdefghijkl.ap-northeast-1.rds.amazonaws.com',
  dbPort: 3306,
  dbUser: 'api',
  dbTimezone: '+09:00',
  database: 'sample',
};

export default configDEV;
