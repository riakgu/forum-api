/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
    async addThreadComment({id, threadId, owner, content, isDeleted = false}) {
        const query = {
            text: 'INSERT INTO thread_comments (id, thread_id, owner, content, is_deleted) VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, threadId, owner, content, isDeleted],
        };

        await pool.query(query);
    },

    async findThreadCommentById(commentId) {
        const query = {
            text: 'SELECT * FROM thread_comments WHERE id = $1 AND is_deleted = FALSE',
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