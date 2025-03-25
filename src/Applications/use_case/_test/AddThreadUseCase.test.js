const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it("should orchestrate add thread action correctly", async () => {
        // Arrange
        const useCasePayload = {
            title: "Thread title",
            body: "Thread body",
        };
        const owner = "user-riakgu";

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.addThread = jest.fn().mockResolvedValue({
            id: "thread-123",
            title: useCasePayload.title,
            owner: owner,
        });

        /** creating use case instance */
        const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });

        // Action
        const addedThread = await addThreadUseCase.execute(owner, useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual({
            id: "thread-123",
            title: useCasePayload.title,
            owner: owner,
        });
        expect(mockThreadRepository.addThread).toBeCalledWith(owner, new NewThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
        }));
    });
});
