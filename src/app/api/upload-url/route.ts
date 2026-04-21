import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { requireAdmin, requireUser } from '@/lib/auth/guards';
import { r2 } from '@/lib/cfstorage/r2';
import { checkRateLimit, rateLimitKey } from '@/lib/security/rate-limit';

const allowedTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const allowedFolders = ['products', 'brands', 'categories', 'avatars', 'misc'] as const;
const adminFolders = new Set<string>(['products', 'brands', 'categories', 'misc']);
const maxUploadSize = 5 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';
    const limit = checkRateLimit(rateLimitKey('upload-url', ip), 30, 15 * 60 * 1000);
    if (!limit.ok) {
      return Response.json({ error: 'Too many upload requests' }, { status: 429 });
    }

    const { fileType, fileSize, folder = 'misc' } = await req.json();

    if (!allowedFolders.includes(folder)) {
      return Response.json({ error: 'Invalid upload folder' }, { status: 400 });
    }

    if (!allowedTypes[fileType]) {
      return Response.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (typeof fileSize === 'number' && fileSize > maxUploadSize) {
      return Response.json({ error: 'File too large' }, { status: 400 });
    }

    const user = adminFolders.has(folder) ? await requireAdmin() : await requireUser();
    const keyPrefix = folder === 'avatars' ? `avatars/${user.id}` : folder;
    const key = `${keyPrefix}/${crypto.randomUUID()}.${allowedTypes[fileType]}`;

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
      publicUrl: `https://cdn.100xadi.com/${key}`,
    });
  }
  catch (error) {
    console.error('Error generating upload URL:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
