import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";

const API_HOST = process.env.REACT_APP_API_HOST;

const onUpload = (file) => {
    const promise = fetch(`${API_HOST}/api/editor/image/upload`, {
        method: "POST",
        headers: {
            "content-type": file?.type || "application/octet-stream",
            "x-vercel-filename": file?.name || "image.png",
        },
        body: file,
    });

    return new Promise((resolve, reject) => {
        toast.promise(
            promise.then(async (res) => {
                // Successfully uploaded image
                if (res.status === 200) {
                    const { url } = (await res.json());
                    // preload the image
                    const image = new Image();
                    image.src = url;
                    image.onload = () => {
                        resolve(url);
                    };
                    // No blob store configured
                } else if (res.status === 401) {
                    resolve(file);
                    throw new Error("`Environment variable not found, reading image locally instead.");
                    // Unknown error
                } else {
                    throw new Error("Error uploading image. Please try again.");
                }
            }),
            {
                loading: "Uploading image...",
                success: "Image uploaded successfully.",
                error: (e) => {
                    reject(e);
                    return e.message;
                },
            },
        );
    });
};

export const onDelete = (url) => {

    const imageId = url.split("/").at(-1).split(".")[0];
    const deleteRequest = fetch(`${API_HOST}/api/editor/image/delete/${imageId}`); 

    return new Promise((resolve, reject) => {
        toast.promise(
            deleteRequest.then(async (res) => {
                // Successfully uploaded image
                if (res.status === 200) {
                    resolve()
                } else {
                    throw new Error("Error deleting image.");
                }
            }),
            {
                loading: "Deleting image...",
                success: "Image deleted successfully.",
                error: (e) => {
                    reject(e);
                    return e.message;
                },
            },
        );
    });


}

export const uploadFn = createImageUpload({
    onUpload,
    validateFn: (file) => {
        if (!file.type.includes("image/")) {
            toast.error("File type not supported.");
            return false;
        }
        if (file.size / 1024 / 1024 > 20) {
            toast.error("File size too big (max 20MB).");
            return false;
        }
        return true;
    },
});
