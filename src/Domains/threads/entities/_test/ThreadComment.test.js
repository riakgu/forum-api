const ThreadComment = require("../ThreadComment");

describe('ThreadComment entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'comment-riakgu',
            username: "riakgu",
            content: 'Komentar',
        }

        // Action & Assert
        expect(() => new ThreadComment(payload)).toThrowError('THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'comment-riakgu',
            username: "riakgu",
            date: ['Thread date'],
            content: 'Komentar',
        };

        // Action & Assert
        expect(() => new ThreadComment(payload)).toThrowError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create ThreadComment entities correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-riakgu',
            username: "riakgu",
            date: 'Thread date',
            content: 'Komentar',
        };

        // Action
        const threadComment = new ThreadComment(payload);

        // Assert
        expect(threadComment).toBeInstanceOf(ThreadComment);
        expect(threadComment.id).toEqual(payload.id);
        expect(threadComment.username).toEqual(payload.username);
        expect(threadComment.date).toEqual(payload.date);
        expect(threadComment.content).toEqual(payload.content);
    })
})