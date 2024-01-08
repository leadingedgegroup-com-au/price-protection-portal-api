/**
 * Configurtation Module to complement Nest configuration.
 *
 * @author Rajendra Kumar Majhi
 * @date 03-09-2022
 *
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
export default () => ({
  NAMESPACE: 'LEG | Price Protection Portal | Microservices',
  PORT: process.env.PORT || 5777,
  ENVIRONMENT: process.env.ENVIRONMENT || 'LOCAL',
  DESCRIPTION: '',
  VERSION: '1.0.0',
  GLOBAL_PREFIX: '/api',
  IP: process.env.IP || '127.0.0.1,::1,::ffff:127.0.0.1,52.203.242.0',
  JWT: {
    SECRET: process.env.JWT_SECRET || `leg.ssp|f87024df5803f1c4228fdb211832938545446735|@`,
    EXP: process.env.JWT_EXP || '1d',
  },
  REDIS: {
    URL: process.env.REDIS_URL || 'redis://localhost:6379',
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: process.env.REDIS_PORT || '6379',
    PASSWORD: process.env.REDIS_PASSWORD || '',
  },
  DB: {
    TYPE: process.env.DB_TYPE || 'mssql',
    PORT: process.env.DB_PORT || 1433,
    HOST: process.env.DB_HOST || 'localhost',
    USERNAME: process.env.DB_USERNAME || 'sa',
    PASSWORD: process.env.DB_PASSWORD || 'uyyyyroot77',
    DATABASE: process.env.DB_DATABASE || 'PriceProtection_UAT',
  },
  NETSUITE: {
    ACCOUNT_ID: process.env.NETSUITE_ACCOUNT_ID || '5131121_SB1',
    API: process.env.NETSUITE_API || 'https://5131121-sb1.suitetalk.api.netsuite.com/services/rest/record/v1',
    TOKEN_ID: process.env.NETSUITE_TOKEN_ID || 'c443e4ca80c61a59c53d20c1b7fda2e75c24c53cccd3e749e21cd82903a46e95',
    TOKEN_SECRET: process.env.NETSUITE_TOKEN_SECRET || 'bad5b2bae0527d265945ebe5a9574f1b55f4bacd8e5094ca15d88bc979ad4cc9',
    CLIENT_ID: process.env.NETSUITE_CLIENT_ID || '51b3133eeed254735f8c1eaa8309f852d2ede053e4466884ccd692c6bb4dba3d',
    CLIENT_SECRET: process.env.NETSUITE_CLIENT_SECRET || 'e40c04ec75939e8e9a95ded18fc9dbf53cf005c807d2d06e59475e968cfe46ba',
  },
  PORTAL: {
    HOST: process.env.PORTAL_HOST || `https://ssp.leadingedgegroup.com.au`,
    LOGO: process.env.PORTAL_LOGO || `https://ssp.leadingedgegroup.com.au/assets/images/leading-edge-retail2.png`
  },
  ZOHO: {
    ZEPTO: {
      HOST: "smtp.zeptomail.com",
      PORT: 587,
      AUTH: {
        USER: "emailapikey",
        PASS: "wSsVR61y/BHwBvh/yj2qJOlsyllWAl2lERh1jlWm6CP8Gv3FoMczkkTLVgGlG/RKGDI7HTdErLwrzBZRhmdc3Nl+zF1SACiF9mqRe1U4J3x17qnvhDzCX2ldmxKPKooBxgtomWBjEM8n+g=="
      }
    }
  },
  AWS: {
    S3: {
      REGION: process.env.AWS_S3_REGION || 'ap-southeast-2',
      BUCKET: process.env.AWS_S3_BUCKET || 'ssp.dev.documents',
      KEY: process.env.AWS_S3_KEY || 'AKIAYQ56IALDTHMMI7AZ',
      SECRET: process.env.AWS_S3_SECRET || '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',
      S3: {
        BUCKET_BASE_PATH:
          process.env.AWS_S3_BUCKET_BASE_PATH ||
          'https://s3.ap-southeast-2.amazonaws.com/ssp.dev.documents/',
      },
    }
  },
  config: async (app: any, config: any) => {
    console.log(
      `\n[ Price Protection Portal - Microservice ] server successfully enabled with ${config.ENVIRONMENT} environment\n`,
      `\n[ Price Protection Portal - Microservice ] Attached ${config.ENVIRONMENT} DB :
      ::> Local: http://localhost:${config.PORT}
      ::> IPV4 Network: ${await app.getUrl()}
      ::> DB: [ ${config.DB.TYPE} | ${config.DB.HOST}:${config.DB.PORT} | ${config.DB.DATABASE} ]
      \n`,
    );
  },
});