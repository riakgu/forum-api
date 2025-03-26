const ThreadCommentReply = require("../ThreadCommentReply");

describe('ThreadCommentReply entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'comment-riakgu',
            content: 'Komentar',
            date: 'Date',
        }

        // Action & Assert
        expect(() => new ThreadCommentReply(payload)).toThrowError('THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'comment-riakgu',
            content: 'Komentar',
            date: ['Date'],
            username: "riakgu",
        };

        // Action & Assert
        expect(() => new ThreadCommentReply(payload)).toThrowError('THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create ThreadCommentReply entities correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-riakgu',
            content: 'Komentar',
            date: 'Date',
            username: "riakgu",
        };

        // Action
        const threadCommentReply = new ThreadCommentReply(payload);

        // Assert
        expect(threadCommentReply).toBeInstanceOf(ThreadCommentReply);
        expect(threadCommentReply.id).toEqual(payload.id);
        expect(threadCommentReply.username).toEqual(payload.username);
        expect(threadCommentReply.date).toEqual(payload.date);
        expect(threadCommentReply.content).toEqual(payload.content);
    })
})