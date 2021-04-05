import { FromSchema } from 'json-schema-to-ts';

export const reqSchema = {} as const;

export const resSchema = {
  type: 'object',
  properties: {
    tables: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
  },
} as const;

export type ReqInterface = FromSchema<typeof reqSchema>;
export type ResInterface = FromSchema<typeof resSchema>;
