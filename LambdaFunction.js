import { S3 } from 'aws-sdk';
const s3 = new S3();

export async function handler(event) {
    const body = JSON.parse(event.body);
    const { metadata, file } = body; 

    const fileName = `${metadata.email}-${Date.now()}.mp4`;

    const buffer = Buffer.from(file, 'base64');

    const params = {
        Bucket: 'BUCKET_NAME',
        Key: fileName,
        Body: buffer,
        ContentType: 'video/mp4',
        Metadata: {
            ...metadata
        }
    };

    try {
        const s3Response = await s3.upload(params).promise();

        const updatedMetadata = {
            ...metadata,
            videoUrl: s3Response.Location
        };

        const copyParams = {
            Bucket: 'BUCKET_NAME',
            Key: fileName,
            CopySource: `${'BUCKET_NAME'}/${fileName}`,
            Metadata: updatedMetadata,
            MetadataDirective: 'REPLACE'
        };

        await s3.copyObject(copyParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'File uploaded successfully',
                fileUrl: s3Response.Location,
                metadata: metadata
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
