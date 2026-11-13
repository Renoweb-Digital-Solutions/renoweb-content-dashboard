export async function uploadFile(folderPath, file) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";

    if (!cloudName) {
        throw new Error("Cloudinary cloud name is missing in environment variables");
    }

    // A Blob (e.g. from fetch(blobUrl).blob()) has no filename, so FormData names it
    // "blob". Our upload preset uses the original filename as the public_id, so every
    // inline image landed on the same ".../blob.png" and overwrote the previous one.
    // Give nameless blobs the unique filename the caller built into folderPath.
    let uploadBody = file;
    if (!(file instanceof File) && folderPath) {
        const uniqueName = folderPath.split("/").pop();
        uploadBody = new File([file], uniqueName, { type: file.type });
    }

    const formData = new FormData();
    formData.append("file", uploadBody, uploadBody.name);
    formData.append("upload_preset", uploadPreset);

    // Optional: Organise uploads into folders (requires unsigned preset to allow folders)
    // We derive a folder name from the folderPath (e.g. "blog-images/xyz" -> "renoweb_cms/blog-images")
    if (folderPath) {
        // folderPath is like "blog-images/renoweb/slug.jpg". We want the directory part.
        const parts = folderPath.split('/');
        parts.pop(); // remove filename
        const folder = parts.length > 0 ? parts.join('/') : "misc";
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
