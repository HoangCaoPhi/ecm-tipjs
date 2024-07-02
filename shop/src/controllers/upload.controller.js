'use strict'

const { SuccessResponse } = require("../core/success.response")
const { uploadImageFromUrl, uploadImageFromLocal } = require("../services/upload.service")

class UploadController {
    uploadFile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Upload file url',
            metaData: await uploadImageFromUrl()
        }).send(res)
    }

    uploadFileThumb = async (req, res, next) => {
        try {
            const { file } = req;
    
            if (!file) {
                throw new Error(`Upload file error: No file uploaded`);
            }
    
            const uploadedImageUrl = await uploadImageFromLocal(file);
    
            new SuccessResponse({
                message: 'Upload file url',
                metaData: uploadedImageUrl
            }).send(res);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new UploadController()