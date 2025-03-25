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
}

module.exports = ThreadRepositoryPostgres;