/**
 * FileUpload Component
 * Drag and drop file upload with preview
 */

'use client'

import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { cn, formatFileSize } from '@/utils/helpers'
import { Upload, File, X } from 'lucide-react'

export interface FileUploadProps {
  label?: string
  error?: string
  helpText?: string
  accept?: Record<string, string[]>
  maxSize?: number
  maxFiles?: number
  onFilesChange: (files: File[]) => void
  value?: File[]
  disabled?: boolean
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  error,
  helpText,
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 1,
  onFilesChange,
  value = [],
  disabled = false,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesChange([...value, ...acceptedFiles].slice(0, maxFiles))
    },
    [value, maxFiles, onFilesChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    disabled,
  })

  const removeFile = (index: number) => {
    const newFiles = [...value]
    newFiles.splice(index, 1)
    onFilesChange(newFiles)
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-text">
          {label}
        </label>
      )}

      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-primary bg-primary-50'
            : error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-primary',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-2">
          <Upload className="w-10 h-10 text-primary" />

          {isDragActive ? (
            <p className="text-primary font-medium">Drop files here...</p>
          ) : (
            <>
              <p className="text-text font-medium">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-sm text-text-light">
                {Object.values(accept).flat().join(', ')} up to {formatFileSize(maxSize)}
              </p>
            </>
          )}
        </div>
      </div>

      {value.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <File className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-text">{file.name}</p>
                  <p className="text-xs text-text-light">{formatFileSize(file.size)}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-red-100 rounded transition-colors"
                disabled={disabled}
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {helpText && !error && (
        <p className="text-sm text-text-light">{helpText}</p>
      )}
    </div>
  )
}
