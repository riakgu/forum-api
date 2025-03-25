const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewThread = require("../../../Domains/threads/entities/NewThread");
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const NewThreadComment = require("../../../Domains/threads/entities/NewThreadComment");
const ThreadCommentsTableTestHelper = require("../../../../tests/ThreadCommentsTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

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
        await ThreadCommentsTableTestHelper.addThreadComment({
            id: 'comment-riakgu',
            threadId: 'thread-riakgu',
            owner: 'user-riakgu',
            content: 'Komentar',
        })
    });

    afterEach(async () => {
        // await ThreadCommentsTableTestHelper.cleanTable();
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

    describe('deleteThreadComment function', () => {
        it('should delete comment from database', async () => {
            // Arrange
            const commentId = "comment-riakgu";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            // Action
            await threadRepositoryPostgres.deleteThreadComment(commentId);

            // Assert
            const comments = await ThreadCommentsTableTestHelper.findThreadCommentById(commentId);
            expect(comments).toHaveLength(0);
        });
    })

    describe('verifyThreadCommentOwner function', () => {
        it('should not throw error when user is the owner', async () => {
            // Arrange
            const commentId = "comment-riakgu";
            const owner = "user-riakgu";

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyThreadCommentOwner(commentId, owner ))
                .resolves.not.toThrow(AuthorizationError);
        });

        it('should throw AuthorizationError when user not the owner', async () => {
            // Arrange
            const commentId = "comment-riakgu";
            const userId = "user-123";

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyThreadCommentOwner(commentId, userId ))
                .rejects.toThrow(AuthorizationError);
        });
    })

    describe('verifyThreadCommentExists function', () => {
        it("should not throw error when comment exists", async () => {
            // Arrange
            const commentId = "comment-riakgu";
            const threadId = "thread-riakgu";

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyThreadCommentExists(commentId, threadId))
                .resolves.not.toThrow(NotFoundError);
        })

        it('should throw NotFoundError when comment does not exist', async () => {
            // Arrange
            const commentId = "comment-123";
            const threadId = "thread-riakgu";

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyThreadCommentExists(commentId, threadId))
                .rejects.toThrow(NotFoundError);
        });
    });

    describe('getThreadById function', () => {
        it('should return thread correctly when found', async () => {
            // Arrange
            const threadId = "thread-riakgu";

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            // Action
            const thread = await threadRepositoryPostgres.getThreadById(threadId);

            // Assert
            expect(thread).toStrictEqual({
                id: 'thread-riakgu',
                title: 'Thread title',
                body: 'Thread body',
                date: new Date(thread.date).toISOString(),
                username: 'riakgu',
            });
        });

        it('should throw NotFoundError when thread is not found', async () => {
            // Arrange
            const threadId = 'thread-123';

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            // Action & Assert
            await expect(threadRepositoryPostgres.getThreadById(threadId))
                .rejects.toThrow(NotFoundError);
        });
    });

    describe('getCommentsByThreadId function', () => {
        it('should return comments correctly when found', async () => {
            // Arrange
            const threadId = "thread-riakgu";

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            // Action
            const comments = await threadRepositoryPostgres.getCommentsByThreadId(threadId);

            // Assert
            expect(comments).toHaveLength(1);
            expect(comments[0]).toStrictEqual({
                id: 'comment-riakgu',
                username: "riakgu",
                date: new Date(comments[0].date).toISOString(),
                content: 'Komentar',
            });
        });

        it('should return deleted comments as "**komentar telah dihapus**"', async () => {
            // Arrange
            await ThreadCommentsTableTestHelper.addThreadComment({
                id: 'comment-deleted',
                threadId: 'thread-riakgu',
                owner: 'user-riakgu',
                content: 'Komentar',
                isDeleted: true,
            })

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            // Action
            const comments = await threadRepositoryPostgres.getCommentsByThreadId('thread-riakgu');

            // Assert
            expect(comments).toHaveLength(2);
            expect(comments[1]).toStrictEqual({
                id: 'comment-deleted',
                username: 'riakgu',
                date: new Date(comments[1].date).toISOString(),
                content: '**komentar telah dihapus**',
            });
        });

        it('should return comments correctly when is_deleted is false', async () => {
            // Arrange
            await ThreadCommentsTableTestHelper.addThreadComment({
                id: 'comment-valid',
                threadId: 'thread-riakgu',
                owner: 'user-riakgu',
                content: 'Komentar belum dihapus',
                isDeleted: false,
            });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            // Action
            const comments = await threadRepositoryPostgres.getCommentsByThreadId('thread-riakgu');

            // Assert
            expect(comments).toHaveLength(2);
            expect(comments[1]).toStrictEqual({
                id: 'comment-valid',
                username: 'riakgu',
                date: new Date(comments[1].date).toISOString(),
                content: 'Komentar belum dihapus',
            });
        });

        it('should return empty array when no comments found', async () => {
            // Arrange
            const threadId = "thread-kosong";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            // Action
            const comments = await threadRepositoryPostgres.getCommentsByThreadId(threadId);

            // Assert
            expect(comments).toHaveLength(0);
            expect(comments).toStrictEqual([]);
        });
    })
})