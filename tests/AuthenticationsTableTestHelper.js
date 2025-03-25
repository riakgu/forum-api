/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const AuthenticationsTableTestHelper = {
    async addToken(token) {
        const query = {
            text: 'INSERT INTO authentications VALUES($1)',
            values: [token],
        };

        await pool.query(query);
    },

    async findToken(token) {
        const query = {
            text: 'SELECT token FROM authentications WHERE token = $1',
            values: [token],
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async loginUser(server, { username, password }) {
        const response = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: { username, password },
        });

        const { data } = JSON.parse(response.payload);
        return data.accessToken;
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE authentications');
    },
};

module.exports = AuthenticationsTableTestHelper;