/* istanbul ignore file */
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const envConfig = dotenv.config();
dotenvExpand.expand(envConfig);

if (process.env.NODE_ENV === 'test') {
    const testEnvConfig = dotenv.config({ path: '.test.env', override: true });
    dotenvExpand.expand(testEnvConfig);
}

const config = {
    app: {
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        port: process.env.PORT,
        debug: process.env.NODE_ENV === 'development' ? { request: ['error'] } : {},
    },
    database: {
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
    },
    jwt: {
        accessTokenKey: process.env.ACCESS_TOKEN_KEY,
        refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
        accessTokenAge: process.env.ACCESS_TOKEN_AGE,
    },
};

module.exports = config;