/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentRepliesTableTestHelper = {
    async findThreadCommentReplyById(replyId) {
        const query = {
            text: 'SELECT * FROM thread_comment_replies WHERE id = $1 AND is_deleted = FALSE',
            values: [replyId],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable(pool) {
        pool.query('TRUNCATE TABLE thread_comment_replies CASCADE')
    }
}

module.exports = ThreadCommentRepliesTableTestHelper;