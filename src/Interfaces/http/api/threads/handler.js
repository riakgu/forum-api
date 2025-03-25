const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require("../../../../Applications/use_case/DeleteThreadCommentUseCase");
const GetThreadDetailUseCase = require("../../../../Applications/use_case/GetThreadDetailUseCase");
const AddThreadCommentReplyUseCase = require("../../../../Applications/use_case/AddThreadCommentReplyUseCase");

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
        this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
        this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
        this.postThreadCommentReplyHandler = this.postThreadCommentReplyHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const { id: owner } = request.auth.credentials;

        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const addedThread = await addThreadUseCase.execute(owner, request.payload);

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async postThreadCommentHandler(request, h) {
        const { id: owner } = request.auth.credentials;
        const { threadId } = request.params;

        const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);
        const addedComment = await addThreadCommentUseCase.execute(threadId, owner, request.payload);

        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    async deleteThreadCommentHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        const { threadId, commentId } = request.params;

        const deleteThreadCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name);
        await deleteThreadCommentUseCase.execute(commentId, threadId, userId);

        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }

    async getThreadDetailHandler(request, h) {
        const { threadId } = request.params;

        const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
        const thread = await getThreadDetailUseCase.execute(threadId);

        const response = h.response({
            status: 'success',
            data: {
                thread,
            },
        });
        response.code(200);
        return response;
    }

    async postThreadCommentReplyHandler(request, h) {
        const { id: owner } = request.auth.credentials;
        const { threadId, commentId } = request.params;

        const addThreadCommentReplyUseCase = this._container.getInstance(AddThreadCommentReplyUseCase.name);
        const addedReply = await addThreadCommentReplyUseCase.execute(threadId, commentId, owner, request.payload);

        const response = h.response({
            status: 'success',
            data: {
                addedReply,
            },
        });
        response.code(201);
        return response;
    }
}

module.exports = ThreadsHandler;