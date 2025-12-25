'use client';

import { CloudUpload, GripVertical, XIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sortable, SortableItem, SortableItemHandle } from '@/components/ui/sortable';
import { uploadFileToR2 } from '@/lib/cfstorage/r2-upload';
import { cn } from '@/lib/utils';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface SortableImage {
  id: string;
  src: string;
  alt: string;
  type: 'default' | 'uploaded';
  status?: 'uploading' | 'completed' | 'error';
  progress?: number;
}

interface ImageUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  className?: string;
  onImagesChange?: (images: ImageFile[]) => void;
  onUploadComplete?: (images: ImageFile[]) => void;
}

export default function SortableImageUpload({
  maxFiles = 5, // Changed to 5 as per UI reference
  maxSize = 10 * 1024 * 1024, // 10MB as per UI reference
  accept = 'image/*',
  className,
  onImagesChange,
  onUploadComplete,
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [allImages, setAllImages] = useState<SortableImage[]>([]);

  // Helper function to create SortableImage from ImageFile
  const createSortableImage = useCallback(
    (imageFile: ImageFile): SortableImage => ({
      id: imageFile.id,
      src: imageFile.preview,
      alt: imageFile.file.name,
      type: 'uploaded',
      status: imageFile.status,
      progress: imageFile.progress,
    }),
    [],
  );

  // Ensure arrays never contain undefined items
  useEffect(() => {
    setAllImages(prev => prev.filter(item => item && item.id));
    setImages(prev => prev.filter(item => item && item.id));
  }, []);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'File must be an image';
    }
    if (file.size > maxSize) {
      return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
    }
    if (images.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }
    return null;
  };

  const handleUpload = useCallback(async (imageFile: ImageFile) => {
    try {
      const publicUrl = await uploadFileToR2(imageFile.file, {
        folder: 'products',
        onProgress: (progress) => {
          setImages(prev => prev.map(img => (img.id === imageFile.id ? { ...img, progress } : img)));
          setAllImages(prev => prev.map(img => img.id === imageFile.id ? { ...img, progress } : img));
        },
      });

      const updateState = (prev: ImageFile) => (prev.id === imageFile.id ? { ...prev, progress: 100, status: 'completed' as const, preview: publicUrl } : prev);

      setImages((currentImages) => {
        const updatedImages = currentImages.map(updateState);
        if (updatedImages.every(img => img.status === 'completed')) {
          onUploadComplete?.(updatedImages);
        }
        return updatedImages;
      });

      setAllImages(prev => prev.map(img => img.id === imageFile.id ? { ...img, progress: 100, status: 'completed' as const, src: publicUrl } : img));
    }
    catch (error) {
      console.error('R2 Upload Error:', error);
      const updateError = (img: any) => img.id === imageFile.id ? { ...img, status: 'error' as const, error: 'Upload failed' } : img;
      setImages(prev => prev.map(updateError));
      setAllImages(prev => prev.map(updateError));
    }
  }, [onUploadComplete]);

  const addImages = useCallback(
    (files: FileList | File[]) => {
      const newImages: ImageFile[] = [];

      Array.from(files).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          // Silent fail for errors as requested (no alerts)
          return;
        }

        const imageFile: ImageFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: 'uploading',
        };

        newImages.push(imageFile);
      });

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImagesChange?.(updatedImages);

        // Add new images to allImages for sorting
        const newSortableImages = newImages.map(createSortableImage);
        setAllImages(prev => [...prev, ...newSortableImages]);

        // Start real R2 upload
        newImages.forEach((imageFile) => {
          handleUpload(imageFile);
        });
      }
    },
    [images, maxSize, maxFiles, onImagesChange, createSortableImage, handleUpload],
  );

  const removeImage = useCallback(
    (id: string) => {
      // Remove from allImages
      setAllImages(prev => prev.filter(img => img.id !== id));

      // If it's an uploaded image, also remove from images array and revoke URL
      const uploadedImage = images.find(img => img.id === id);
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage.preview);
        setImages(prev => prev.filter(img => img.id !== id));
      }
    },
    [images],
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        addImages(files);
      }
    },
    [addImages],
  );

  const openFileDialog = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = accept;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        addImages(target.files);
      }
    };
    input.click();
  }, [accept, addImages]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0)
      return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className={cn('w-full max-w-4xl', className)}>
      {/* Instructions */}
      <div className="mb-4 text-center">
        <p className="text-sm text-muted-foreground">
          Upload up to
          {' '}
          {maxFiles}
          {' '}
          images (JPG, PNG, GIF, WebP, max
          {' '}
          {formatBytes(maxSize)}
          {' '}
          each).
          {' '}
          <br />
          Drag and drop images to reorder.
          {images.length > 0 && ` ${images.length}/${maxFiles} uploaded.`}
        </p>
      </div>

      {/* Upload Area */}
      <Card
        className={cn(
          'border-dashed shadow-none rounded-md transition-colors mb-6',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className="text-center pt-6">
          <div className="flex items-center justify-center size-[32px] rounded-full border border-border mx-auto mb-3">
            <CloudUpload className="size-4" />
          </div>
          <h3 className="text-sm text-foreground font-semibold mb-0.5 px-4 md:px-0">Choose a file or drag & drop here.</h3>
          <span className="text-xs text-secondary-foreground font-normal block mb-3">
            JPEG, PNG, up to
            {' '}
            {formatBytes(maxSize)}
            .
          </span>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            onClick={openFileDialog}
          >
            Browse File
          </button>
        </CardContent>
      </Card>

      {/* Image Grid with Sortable */}
      <div className="mt-6">
        {/* Combined Images Sortable */}
        <Sortable
          value={allImages.map(item => item.id)}
          onValueChange={(newItemIds) => {
            // Reconstruct the allImages array based on the new order
            const newAllImages = newItemIds
              .map((itemId) => {
                // First try to find in allImages (default images)
                const existingImage = allImages.find(img => img.id === itemId);
                if (existingImage)
                  return existingImage;

                // If not found, it's a newly uploaded image
                const uploadedImage = images.find(img => img.id === itemId);
                if (uploadedImage) {
                  return createSortableImage(uploadedImage);
                }
                return null;
              })
              .filter((item): item is SortableImage => item !== null);

            setAllImages(newAllImages);
          }}
          getItemValue={item => item}
          strategy="grid"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 auto-rows-fr"
          onDragEnd={() => {}}
        >
          {allImages.map(item => (
            <SortableItem key={item.id} value={item.id}>
              <div className="flex items-center justify-center rounded-md bg-accent/50 shadow-none shrink-0 relative group border border-border hover:z-10 data-[dragging=true]:z-50 transition-all duration-200 hover:bg-accent/70 h-[120px] overflow-hidden">
                <img
                  src={item.src}
                  className={cn(
                    'h-full w-full object-cover rounded-md pointer-events-none transition-opacity duration-300',
                    item.status === 'uploading' ? 'opacity-40' : 'opacity-100',
                  )}
                  alt={item.alt}
                />

                {/* Loader Overlay */}
                {item.status === 'uploading' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                    <div className="relative size-8 mb-1.5">
                      {/* Circular Progress (fallback using Progress component if it were circular, but we'll use a CSS ring or just text for simplicity/speed) */}
                      <div className="absolute inset-0 rounded-full border-2 border-border" />
                      <div
                        className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-foreground">
                      {Math.round(item.progress ?? 0)}
                      %
                    </span>
                  </div>
                )}

                {/* Drag Handle - Hidden during upload */}
                {item.status !== 'uploading' && (
                  <SortableItemHandle className="absolute top-2 start-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing">
                    <Button variant="outline" size="icon" className="size-6 rounded-full bg-background/80 backdrop-blur-sm">
                      <GripVertical className="size-3.5" />
                    </Button>
                  </SortableItemHandle>
                )}

                {/* Remove Button Overlay - Hidden during upload */}
                {item.status !== 'uploading' && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(item.id);
                    }}
                    variant="outline"
                    size="icon"
                    className="shadow-sm absolute top-2 end-2 size-6 opacity-0 group-hover:opacity-100 rounded-full bg-background/80 backdrop-blur-sm"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                )}
              </div>
            </SortableItem>
          ))}
        </Sortable>
      </div>
    </div>
  );
}
