const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');

describe('GetThreadDetailUseCase',  () => {
    it('should be able to get the thread detail',async () => {
        const mockThread = {
            id: 'thread-1123',
            title: 'Thread title',
            body: 'Thread body',
            date: 'Thread date',
            username: '233232',
        };
        const mockComments = [
            {
                id: 'comment-32323',
                content: 'Komentar',
                date: 'Date',
                username: 'riakgu'
            },
        ];
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockThread));
        mockThreadRepository.getCommentsByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve(mockComments));

        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
        });

        // Act
        const threadDetail = await getThreadDetailUseCase.execute(mockThread.id);

        // Assert
        expect(threadDetail).toBeInstanceOf(ThreadDetail);
        expect(threadDetail).toStrictEqual(new ThreadDetail({
            ...mockThread,
            comments: mockComments,
        }));
        expect(mockThreadRepository.getThreadById)
            .toHaveBeenCalledWith(mockThread.id);
        expect(mockThreadRepository.getCommentsByThreadId)
            .toHaveBeenCalledWith(mockThread.id);
    })
})