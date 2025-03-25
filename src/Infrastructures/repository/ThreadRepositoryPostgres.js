const ThreadRepository =  require('../../Domains/threads/ThreadRepository');
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

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
}

module.exports = ThreadRepositoryPostgres;