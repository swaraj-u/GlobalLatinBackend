import { S3 } from 'aws-sdk';
const s3 = new S3();

export async function handler(event) {
    const body = JSON.parse(event.body);
    const { metadata, file } = body; 

    const bucketName = 'BUCKET_NAME';
    const region = 'region';
    const fileName = `${metadata.email}-${Date.now()}.mp4`;
    const s3URL = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`

    const buffer = Buffer.from(file, 'base64');

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: 'video/mp4',
        Metadata: {
            s3URL: s3URL,
            ...metadata
        }
    };

    try {
        const s3Response = await s3.upload(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'File uploaded successfully',
                fileUrl: s3Response.Location,
                metadata: {
                    ...metadata,
                    videoUrl: s3Response.Location
                }
            })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error uploading file',
                error: error.message
            })
        };
    }
}
