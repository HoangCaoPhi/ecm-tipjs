'use strict'

const { cloudinary } = require("../configs/cloudinary.config");


// 1. Upload from url
const uploadImageFromUrl = async () => {
    try {
        const urlImage = "https://wallpapercave.com/wp/6Zi3yGl.jpg";
        const folderName = "product/shopId";
        const newFileName = "test_demo";

        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName
        })

        console.log(result);

        return result;
    } catch (error) {
        console.error(error);
    }
}

const uploadImageFromLocal = async ({
    path,
    folder = "product"
}) => {
    try {

        const result = await cloudinary.uploader.upload(path, {
            public_id: "thumb",
            folder: folder
        })

        return {
            image_url: result.secure_url,
            thum_url: await cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: 'jpg'
            })
        };

    } catch (error) {
        console.error(`upload from local failed`, error);
    }
}
// uploadImageFromUrl().catch((error) => { console.error(error); });
module.exports = { uploadImageFromUrl, uploadImageFromLocal };