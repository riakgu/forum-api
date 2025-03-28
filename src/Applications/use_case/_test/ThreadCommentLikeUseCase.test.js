const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentLikeUseCase = require("../ThreadCommentLikeUseCase");

describe('ThreadCommentLikeUseCase', () => {
    it('should like the comment if not liked yet', async () => {
        // Arrange
        const commentId = 'commentId';
        const userId = 'userId';
        const threadId = 'threadId';

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.verifyThreadCommentExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.isCommentLiked = jest.fn()
            .mockImplementation(() => Promise.resolve(false));
        mockThreadRepository.addCommentLike = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const threadCommentLikeUseCase = new ThreadCommentLikeUseCase({
            threadRepository: mockThreadRepository,
        });

        // Act
        await threadCommentLikeUseCase.execute(threadId, commentId, userId);

        // Assert
        expect(mockThreadRepository.verifyThreadCommentExists)
            .toHaveBeenCalledWith(commentId, threadId);
        expect(mockThreadRepository.isCommentLiked)
            .toHaveBeenCalledWith(commentId, userId);
        expect(mockThreadRepository.addCommentLike)
            .toHaveBeenCalledWith(commentId, userId);
    });

    it('should unlike the comment if already liked', async () => {
        // Arrange
        const commentId = 'commentId';
        const userId = 'userId';
        const threadId = 'threadId';

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.verifyThreadCommentExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.isCommentLiked = jest.fn()
            .mockImplementation(() => Promise.resolve(true));
        mockThreadRepository.deleteCommentLike = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const threadCommentLikeUseCase = new ThreadCommentLikeUseCase({
            threadRepository: mockThreadRepository,
        });

        // Act
        await threadCommentLikeUseCase.execute(threadId, commentId, userId);

        // Assert
        expect(mockThreadRepository.verifyThreadCommentExists)
            .toHaveBeenCalledWith(commentId, threadId);
        expect(mockThreadRepository.isCommentLiked)
            .toHaveBeenCalledWith(commentId, userId);
        expect(mockThreadRepository.deleteCommentLike)
            .toHaveBeenCalledWith(commentId, userId);
    });
});