import { SLSFunctions } from '@libs/helpers/serverlessHelper';

import hello from '@functions/hello';
import dbTest from '@functions/db-test';

const functions: SLSFunctions = {
  hello,
  dbTest,
};

export default functions;
