import schema from './schema';
import { createFunctionConfig } from '@libs/helpers/LambdaHelper';

export default createFunctionConfig(__dirname, schema);
