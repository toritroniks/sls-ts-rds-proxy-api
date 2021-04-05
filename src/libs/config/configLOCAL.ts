import { Config } from '.';

const configLOCAL: Config = {
  vpc: {
    securityGroupIds: [],
    subnetIds: [],
  },
  RDSProxyUserResource: 'dummy',
  dbEndpoint: 'localhost',
  dbPort: 13306,
  dbUser: 'root',
  dbTimezone: '+09:00',
  database: 'mydb',
};

export default configLOCAL;
