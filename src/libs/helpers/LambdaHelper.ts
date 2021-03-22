export function createFunctionConfig(rawDir: string, schema: Record<string, unknown>) {
  const dir = `${rawDir.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
  const path = dir.split('/').slice(-1)[0];
  const request = schema
    ? {
        schemas: {
          'application/json': schema,
        },
      }
    : undefined;

  return {
    handler: `${dir}/handler.main`,
    events: [
      {
        http: {
          method: 'post',
          path: path,
          request: request,
        },
      },
    ],
  };
}
