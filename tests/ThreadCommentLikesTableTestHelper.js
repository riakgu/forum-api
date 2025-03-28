/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentLikesTableTestHelper = {
    async addThreadCommentLike({id, commentId, owner}) {
        const query = {
            text: 'INSERT INTO thread_comment_likes (id, comment_id, owner) VALUES ($1, $2, $3) RETURNING id',
            values: [id, commentId, owner],
        };

        await pool.query(query);
    },

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