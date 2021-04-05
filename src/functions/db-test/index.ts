import { getAPIBaseInfo } from '@libs/helpers/lambdaHelper';

const { handlerDir, path } = getAPIBaseInfo(__dirname);

export default {
  handler: `${handlerDir}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: path,
      },
    },
  ],
};
