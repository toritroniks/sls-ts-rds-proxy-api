import { FromSchema } from 'json-schema-to-ts';

export const reqSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: ['name'],
} as const;

export const resSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    event: { type: 'object' },
  },
  required: ['message', 'event'],
} as const;

export type ReqInterface = FromSchema<typeof reqSchema>;
export type ResInterface = FromSchema<typeof resSchema>;
