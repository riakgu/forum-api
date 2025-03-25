class NewThreadCommentReply {
    constructor(payload) {
        this._verifyPayload(payload);

        this.content = payload.content;
    }

    _verifyPayload(payload) {
        const { content } = payload;

        if (typeof content === "undefined") {
            throw new Error("NEW_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        if (typeof content !== 'string') {
            throw new Error("NEW_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }

        if (content.trim() === "") {
            throw new Error("NEW_THREAD_COMMENT_REPLY.CONTENT_CANNOT_BE_EMPTY");
        }
    }
}

module.exports = NewThreadCommentReply;