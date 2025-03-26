const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadComment = require("../../../Domains/threads/entities/ThreadComment");

describe('GetThreadDetailUseCase',  () => {
    it('should be able to get the thread detail',async () => {
        // Arrange
        const mockThread = {
            id: 'thread-999',
            title: 'Thread title',
            body: 'Thread body',
            date: 'Thread date',
            username: '999',
        };

        const mockComments = [
            {
                id: 'comment-999',
                username: "999",
                date: 'Thread date',
                content: 'Komentar',
            },
        ];

        const mockReplies = [
            {
                id: 'reply-999',
                content: 'Balasan',
                date: 'Date',
                username: "999"
            },
        ];

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockThread));
        mockThreadRepository.getCommentsByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve(mockComments));
        mockThreadRepository.getRepliesByCommentId = jest.fn()
            .mockImplementation(() => Promise.resolve(mockReplies));

        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
        });

        // Act
        const threadDetail = await getThreadDetailUseCase.execute(mockThread.id);

        // Assert
        expect(threadDetail).toBeInstanceOf(ThreadDetail);
        expect(threadDetail.comments[0]).toBeInstanceOf(ThreadComment);
        expect(threadDetail).toStrictEqual(new ThreadDetail({
            ...mockThread,
            comments: [
                new ThreadComment({
                    ...mockComments[0],
                    replies: mockReplies,
                }),
            ],
        }));
        expect(mockThreadRepository.getThreadById)
            .toHaveBeenCalledWith(mockThread.id);
        expect(mockThreadRepository.getCommentsByThreadId)
            .toHaveBeenCalledWith(mockThread.id);
        expect(mockThreadRepository.getRepliesByCommentId)
            .toHaveBeenCalledWith(mockComments[0].id);
    })
})