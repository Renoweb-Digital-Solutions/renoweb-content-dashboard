"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extracts public_id from a Cloudinary URL and deletes it
 * @param {string[]} urls - Array of Cloudinary URLs
 */
export async function deleteCloudinaryFiles(urls) {
    if (!urls || urls.length === 0) return { success: true };

    try {
        const publicIds = urls.map(url => {
            // Extract public_id from secure_url
            // Example: https://res.cloudinary.com/wljcdcur/image/upload/v1234567/renoweb_cms/blog-images/xyz.png
            const parts = url.split('/upload/');
            if (parts.length < 2) return null;
            
            // Remove version (v1234567) if present, then remove extension (.png)
            let path = parts[1];
            if (path.match(/^v\d+\//)) {
                path = path.replace(/^v\d+\//, '');
            }
            // Remove the extension
            const lastDotIndex = path.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                path = path.substring(0, lastDotIndex);
            }
            return path;
        }).filter(Boolean);

        if (publicIds.length > 0) {
            console.log("Deleting Cloudinary public_ids:", publicIds);
            // Delete up to 100 at a time using Admin API or use Promise.all with Uploader
            await Promise.all(publicIds.map(id => cloudinary.uploader.destroy(id)));
        }

        return { success: true };
    } catch (error) {
        console.error("Cloudinary deletion error:", error);
        return { success: false, error: error.message };
    }
}
