// src/components/singleVideoDropzone.jsx 
'use client';

import { formatFileSize } from '@edgestore/react/utils';
import { UploadCloudIcon, X } from 'lucide-react';
import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

const variants = {
  base: 'relative rounded-md flex justify-center items-center flex-col cursor-pointer min-h-[150px] min-w-[200px] border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out',
  image:
    'border-0 p-0 min-h-0 min-w-0 relative shadow-md bg-slate-200 dark:bg-slate-900 rounded-md',
  active: 'border-2',
  disabled:
    'bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700',
  accept: 'border border-blue-500 bg-blue-500 bg-opacity-10',
  reject: 'border border-red-700 bg-red-700 bg-opacity-10',
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return 'Invalid file type.'
  },
  tooManyFiles(maxFiles) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return 'The file is not supported.'
  },
};

export const SingleVideoDropzone = React.forwardRef(
  (
    { 
      dropzoneOptions, 
      width, 
      height, 
      value, 
      className, 
      disabled, 
      onChange,
      onUploadSuccess,
      onUploadError 
    },
    ref,
  ) => {
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadError, setUploadError] = React.useState(null);

    const imageUrl = React.useMemo(() => {
      if (typeof value === 'string') return value;
      if (value) return URL.createObjectURL(value);
      return null;
    }, [value]);

    const handleUpload = async () => {
      if (!value || typeof value === 'string') return;

      setIsUploading(true);
      setUploadError(null);

      try {
        // Get MUX signed URL from your API
        const { url, uploadId } = await fetch('/api/mux-upload')
          .then(res => res.json());

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url);
        xhr.setRequestHeader('Content-Type', value.type);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress((e.loaded / e.total) * 100);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            onUploadSuccess?.(uploadId);
            onChange?.(undefined); // Reset the dropzone
          } else {
            throw new Error('Upload failed');
          }
        };

        xhr.onerror = () => {
          throw new Error('Upload failed');
        };

        xhr.send(value);
      } catch (error) {
        setUploadError(error.message);
        onUploadError?.(error);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    };

    const { getRootProps, getInputProps, acceptedFiles, fileRejections, isFocused, isDragAccept, isDragReject } = useDropzone({
      multiple: false,
      disabled: disabled || isUploading,
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) onChange?.(file);
      },
      ...dropzoneOptions,
    });

    const dropZoneClassName = React.useMemo(
      () =>
        twMerge(
          variants.base,
          isFocused && variants.active,
          (disabled || isUploading) && variants.disabled,
          imageUrl && variants.image,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className,
        ).trim(),
      [isFocused, imageUrl, fileRejections, isDragAccept, isDragReject, disabled, className, isUploading]
    );

    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === 'file-too-large') {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
        } else if (errors[0]?.code === 'file-invalid-type') {
          return ERROR_MESSAGES.fileInvalidType();
        } else if (errors[0]?.code === 'too-many-files') {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
        } else {
          return ERROR_MESSAGES.fileNotSupported();
        }
      }
      return undefined;
    }, [fileRejections, dropzoneOptions]);

    return (
      <div>
        <div
          {...getRootProps({
            className: dropZoneClassName,
            style: { width, height },
          })}
        >
          <input ref={ref} {...getInputProps()} />

          {imageUrl ? (
            <video className="h-full w-full rounded-md object-cover" controls>
              <source src={imageUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="flex flex-col items-center justify-center text-xs">
              <UploadCloudIcon className="mb-2 h-7 w-7" />
              <div className="text-gray-400">drag & drop to upload</div>
              <div className="mt-3">
                <Button type="button" disabled={disabled || isUploading}>
                  select
                </Button>
              </div>
            </div>
          )}

          {imageUrl && !disabled && (
            <div className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform">
              <div
                className="flex h-5 w-5 items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-black"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.(undefined);
                }}
              >
                <X className="text-gray-500 dark:text-gray-400" width={16} height={16} />
              </div>
            </div>
          )}
        </div>

        {/* Upload controls */}
        {imageUrl && typeof value !== 'string' && (
          <div className="mt-4 space-y-2">
            <Button
              onClick={handleUpload}
              disabled={isUploading || disabled}
              className="w-full"
            >
              {isUploading ? (
                `Uploading... ${Math.round(uploadProgress)}%`
              ) : (
                'Upload to MUX'
              )}
            </Button>
            {uploadError && (
              <div className="text-sm text-red-500">{uploadError}</div>
            )}
          </div>
        )}

        {/* Dropzone error message */}
        <div className="mt-1 text-xs text-gray-400">
          {errorMessage}
        </div>
      </div>
    );
  }
);

const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      className={twMerge(
        'focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
        'border border-gray-400 shadow hover:bg-gray-100 hover:text-gray-500 dark:border-gray-600 dark:hover:bg-gray-700',
        'h-10 rounded-md px-4 py-2',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});