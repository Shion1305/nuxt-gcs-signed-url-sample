import {GetSignedUrlConfig, Storage} from '@google-cloud/storage';

export default defineEventHandler(async (event) => {
    return generateV4DownloadLink()
})

const storage = new Storage({
    keyFilename: './credential/mypage-staging-shion-dev.json'
});

async function generateV4DownloadLink() {
    // These options will allow temporary uploading of the file with outgoing
    // Content-Type: application/octet-stream header.
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 5 * 1000, // 5 seconds
        // zip file
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
