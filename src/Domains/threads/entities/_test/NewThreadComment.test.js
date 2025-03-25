const NewThreadComment = require('../NewThreadComment');

describe('NewThreadComment entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {};

        // Action & Assert
        expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            content: ['content'],
        };

        // Action & Assert
        expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when content empty', () => {
        // Arrange
        const payload = {
            content: '',
        };

        // Action & Assert
        expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.CONTENT_CANNOT_BE_EMPTY');
    });

    it('should create NewThreadComment entities correctly', () => {
        // Arrange
        const payload = {
            content: 'Komentar',
        };

        // Action
        const newThreadComment = new NewThreadComment(payload);

        // Assert
        expect(newThreadComment).toBeInstanceOf(NewThreadComment);
        expect(newThreadComment.content).toEqual(payload.content);
    });
})