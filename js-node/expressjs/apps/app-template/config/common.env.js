// settings common to all 3 environments
// process.env.NODE_ENV
const selfsigned = require('selfsigned')
const pems = selfsigned.generate(
  // [
  //   { name: 'commonName', value: '127.0.0.1' },
  //   { name: 'countryName', value: 'SG' },
  //   { name: 'localityName', value: '' },
  //   { name: 'stateOrProvinceName', value: '' },
  //   { name: 'organizationName', value: 'ES-LABS' },
  //   { name: 'organizationalUnitName', value: '' },
  //   { name: 'emailAddress', value: '' }
  // ],
    [{ name: 'commonName', value: '192.168.18.8' }], // null, // can use null
  {
    // keySize: 1024, // the size for the private key in bits (default: 1024)
    days: 30, // how long till expiry of the signed certificate (default: 365)
    algorithm: 'sha256', // sign the certificate with specified algorithm (default: 'sha1')
    // extensions: [{ name: 'basicConstraints', cA: true }], // certificate extensions array
    // pkcs7: false, // include PKCS#7 as part of the output (default: false)
    // clientCertificate: false, // generate client cert signed by the original key (default: false)
    // clientCertificateCN: 'jdoe' // client certificate's common name (default: 'John Doe jdoe123')
  }
)
// {
//   private: '-----BEGIN RSA PRIVATE KEY-----\r\n ... \r\n-----END RSA PRIVATE KEY-----\r\n',
//   public: '-----BEGIN PUBLIC KEY-----\r\n ... \r\n-----END PUBLIC KEY-----\r\n',
//   cert: '-----BEGIN CERTIFICATE-----\r\n ... \r\n-----END CERTIFICATE-----\r\n'
// }
const refreshPems = selfsigned.generate(null, { days: 30, algorithm: 'sha256' })

module.exports = {
  API_PORT: 3000,
  WS_PORT: 3001,

  // for file uploads
  UPLOAD_STATIC: [{
    folder: APP_PATH + '/apps/' + APP_NAME + '/uploads',
    url: '/uploads',
    options: {
      fileFilter: (req, file, cb) => { // better to also filter at frontend
        if ( ['text', 'image'].find(item => file.mimetype.includes(item)) ) return cb(null, true) // accept image or text
        return cb(null, false, new Error("Only text/plain or images are allowed"))
      },
      limits: {
        files: 2,
        fileSize: 10000000 // size in bytes
      },
    },
    savedFilename: null, // null or function (file pass in) returning a string...
    list: true, // allow to list 
    listOptions: { icons: true } // refer to serve-index package
  }],
  UPLOAD_MEMORY: [{
    limits: {
      files : 1,
      fileSize: 500000 // size in bytes
    },
    // fileFilter,
  }],

  BODYPARSER_JSON: { limit: '2mb' },
  BODYPARSER_URLENCODED: { extended: true, limit: '2mb' },

  AUTH_REFRESH_URL: '/api/auth/refresh',
  // JWT_EXPIRY: 5, // to test refresh token
  // JWT_REFRESH_EXPIRY: 10, // to test refresh token
  JWT_EXPIRY: 1800, // 5 // 1800 // '150d', '15d', '15m', '15s', use small expiry to test refresh mechanism, numeric is seconds
  JWT_REFRESH_EXPIRY: 3600, // 15 // 3600 // do not allow refresh handling after defined seconds
  OTP_EXPIRY: 30, // 8 // 30 // defined seconds to allow user to submit OTP
  JWT_ALG: 'HS256', // HS256, RS256
  // JWT_CERTS: null, // { key: '', cert: '' }, // in secret if plaintext
  // JWT_REFRESH_CERTS: null, // { key: '', cert: '' }, // in secret if plaintext
  JWT_CERTS: { key: pems.private, cert: pems.cert }, // can be here if autogenerated
  JWT_REFRESH_CERTS: { key: refreshPems.private, cert: refreshPems.cert },
  HTTPS_CERTS: null,
  // HTTPS_CERTS: { key: pems.private, cert: pems.cert },
  // GCP_SERVICE_KEY: null, // {}
  // KNEXFILE: null, // {}

  // OPENAPI_PATH: '',
  OPENAPI_PATH: './apps/app-template/openapi/example.output.yaml',
  OPENAPI_VALIDATOR: null,
  // {
  //   apiSpec: './apps/app-template/openapi/example.output.yaml',
  //   validateRequests: true, // (default)
  //   validateResponses: true, // false by default
  // },

  GRAPHQL_SCHEMA_PATH: '../apps/app-template/graphql-schema',
  GRAPHQL_URL: '/graphql',
  GRAPHQL_SUB_URL: '/subscriptions',

  SENTRY_DSN: 'https://59719c6eb4ec44c988b86a0e3157347b@o406131.ingest.sentry.io/5868141',
  SENTRY_SAMPLE_RATE: 1.0,
  SENTRY_REQOPTS: null,

  REDIS_CONFIG: {
    opts: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      family: 4,           // 4 (IPv4) or 6 (IPv6)
      password: '',
      db: 0,
      // if using sentinels
      // sentinels: [{ host: 'localhost', port: 26379 }, { host: 'localhost', port: 26380 }],
      // name: 'mymaster',
      maxRetriesPerRequest: 20,
      autoResubscribe: true, // default
      // autoResendUnfulfilledCommands: true,
    },
    retry: {
      step: 50, max: 2000 
    },
    reconnect: {
      targetError: 'READONLY'
    }
  },

  JOB_PATH: APP_PATH + '/apps/' + APP_NAME + '/jobs',
}