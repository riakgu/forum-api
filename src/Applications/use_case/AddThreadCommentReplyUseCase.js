const NewThreadCommentReply = require("../../Domains/threads/entities/NewThreadCommentReply");

class AddThreadCommentReplyUseCase {
    constructor({threadRepository}) {
        this._threadRepository = threadRepository;
    }

    async execute(threadId, commentId, owner, useCasePayload) {
        await this._threadRepository.verifyThreadCommentExists(commentId, threadId);
        const newReply = new NewThreadCommentReply(useCasePayload);
        return this._threadRepository.addThreadCommentReply(commentId, owner, newReply);
    }
}

module.exports = AddThreadCommentReplyUseCase;