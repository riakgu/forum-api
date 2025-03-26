const ThreadCommentReply = require("./ThreadCommentReply");

class ThreadComment {
    constructor(payload) {
        this._verifyPayload(payload);

        this.id = payload.id;
        this.username = payload.username;
        this.date = payload.date;
        this.replies = payload.replies.map(reply => new ThreadCommentReply(reply));
        this.content = payload.content;
    }

    _verifyPayload(payload) {
        const { id, username, date, replies, content } = payload;

        if (!id || !username || !date || !replies || typeof content === "undefined") {
            throw new Error('THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || !Array.isArray(replies) || typeof content !== 'string') {
            throw new Error('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ThreadComment;