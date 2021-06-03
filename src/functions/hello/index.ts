import { getAPIBaseInfo } from '@libs/helpers/lambdaHelper';

const { handlerDir, path, cors } = getAPIBaseInfo(__dirname);

export default {
  handler: `${handlerDir}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: path,
        cors: cors,
      },
    },
  ],
};
