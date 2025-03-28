const ThreadComment = require("../ThreadComment");
const ThreadCommentReply = require("../ThreadCommentReply");

describe('ThreadComment entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'comment-riakgu',
            username: "riakgu",
            date: 'Thread date',
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
            date: 'Thread date',
            replies: {},
            content: 'Komentar',
            likeCount: "90",
        }

        // Action & Assert
        expect(() => new ThreadComment(payload)).toThrowError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create ThreadComment entities correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-riakgu',
            username: "riakgu",
            date: 'Thread date',
            replies: [
                { id: 'comment-riakgu', content: 'Komentar', date: 'Date', username: "riakgu", }
            ],
            content: 'Komentar',
            likeCount: 5
        }

        // Action
        const threadComment = new ThreadComment(payload);

        // Assert
        expect(threadComment).toBeInstanceOf(ThreadComment);
        expect(threadComment.id).toEqual(payload.id);
        expect(threadComment.username).toEqual(payload.username);
        expect(threadComment.date).toEqual(payload.date);
        expect(threadComment.content).toEqual(payload.content);
        expect(threadComment.likeCount).toEqual(payload.likeCount);
        expect(threadComment.replies).toEqual(payload.replies);
        expect(threadComment.replies).toHaveLength(1);
        expect(threadComment.replies[0]).toBeInstanceOf(ThreadCommentReply);
    })
})