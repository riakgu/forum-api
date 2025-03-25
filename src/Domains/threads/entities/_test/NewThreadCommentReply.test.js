const NewThreadCommentReply = require("../NewThreadCommentReply");

describe('NewThreadCommentReply entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {};

        // Action & Assert
        expect(() => new NewThreadCommentReply(payload)).toThrowError('NEW_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            content: ['content'],
        };

        // Action & Assert
        expect(() => new NewThreadCommentReply(payload)).toThrowError('NEW_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when content empty', () => {
        // Arrange
        const payload = {
            content: '',
        };

        // Action & Assert
        expect(() => new NewThreadCommentReply(payload)).toThrowError('NEW_THREAD_COMMENT_REPLY.CONTENT_CANNOT_BE_EMPTY');
    });

    it('should create NewThreadCommentReply entities correctly', () => {
        // Arrange
        const payload = {
            content: 'Komentar',
        };

        // Action
        const newThreadCommentReply = new NewThreadCommentReply(payload);

        // Assert
        expect(newThreadCommentReply).toBeInstanceOf(NewThreadCommentReply);
        expect(newThreadCommentReply.content).toEqual(payload.content);
    });
})