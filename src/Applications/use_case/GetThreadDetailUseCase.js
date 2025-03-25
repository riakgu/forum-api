const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class GetThreadDetailUseCase {
    constructor({threadRepository}) {
        this._threadRepository = threadRepository;
    }

    async execute(threadId) {
        const thread = await this._threadRepository.getThreadById(threadId);
        const comments = await this._threadRepository.getCommentsByThreadId(threadId);

        return new ThreadDetail({
            ...thread,
            comments,
        });
    }
}

module.exports = GetThreadDetailUseCase;