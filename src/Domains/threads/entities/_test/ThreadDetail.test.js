const ThreadDetail = require('../ThreadDetail');
const ThreadComment = require("../ThreadComment");

describe('ThreadDetail entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'thread-riakgu',
            title: 'Thread title',
            body: 'Thread body',
            date: 'Thread date',
            username: 'riakgu',
        };

        // Action & Assert
        expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            title: 'Thread title',
            body: 'Thread body',
            date: 'Thread date',
            username: 'riakgu',
            comments: 'comments',
        };

        // Action & Assert
        expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create ThreadDetail entities correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-riakgu',
            title: 'Thread title',
            body: 'Thread body',
            date: 'Thread date',
            username: 'riakgu',
            comments: [
                {
                    id: 'comment-riakgu',
                    username: 'riakgu',
                    date: 'Date',
                    replies: [],
                    content: 'Komentar',
                    likeCount: 5,
                }
            ],
        };

        // Action
        const threadDetail = new ThreadDetail(payload);

        // Assert
        expect(threadDetail).toBeInstanceOf(ThreadDetail);
        expect(threadDetail.id).toEqual(payload.id);
        expect(threadDetail.title).toEqual(payload.title);
        expect(threadDetail.body).toEqual(payload.body);
        expect(threadDetail.date).toEqual(payload.date);
        expect(threadDetail.username).toEqual(payload.username);
        expect(threadDetail.comments).toHaveLength(1);
        expect(threadDetail.comments[0]).toBeInstanceOf(ThreadComment);
        expect(threadDetail.comments[0].replies).toEqual([]);
    });
});