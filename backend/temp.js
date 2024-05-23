import fetch from "node-fetch";
import fs from "fs";

async function query(data) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                headers: { Authorization: `Bearer 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` },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const blobData = await response.blob();
        return blobData;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function saveBlobToDisk() {
    try {
        const data = await query({ "inputs": "Create an image of bare chested priety zinta, sharp,skin texture, no bra, nipples,natural lighting, no makeup" });
        if (data) {
            // Create a writable stream
            const writerStream = fs.createWriteStream("image.jpg");

            // Write the blob data to the file
            data.arrayBuffer().then(buffer => {
                writerStream.write(Buffer.from(buffer));
                writerStream.end();

                console.log("Image saved successfully.");
            }).catch(error => {
                console.error("Error writing to file:", error);
            });
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

saveBlobToDisk();
