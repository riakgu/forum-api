const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DeleteThreadCommentReplyUseCase = require("../DeleteThreadCommentReplyUseCase");
const repl = require("node:repl");


describe('DeleteThreadCommentReplyUseCase', () => {
    it('should orchestrating the delete thread comment reply action correctly', async () => {
        // Arrange
        const replyId = 'replyId';
        const commentId = 'commentId';
        const threadId = 'threadId';
        const userId = 'userId';

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.verifyThreadExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyThreadCommentExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyThreadCommentReplyExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyThreadCommentReplyOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.deleteThreadCommentReply = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteThreadCommentReplyUseCase = new DeleteThreadCommentReplyUseCase({
            threadRepository: mockThreadRepository,
        });

        // Act
        await deleteThreadCommentReplyUseCase.execute(replyId, commentId, threadId, userId);

        // Assert
        expect(mockThreadRepository.verifyThreadExists)
            .toHaveBeenCalledWith(threadId);
        expect(mockThreadRepository.verifyThreadCommentExists)
            .toHaveBeenCalledWith(commentId, threadId);
        expect(mockThreadRepository.verifyThreadCommentReplyExists)
            .toHaveBeenCalledWith(replyId, commentId);
        expect(mockThreadRepository.verifyThreadCommentReplyOwner)
            .toHaveBeenCalledWith(replyId, userId);
        expect(mockThreadRepository.deleteThreadCommentReply)
            .toHaveBeenCalledWith(replyId);
    });
})