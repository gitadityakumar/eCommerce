'use client';

import { CloudUpload, GripVertical, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sortable, SortableItem, SortableItemHandle } from '@/components/ui/sortable';
import { cn } from '@/lib/utils';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  className?: string;
  onImagesChange?: (images: ImageFile[]) => void;
  /** @deprecated Images are now uploaded on form submission */
  onUploadComplete?: (images: ImageFile[]) => void;
}

export default function SortableImageUpload({
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  accept = 'image/*',
  className,
  onImagesChange,
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'File must be an image';
    }
    if (file.size > maxSize) {
      return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
    }
    return null;
  };

  const addImages = useCallback(
    (files: FileList | File[]) => {
      const remainingSlots = maxFiles - images.length;
      if (remainingSlots <= 0)
        return;

      const newImages: ImageFile[] = [];
      const filesArray = Array.from(files).slice(0, remainingSlots);

      filesArray.forEach((file) => {
        const error = validateFile(file);
        if (error)
          return;

        const imageFile: ImageFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
        };

        newImages.push(imageFile);
      });

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImagesChange?.(updatedImages);
      }
    },
    [images, maxSize, maxFiles, onImagesChange],
  );

  const removeImage = useCallback(
    (id: string) => {
      const imageToRemove = images.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
        const updatedImages = images.filter(img => img.id !== id);
        setImages(updatedImages);
        onImagesChange?.(updatedImages);
      }
    },
    [images, onImagesChange],
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
          <br />
          Drag and drop images to reorder.
          {images.length > 0 && ` ${images.length}/${maxFiles} selected.`}
        </p>
      </div>

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

      <div className="mt-6">
        <Sortable
          value={images.map(item => item.id)}
          onValueChange={(newItemIds) => {
            const newImages = newItemIds
              .map(itemId => images.find(img => img.id === itemId))
              .filter((item): item is ImageFile => !!item);
            setImages(newImages);
            onImagesChange?.(newImages);
          }}
          getItemValue={item => item}
          strategy="grid"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 auto-rows-fr"
        >
          {images.map((item, index) => (
            <SortableItem key={item.id} value={item.id}>
              <div className="flex items-center justify-center rounded-md bg-accent/50 shadow-none shrink-0 relative group border border-border hover:z-10 data-[dragging=true]:z-50 transition-all duration-200 hover:bg-accent/70 h-[120px] overflow-hidden">
                <Image
                  src={item.preview}
                  fill
                  className="object-cover rounded-md pointer-events-none transition-opacity duration-300 opacity-100"
                  alt={item.file.name}
                  unoptimized
                />

                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-white text-[8px] font-bold tracking-widest uppercase rounded-full shadow-soft z-10 pointer-events-none">
                    Primary
                  </div>
                )}

                <SortableItemHandle className="absolute top-2 start-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing">
                  <Button variant="outline" size="icon" className="size-6 rounded-full bg-background/80 backdrop-blur-sm">
                    <GripVertical className="size-3.5" />
                  </Button>
                </SortableItemHandle>

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
              </div>
            </SortableItem>
          ))}
        </Sortable>
      </div>
    </div>
  );
}
