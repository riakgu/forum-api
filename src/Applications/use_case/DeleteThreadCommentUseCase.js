class DeleteThreadCommentUseCase {
    constructor({threadRepository}) {
        this._threadRepository = threadRepository;
    }

    async execute(commentId, threadId, userId) {
        await this._threadRepository.verifyThreadExists(threadId);
        await this._threadRepository.verifyThreadCommentExists(commentId, threadId);
        await this._threadRepository.verifyThreadCommentOwner(commentId, userId)
        await this._threadRepository.deleteThreadComment(commentId);
    }
}

module.exports = DeleteThreadCommentUseCase;