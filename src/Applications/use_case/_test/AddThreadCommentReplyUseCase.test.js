const AddThreadCommentReplyUseCase = require("../AddThreadCommentReplyUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe('AddThreadCommentReplyUseCase', () => {
    it("should orchestrate add thread comment reply action correctly", async () => {
        // Arrange
        const useCasePayload = {
            content: "Komentar"
        };
        const owner = "user-riakgu";
        const threadId = "thread-riakgu";
        const commentId = "comment-riakgu";

        /** Mock dependencies */
        const mockThreadRepository = new ThreadRepository();

        /** Mock the necessary functions */
        mockThreadRepository.verifyThreadCommentExists = jest.fn().mockResolvedValue();
        mockThreadRepository.addThreadCommentReply = jest.fn().mockResolvedValue({
            id: "reply-123",
            content: useCasePayload.content,
            owner,
        });

        /** Create instance of use case */
        const addThreadCommentReplyUseCase = new AddThreadCommentReplyUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedReply = await addThreadCommentReplyUseCase.execute(threadId, commentId, owner, useCasePayload);

        // Assert
        expect(addedReply).toStrictEqual({
            id: "reply-123",
            content: useCasePayload.content,
            owner,
        });

        expect(mockThreadRepository.verifyThreadCommentExists).toBeCalledWith(commentId, threadId);
        expect(mockThreadRepository.addThreadCommentReply).toBeCalledWith(commentId, owner, {
            content: useCasePayload.content,
        });
    });
});