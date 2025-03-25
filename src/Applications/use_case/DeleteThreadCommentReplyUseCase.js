class DeleteThreadCommentReplyUseCase {
    constructor({threadRepository}) {
        this._threadRepository = threadRepository;
    }

    async execute(replyId, commentId, threadId, userId) {
        await this._threadRepository.verifyThreadExists(threadId);
        await this._threadRepository.verifyThreadCommentExists(commentId, threadId);
        await this._threadRepository.verifyThreadCommentReplyExists(replyId, commentId);
        await this._threadRepository.verifyThreadCommentReplyOwner(replyId, userId)
        await this._threadRepository.deleteThreadCommentReply(replyId);
    }
}

module.exports = DeleteThreadCommentReplyUseCase;