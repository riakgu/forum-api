class ThreadCommentReply {
    constructor(payload) {
        this._verifyPayload(payload);

        this.id = payload.id;
        this.content = payload.content;
        this.date = payload.date;
        this.username = payload.username;
    }

    _verifyPayload(payload) {
        const { id, content, date, username } = payload;

        if (!id || !username || !date || typeof content === "undefined") {
            throw new Error('THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string') {
            throw new Error('THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ThreadCommentReply;