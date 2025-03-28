/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentLikesTableTestHelper = {
    async findThreadCommentLikeById(likeId) {
        const query = {
            text: 'SELECT * FROM thread_comment_likes WHERE id = $1',
            values: [likeId],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable(pool) {
        pool.query('TRUNCATE TABLE thread_comment_likes CASCADE')
    }
}

module.exports = ThreadCommentLikesTableTestHelper;