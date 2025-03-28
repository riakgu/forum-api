class ThreadCommentLikeUseCase {
    constructor({threadRepository}) {
        this._threadRepository = threadRepository;
    }

    async execute(threadId, commentId, userId) {
        await this._threadRepository.verifyThreadCommentExists(commentId, threadId);

        const isLiked = await this._threadRepository.isCommentLiked(commentId, userId);

        if (isLiked) {
            await this._threadRepository.deleteCommentLike(commentId, userId);
        } else {
            await this._threadRepository.addCommentLike(commentId, userId);
        }
    }
}

module.exports = ThreadCommentLikeUseCase;