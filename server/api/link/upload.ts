import {GetSignedUrlConfig, Storage} from '@google-cloud/storage';

export default defineEventHandler(async (event) => {
    const url = await generateV4UploadSignedUrl()
    return url
})

const storage = new Storage({
    keyFilename: './credential/mypage-staging-shion-dev.json'
});

async function generateV4UploadSignedUrl() {
    const options = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 5 * 1000, // 5 seconds
        // zip file
        contentType: 'application/x-zip-compressed',
        host: 'https://storage.googleapis.com',
        extensionHeaders: {
            'x-goog-meta-username': 'shion1305',
        }
    } as GetSignedUrlConfig;

    // Get a v4 signed URL for uploading file
    const [url] = await storage
        .bucket("ynufes-mypage-staging-bucket")
        .file("test")
        .getSignedUrl(options);

    console.log(url);
    return url
}
