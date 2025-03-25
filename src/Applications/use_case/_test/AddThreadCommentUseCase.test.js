const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadCommentUseCase = require("../AddThreadCommentUseCase");
const NewThreadComment = require("../../../Domains/threads/entities/NewThreadComment");

describe('AddThreadCommentUseCase', () => {
    it("should orchestrate add thread comment action correctly", async () => {
        // Arrange
        const useCasePayload = {
            content: "Komentar"
        };
        const owner = "user-riakgu";
        const threadId = "thread-riakgu";

        /** Mock dependencies */
        const mockThreadRepository = new ThreadRepository();

        /** Mock the necessary functions */
        mockThreadRepository.verifyThreadExists = jest.fn().mockResolvedValue();
        mockThreadRepository.addThreadComment = jest.fn().mockResolvedValue({
            id: "comment-123",
            content: useCasePayload.content,
            owner,
        });

        /** Create instance of use case */
        const addThreadCommentUseCase = new AddThreadCommentUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedThreadComment = await addThreadCommentUseCase.execute(threadId, owner, useCasePayload);

        // Assert
        expect(addedThreadComment).toStrictEqual({
            id: "comment-123",
            content: useCasePayload.content,
            owner,
        });

        expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
        expect(mockThreadRepository.addThreadComment).toBeCalledWith(threadId, owner, {
            content: useCasePayload.content,
        });
    });
});
