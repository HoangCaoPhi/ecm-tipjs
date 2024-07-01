'use strict'

const { NotFoundError } = require('../core/error.response');
const commentModel = require('../models/comment.model');
const productModel = require('../models/product.model');
const { convertToObjectIdMongo } = require("../utils")

class CommentService {
    static async createComment({ productId, userId, content, parentCommentId = null }) {
        const comment = new commentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue;
        if (parentCommentId) {
            const parentComment = await commentModel.findById(parentCommentId)
            if (!parentComment) {
                throw new NotFoundError("Parent Comment not exits")
            }

            rightValue = parentComment.comment_right
            await commentModel.updateMany({
                comment_productId: convertToObjectIdMongo(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            await commentModel.updateMany({
                comment_productId: convertToObjectIdMongo(productId),
                comment_left: { $gt: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })
        }
        else {
            const maxRightValue = await commentModel.findOne({
                comment_productId: convertToObjectIdMongo(productId)
            }, 'comment_right', { sort: { comment_right: -1 } })

            if (maxRightValue) {
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

    static async getCommentByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0
    }) {
        if(parentCommentId) {
            const parentComment = await commentModel.findById(parentCommentId)
            if(!parentComment) throw new NotFoundError("ParentComment dose not exits")

            const comments = await commentModel.find({
                comment_productId: convertToObjectIdMongo(productId),
                comment_left: {$gt: parentComment.comment_left},
                comment_right: {$lte: parentComment.comment_right}
            })
            .select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            })
            .sort({
                comment_left: 1
            })

            return comments
        }

        const comments = await commentModel.find({
            comment_productId: convertToObjectIdMongo(productId),
            comment_parentId: parentCommentId
        })
        .select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        })
        .sort({
            comment_left: 1
        })

        return comments
    }

    static async deleteComment({commentId, productId}) {
        const product = await productModel.findById(productId)
        if(!product) throw new NotFoundError("Product not found")        

        const comment = await commentModel.findById(commentId)
        if(!comment) throw new NotFoundError("Comment not found")

        const leftValue = comment.comment_left
        const rightValue = comment.comment_right

        const width = rightValue - leftValue + 1

        await commentModel.deleteMany({
            comment_productId: convertToObjectIdMongo(productId),
            comment_left: { $gte: leftValue, $lte: rightValue}            
        })

        await commentModel.updateMany({
            comment_productId: convertToObjectIdMongo(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: {comment_right: - width }
        })

        await commentModel.updateMany({
            comment_productId: convertToObjectIdMongo(productId),
            comment_left: { $gt: rightValue }
        }, {
            $inc: {comment_left: - width }
        })

        return true;
    }   
}

module.exports = CommentService;