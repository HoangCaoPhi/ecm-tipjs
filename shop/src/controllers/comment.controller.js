'use strict'

const { SuccessResponse } = require("../core/success.response")
const { CreateComment, getCommentByParentId, deleteComment } = require("../services/comment.service")

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'create new comment',
            metaData: await create(req.body)
        }).send(res)
    }

    getComments = async (req, res, next) => {
        new SuccessResponse({
            message: 'get comments',
            metaData: await getCommentByParentId(req.query)
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'delete comment',
            metaData: await deleteComment(req.body)
        }).send(res)
    }
}

module.exports = new CommentController()