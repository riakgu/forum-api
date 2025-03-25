const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewThread = require("../../../Domains/threads/entities/NewThread");
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe('ThreadRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({
            id: 'user-riakgu',
            username: 'riakgu'
        });
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('addThread function', () => {
        it('should add a new thread to the database', async () => {
            // Arrange
            const newThread = new NewThread({
                title: 'Thread title',
                body: 'Thread body',
            });
            const owner = "user-riakgu";

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepositoryPostgres.addThread(owner, newThread);

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
            expect(threads).toHaveLength(1);
        });

        it('should return added thread correctly', async () => {
            // Arrange
            const newThread = new NewThread({
                title: 'Thread title',
                body: 'Thread body',
            });
            const owner = "user-riakgu";

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(owner, newThread);

            // Assert
            expect(addedThread).toStrictEqual({
                id: 'thread-123',
                title: 'Thread title',
                owner: 'user-riakgu',
            });
        });
    });
})