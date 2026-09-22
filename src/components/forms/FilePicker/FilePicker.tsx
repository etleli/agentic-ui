import { FileUp, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type DragEvent } from 'react';
import '../Forms.css';
import { getFormClassName, normalizeFormSize } from '../Forms.utils';
import type { FilePickerProps } from '../Forms.types';

function getFileNames(fileList: FileList | null, multiple: boolean, maxFiles: number | undefined) {
  const names = Array.from(fileList ?? []).map((file) => file.name);
  const nextNames = multiple ? names : names.slice(0, 1);

  return maxFiles === undefined ? nextNames : nextNames.slice(0, maxFiles);
}

export function FilePicker({
  accept,
  className,
  description,
  disabled = false,
  label = 'Files',
  maxFiles,
  multiple = false,
  placeholder = 'Drop files here or browse',
  required = false,
  selectedFiles = [],
  size,
  onFilesChange,
  ...pickerProps
}: FilePickerProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState(selectedFiles);

  useEffect(() => setFiles(selectedFiles), [selectedFiles]);

  function updateFiles(nextFiles: string[]) {
    setFiles(nextFiles);
    onFilesChange?.(nextFiles);
  }

  function addFiles(fileList: FileList | null) {
    if (disabled) {
      return;
    }

    const nextFileNames = getFileNames(fileList, multiple, maxFiles);

    if (nextFileNames.length === 0) {
      return;
    }

    updateFiles(multiple ? [...files, ...nextFileNames].slice(0, maxFiles) : nextFileNames);
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function removeFile(fileName: string) {
    updateFiles(files.filter((currentFileName) => currentFileName !== fileName));
  }

  return (
    <div {...pickerProps} className={getFormClassName('file-picker', className)} data-size={normalizeFormSize(size)}>
      {label ? (
        <label className="forms-label" htmlFor={inputId}>
          {label}
          {required ? <span className="forms-required"> *</span> : null}
        </label>
      ) : null}
      <button
        className="file-picker__dropzone"
        data-disabled={disabled ? 'true' : undefined}
        data-dragging={isDragging ? 'true' : undefined}
        disabled={disabled}
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <span className="file-picker__icon">
          <FileUp size={24} aria-hidden="true" />
        </span>
        <span className="file-picker__copy">
          <span className="file-picker__title">{placeholder}</span>
          {description ? <span className="forms-description">{description}</span> : null}
        </span>
        <span className="forms-meta">{multiple ? 'Multiple' : 'Single'}</span>
      </button>
      <input
        accept={accept}
        className="file-picker__input"
        disabled={disabled}
        id={inputId}
        multiple={multiple}
        ref={inputRef}
        type="file"
        onChange={(event) => addFiles(event.target.files)}
      />
      {files.length > 0 ? (
        <ul className="file-picker__files">
          {files.map((fileName) => (
            <li className="file-picker__file" key={fileName}>
              <span className="file-picker__file-name">{fileName}</span>
              <button className="file-picker__remove" type="button" aria-label={`Remove ${fileName}`} onClick={() => removeFile(fileName)}>
                <X size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export type { FilePickerProps };
