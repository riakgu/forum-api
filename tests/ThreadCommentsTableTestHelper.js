/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
    async cleanTable(pool) {
        pool.query('TRUNCATE TABLE thread_comments CASCADE')
    }
}

module.exports = ThreadCommentsTableTestHelper;