import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Link, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { type Accept, type FileRejection, useDropzone } from 'react-dropzone';
import { tokens } from '@/config/tokens';

export interface FileUploadProps {
  /** Called with accepted files and any rejections (bad type/size). */
  onDrop?: (accepted: File[], rejections: FileRejection[]) => void;
  /** Allowed MIME types → extensions, e.g. `{ 'text/csv': ['.csv'] }`. */
  accept?: Accept;
  /** Max size in bytes. */
  maxSize?: number;
  /** @default true */
  multiple?: boolean;
  disabled?: boolean;
  /** Supporting text under the prompt (e.g. supported formats & max size). */
  hint?: ReactNode;
}

/**
 * FileUpload (molecule) — a drag-and-drop file dropzone built on react-dropzone
 * (MUI has no dropzone). Handles drag events, `accept` and `maxSize` validation,
 * and click-to-browse. Render the selected files with `FileUploadItem`; the app
 * owns upload progress/status.
 */
export function FileUpload({
  onDrop,
  accept,
  maxSize,
  multiple = true,
  disabled,
  hint,
}: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted, rejections) => onDrop?.(accepted, rejections),
    accept,
    maxSize,
    multiple,
    disabled,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        p: 4,
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: '1px dashed',
        borderColor: isDragActive
          ? 'secondary.main'
          : tokens.color.neutral['04'],
        borderRadius: `${tokens.radius.sm}px`,
        backgroundColor: tokens.color.neutral['01'],
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <input {...getInputProps()} />
      <CloudUploadIcon color="secondary" sx={{ fontSize: 40 }} />
      <Typography variant="body1">
        Drag and drop the file{' '}
        <Link component="span" underline="always">
          here or click
        </Link>
      </Typography>
      {hint && (
        <Typography variant="body3" color="text.secondary">
          {hint}
        </Typography>
      )}
    </Box>
  );
}
