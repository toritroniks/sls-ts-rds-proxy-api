export function getAPIBaseInfo(rawDir: string) {
  const handlerDir = `${rawDir.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
  const path = handlerDir.split('/').slice(-1)[0];

  return { handlerDir, path };
}
