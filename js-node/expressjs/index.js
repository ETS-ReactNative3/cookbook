(async function() {
  // console.log(__dirname, process.cwd())
  await require('@es-labs/node/config')( __dirname, process.cwd() )
  console.info('Globals setup and config done. Starting app... ')
  const { server } = require('./app')
  const { API_PORT, HTTPS_CERTS } = global.CONFIG
  server.listen(API_PORT, () => console.info(`[(${process.env.NODE_ENV}) ${APP_NAME} ${APP_VERSION}] listening on port ${API_PORT} using ${HTTPS_CERTS ? 'https' : 'http'}`))
}())
