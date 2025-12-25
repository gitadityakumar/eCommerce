/**
 * Client-side utility for uploading files to Cloudflare R2 via pre-signed URLs.
 */

interface UploadOptions {
  folder?: 'products' | 'brands' | 'categories' | 'avatars' | 'misc';
  onProgress?: (progress: number) => void;
}

export async function uploadFileToR2(file: File, options: UploadOptions = {}) {
  const { folder = 'misc', onProgress } = options;

  // 1. Get pre-signed URL from our API
  const res = await fetch('/api/upload-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      folder,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to get upload URL');
  }

  const { uploadUrl, publicUrl } = await res.json();

  // 2. Upload file directly to R2 using XMLHttpRequest to track progress
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(publicUrl);
      }
      else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      console.error('XHR Network Error: This is likely a CORS issue. Please ensure your R2 bucket CORS policy allows PUT requests from this origin.');
      reject(new Error('Network error during upload - Check CORS settings on R2 bucket'));
    };

    xhr.send(file);
  });
}
