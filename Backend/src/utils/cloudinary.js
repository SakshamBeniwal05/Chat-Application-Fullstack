import { v2 as cloudinary } from "cloudinary"

const initializeCloudinary = async () => {
    await cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
}

export const cloudinaryUploader = async (file) => {
    try {
        await initializeCloudinary()
        const response = await cloudinary.uploader.upload(file, { resource_type: "auto" })
        return response
    } catch (error) {
        console.log(error);
    }
}

export const cloudinaryUpdateProfile = async (oldUrl, newfile) => {
    try {
        await initializeCloudinary()
        function extractor(url) {
            const cleanUrl = url.replace(/^https?:\/\//, "");
            const array = cleanUrl.split("/")
            const filename = array.pop();
            const product_id = filename.split(".")[0];
            return product_id;
        }

        const current_product_id = extractor(oldUrl)

        const response = await cloudinary.uploader.upload(newfile, {
            product_id: current_product_id,
            overwrite: true,
            resource_type: "auto"
        })
        return response
    } catch (error) {
        console.log(error);

    }
}