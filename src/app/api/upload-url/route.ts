import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2 } from '@/lib/cfstorage/r2';

export async function POST(req: Request) {
  try {
    const { fileName, fileType, folder = 'misc' } = await req.json();

    // 1. Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(fileType)) {
      return Response.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // 2. Sanitize folder and filename
    const sanitizedFolder = folder.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const extension = fileName.split('.').pop();
    const key = `${sanitizedFolder}/${crypto.randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET || 'preety-twist-images',
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(r2, command, {
      expiresIn: 60, // seconds
    });

    return Response.json({
      uploadUrl,
      key,
      publicUrl: `https://cdn.perpetuity.dev/${key}`,
    });
  }
  catch (error) {
    console.error('Error generating upload URL:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
