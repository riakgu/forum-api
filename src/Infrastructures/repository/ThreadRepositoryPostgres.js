const ThreadRepository =  require('../../Domains/threads/ThreadRepository');

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
}

module.exports = ThreadRepositoryPostgres;