/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentRepliesTableTestHelper = {
    async addThreadCommentReply({id, commentId, owner, content, isDeleted = false}) {
        const query = {
            text: 'INSERT INTO thread_comment_replies (id, comment_id, owner, content, is_deleted) VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, commentId, owner, content, isDeleted],
        };

        await pool.query(query);
    },

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