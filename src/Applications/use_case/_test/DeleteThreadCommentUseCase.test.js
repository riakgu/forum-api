const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DeleteThreadCommentUseCase = require("../DeleteThreadCommentUseCase");

describe('DeleteThreadCommentUseCase', () => {
    it('should orchestrating the delete thread comment action correctly', async () => {
        // Arrange
        const commentId = 'commentId';
        const threadId = 'threadId';
        const userId = 'userId';

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.verifyThreadExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyThreadCommentExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyThreadCommentOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.deleteThreadComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
            threadRepository: mockThreadRepository,
        });

        // Act
        await deleteThreadCommentUseCase.execute(commentId, threadId, userId);

        // Assert
        expect(mockThreadRepository.verifyThreadExists)
            .toHaveBeenCalledWith(threadId);
        expect(mockThreadRepository.verifyThreadCommentExists)
            .toHaveBeenCalledWith(commentId, threadId);
        expect(mockThreadRepository.verifyThreadCommentOwner)
            .toHaveBeenCalledWith(commentId, userId);
        expect(mockThreadRepository.deleteThreadComment)
            .toHaveBeenCalledWith(commentId);
    });
})