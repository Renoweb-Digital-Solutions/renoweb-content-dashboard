export async function uploadFile(folderPath, file) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";

    if (!cloudName) {
        throw new Error("Cloudinary cloud name is missing in environment variables");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    // Optional: Organise uploads into folders (requires unsigned preset to allow folders)
    // We derive a folder name from the folderPath (e.g. "blog-images/xyz" -> "renoweb_cms/blog-images")
    if (folderPath) {
        const folder = folderPath.split('/')[0] || "misc";
        formData.append("folder", `renoweb_cms/${folder}`);
    }

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Failed to upload to Cloudinary");
    }

    const data = await res.json();
    return data.secure_url;
}
