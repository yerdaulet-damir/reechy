export const runtime = 'edge';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { fileType } = await req.json();

    if (!fileType) {
      return Response.json({ error: 'File type is required' }, { status: 400 });
    }

    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) {
      console.error('Missing required R2 environment variables');
      return Response.json({ error: 'Storage configuration error' }, { status: 500 });
    }

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    // Generate a unique file name
    const videoId = crypto.randomUUID();
    const extension = fileType.split('/')[1] || 'webm';
    const key = `videos/${videoId}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    // URL expires in 15 minutes
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    // Ensure we don't accidentally get https://https:// from the env variable
    const domain = process.env.R2_PUBLIC_DOMAIN.replace(/^https?:\/\//, '');
    const publicUrl = `https://${domain}/${key}`;

    return Response.json({
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
