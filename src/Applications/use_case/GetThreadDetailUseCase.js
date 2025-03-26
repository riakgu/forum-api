const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const ThreadComment = require("../../Domains/threads/entities/ThreadComment");

class GetThreadDetailUseCase {
    constructor({threadRepository}) {
        this._threadRepository = threadRepository;
    }

    async execute(threadId) {
        const thread = await this._threadRepository.getThreadById(threadId);
        const comments = await this._threadRepository.getCommentsByThreadId(threadId);

        const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
            const replies = await this._threadRepository.getRepliesByCommentId(comment.id);
            return new ThreadComment({
                ...comment,
                replies,
            });
        }));

        return new ThreadDetail({
            ...thread,
            comments: commentsWithReplies,
        });
    }
}

module.exports = GetThreadDetailUseCase;