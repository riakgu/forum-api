/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
    async addThread(owner, {id, title, body}) {
        const query = {
            text: 'INSERT INTO threads (id, owner, title, body) VALUES ($1, $2, $3, $4) RETURNING id, title, owner',
            values: [id, owner, title, body],
        };

        await pool.query(query);
    },

    async findThreadById(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE threads CASCADE');
    }
}

module.exports = ThreadsTableTestHelper;