const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewThread = require("../../../Domains/threads/entities/NewThread");
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const NewThreadComment = require("../../../Domains/threads/entities/NewThreadComment");
const ThreadCommentsTableTestHelper = require("../../../../tests/ThreadCommentsTableTestHelper");

describe('ThreadRepositoryPostgres', () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({
            id: 'user-riakgu',
            username: 'riakgu'
        });
        await ThreadsTableTestHelper.addThread('user-riakgu', {
            id: 'thread-riakgu',
            title: 'Thread title',
            body: 'Thread body',
        })
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
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

    describe('verifyThreadExists function', () => {
        it("should not throw error when thread exists", async () => {
            // Arrange
            const newThread = {
                id: 'thread-123',
                title: 'Thread title',
                body: 'Thread body',
            };
            const owner = "user-riakgu";

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
            await ThreadsTableTestHelper.addThread(owner, newThread)

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyThreadExists('thread-123'))
                .resolves.not.toThrow(NotFoundError);
        })

        it('should throw NotFoundError when thread does not exist', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyThreadExists('thread-123'))
                .rejects.toThrow(NotFoundError);
        });
    })

    describe('addThreadComment function', () => {
        it('should add a new thread comment to the database', async () => {
            // Arrange
            const newComment = new NewThreadComment({
                content: 'Komentar',
            });
            const threadId = "thread-riakgu";
            const owner = "user-riakgu";

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepositoryPostgres.addThreadComment(threadId, owner, newComment);

            // Assert
            const threadComments = await ThreadCommentsTableTestHelper.findThreadCommentById('comment-123');
            expect(threadComments).toHaveLength(1);
        })

        it('should return added thread comment correctly', async () => {
            // Arrange
            const newComment = new NewThreadComment({
                content: 'Komentar',
            });
            const threadId = "thread-riakgu";
            const owner = "user-riakgu";

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedComment = await threadRepositoryPostgres.addThreadComment(threadId, owner, newComment);

            // Assert
            expect(addedComment).toStrictEqual({
                id: 'comment-123',
                content: 'Komentar',
                owner: 'user-riakgu',
            });
        })
    })
})