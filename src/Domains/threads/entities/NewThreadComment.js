class NewThreadComment {
    constructor(payload) {
        this._verifyPayload(payload);

        this.content = payload.content;
    }

    _verifyPayload(payload) {
        const { content } = payload;

        if (typeof content === "undefined") {
            throw new Error("NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        if (typeof content !== 'string') {
            throw new Error("NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }

        if (content.trim() === "") {
            throw new Error("NEW_THREAD_COMMENT.CONTENT_CANNOT_BE_EMPTY");
        }
    }
}

module.exports = NewThreadComment;