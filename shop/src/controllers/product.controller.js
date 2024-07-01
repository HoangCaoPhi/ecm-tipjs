'use strict'

const { SuccessResponse } = require("../core/success.response")
const ProductService = require("../services/product.service.v2")

class ProductController {

    createNewProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create product success!',
            metaData: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userID
            })
        }).send(res)
    }

    //#region Update
    publishProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'publish product success',
            metaData: await ProductService.publishProductByShop({
                product_shop: req.user.userID,
                product_id: req.params.id
            })
        }).send(res)
    }

    unPublishProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'unpublish product success',
            metaData: await ProductService.unPublishProductByShop({
                product_shop: req.user.userID,
                product_id: req.params.id
            })
        }).send(res)
    }

    updateProductByID = async (req, res, next) => {
        new SuccessResponse({
            message: 'update product success',
            metaData: await ProductService.updateProduct({
                type: req.body.product_type,
                productID: req.params.productID,
                payload: {
                    ...req.body,
                    product_shop: req.user.userID
                }
            })
        }).send(res)
    }

    //#endregion

    //#region Query
    getAllDraftForShop = async (req, res, next) => {
        console.log("getAllDraftForShop", req.user.userID);
        new SuccessResponse({
            message: 'Get list draft success!',
            metaData: await ProductService.findAllDraftForShop({
                product_shop: req.user.userID
            })
        }).send(res)
    }

    getAllProductPublish = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list publish success!',
            metaData: await ProductService.getAllProductPublish({
                product_shop: req.user.userID
            })
        }).send(res)
    }

    searchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list product success!',
            metaData: await ProductService.searchProduct(req.params)
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list all product success!',
            metaData: await ProductService.findAllProduct(req.query)
        }).send(res)
    }

    getProductByID = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list all product success!',
            metaData: await ProductService.getProductByID({ product_id: req.params.id })
        }).send(res)
    }
    //#endregion
}

module.exports = new ProductController()

