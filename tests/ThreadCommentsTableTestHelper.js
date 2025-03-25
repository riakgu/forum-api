/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
    async findThreadCommentById(commentId) {
        const query = {
            text: 'SELECT * FROM thread_comments WHERE id = $1',
            values: [commentId],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable(pool) {
        pool.query('TRUNCATE TABLE thread_comments CASCADE')
    }
}

module.exports = ThreadCommentsTableTestHelper;