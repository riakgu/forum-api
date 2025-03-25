const NewThreadComment = require("../../Domains/threads/entities/NewThreadComment");

class AddThreadCommentUseCase {
    constructor({threadRepository}) {
        this._threadRepository = threadRepository;
    }

    async execute(threadId, owner, useCasePayload) {
        await this._threadRepository.verifyThreadExists(threadId);
        const newComment = new NewThreadComment(useCasePayload);
        return this._threadRepository.addThreadComment(threadId, owner, newComment);
    }

}

module.exports = AddThreadCommentUseCase;