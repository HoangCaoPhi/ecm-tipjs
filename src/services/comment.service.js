'use strict'

const commentModel = require('../models/comment.model')
const { convertToObjectIdMongo } = require("../utils")

class CommentService {
    static async CreateComment({ productId, userId, content, parentCommentId = null }) {
        const comment = new commentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue;
        if (parentCommentId) {
            // trả lời comment

        }
        else {
            const maxRightValue = await commentModel.findOne({
                comment_productId: convertToObjectIdMongo(productId)
            }, 'comment_right', { sort: { comment_right: -1 } })

            if(maxRightValue) {
                rightValue = maxRightValue.right + 1
            }
            else {
                rightValue = 1
            }
        }

        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()
        return comment
    }
}

module.exports = CommentService;