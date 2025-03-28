const ThreadRepository =  require('../../Domains/threads/ThreadRepository');
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(owner, newThread) {
        const {title, body} = newThread;
        const id = `thread-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO threads (id, owner, title, body) VALUES ($1, $2, $3, $4) RETURNING id, title, owner',
            values: [id, owner, title, body],
        };

        const result = await this._pool.query(query);

        return result.rows[0];
    }

    async verifyThreadExists(threadId) {
        const query = {
            text: 'SELECT id FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }
    }

    async addThreadComment(threadId, owner, newComment) {
        const {content} = newComment;
        const id = `comment-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO thread_comments (id, thread_id, owner, content) VALUES ($1, $2, $3, $4) RETURNING id, content, owner',
            values: [id, threadId, owner, content],
        };

        const result = await this._pool.query(query);

        return result.rows[0];
    }

    async deleteThreadComment(commentId) {
        const query = {
            text: 'UPDATE thread_comments SET is_deleted = TRUE WHERE id = $1',
            values: [commentId],
        };

        await this._pool.query(query);
    }

    async verifyThreadCommentOwner(commentId, userId) {
        const query = {
            text: 'SELECT id FROM thread_comments WHERE id = $1 AND owner = $2',
            values: [commentId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new AuthorizationError('anda tidak berhak mengakses resource ini');
        }
    }

    async verifyThreadCommentExists(commentId, threadId) {
        const query = {
            text: 'SELECT id FROM thread_comments WHERE id = $1 AND thread_id = $2 AND is_deleted = FALSE',
            values: [commentId, threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('komentar tidak ditemukan atau telah dihapus');
        }
    }

    async getThreadById(threadId) {
        const query = {
            text: `
                SELECT threads.id, threads.title, threads.body, threads.created_at AS date, users.username
                FROM threads
                JOIN users ON threads.owner = users.id
                WHERE threads.id = $1
            `,
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }

        return {
            ...result.rows[0],
            date: new Date(result.rows[0].date).toISOString(),
        };
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: `
                SELECT thread_comments.id, users.username, thread_comments.created_at AS date, 
                    CASE 
                       WHEN thread_comments.is_deleted THEN '**komentar telah dihapus**' 
                       ELSE thread_comments.content
                    END AS content
                FROM thread_comments
                JOIN users ON thread_comments.owner = users.id
                WHERE thread_comments.thread_id = $1
                ORDER BY thread_comments.created_at ASC
            `,
            values: [threadId],
        };

        const result = await this._pool.query(query);

        return result.rows.map((comment) => ({
            id: comment.id,
            username: comment.username,
            date: new Date(comment.date).toISOString(),
            content: comment.content,
        }));
    }

    async getRepliesByCommentId(commentId) {
        const query = {
            text: `
                SELECT thread_comment_replies.id, users.username, thread_comment_replies.created_at AS date, 
                    CASE 
                       WHEN thread_comment_replies.is_deleted THEN '**balasan telah dihapus**' 
                       ELSE thread_comment_replies.content
                    END AS content
                FROM thread_comment_replies
                JOIN users ON thread_comment_replies.owner = users.id
                WHERE thread_comment_replies.comment_id = $1
                ORDER BY thread_comment_replies.created_at ASC
            `,
            values: [commentId],
        };

        const result = await this._pool.query(query);

        return result.rows.map((reply) => ({
            id: reply.id,
            content: reply.content,
            date: new Date(reply.date).toISOString(),
            username: reply.username,
        }));
    }

    async addThreadCommentReply(commentId, owner, newReply) {
        const {content} = newReply;
        const id = `reply-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO thread_comment_replies (id, comment_id, owner, content) VALUES ($1, $2, $3, $4) RETURNING id, content, owner',
            values: [id, commentId, owner, content],
        };

        const result = await this._pool.query(query);

        return result.rows[0];
    }

    async deleteThreadCommentReply(replyId) {
        const query = {
            text: 'UPDATE thread_comment_replies SET is_deleted = TRUE WHERE id = $1',
            values: [replyId],
        };

        await this._pool.query(query);
    }

    async verifyThreadCommentReplyOwner(replyId, userId) {
        const query = {
            text: 'SELECT id FROM thread_comment_replies WHERE id = $1 AND owner = $2',
            values: [replyId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new AuthorizationError('anda tidak berhak mengakses resource ini');
        }
    }

    async verifyThreadCommentReplyExists(replyId, commentId) {
        const query = {
            text: 'SELECT id FROM thread_comment_replies WHERE id = $1 AND comment_id = $2 AND is_deleted = FALSE',
            values: [replyId, commentId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('balasan komentar tidak ditemukan atau telah dihapus');
        }
    }

    async addCommentLike(commentId, userId) {
        const id = `like-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO thread_comment_likes (id, comment_id, owner) VALUES ($1, $2, $3) RETURNING id',
            values: [id, commentId, userId],
        };

        await this._pool.query(query);
    }

    async deleteCommentLike(commentId, userId) {
        const query = {
            text: 'DELETE FROM thread_comment_likes WHERE comment_id = $1 AND owner = $2',
            values: [commentId, userId],
        };

        await this._pool.query(query);
    }

    async isCommentLiked(commentId, userId) {
        const query = {
            text: 'SELECT id FROM thread_comment_likes WHERE comment_id = $1 AND owner = $2',
            values: [commentId, userId],
        };

        const result = await this._pool.query(query);

        return result.rowCount > 0;
    }

    async getCommentLikes(commentId) {
        const query = {
            text: 'SELECT id FROM thread_comment_likes WHERE comment_id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);

        return result.rowCount;
    }
}

module.exports = ThreadRepositoryPostgres;