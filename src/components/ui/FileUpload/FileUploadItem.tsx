import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, LinearProgress, Typography } from '@mui/material';
import { tokens } from '@/config/tokens';

export type FileUploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface FileUploadItemProps {
  name: string;
  /** Preformatted size, e.g. "128 KB". */
  size?: string;
  /** @default 'idle' */
  status?: FileUploadStatus;
  /** 0–100 while uploading; omit for an indeterminate bar. */
  progress?: number;
  /** Error message shown below when `status="error"`. */
  error?: string;
  /** Remove/cancel this file (× while idle/uploading/error, 🗑 on success). */
  onRemove?: () => void;
}

const c = tokens.color;

/**
 * FileUploadItem (molecule) — one file row for the FileUpload list. Shows name,
 * size, a progress bar while `uploading`, a green success row, or a red error row
 * with a message. Pair with `FileUpload`.
 */
export function FileUploadItem({
  name,
  size,
  status = 'idle',
  progress,
  error,
  onRemove,
}: FileUploadItemProps) {
  const backgroundColor =
    status === 'success'
      ? c.semantic.success.primary
      : status === 'error'
        ? c.semantic.alert.primary
        : c.white;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          border: '1px solid',
          borderColor: c.neutral['03'],
          borderRadius: `${tokens.radius.sm}px`,
          backgroundColor,
        }}
      >
        {status === 'success' && (
          <CheckIcon
            fontSize="small"
            sx={{ color: c.semantic.success.secondary }}
          />
        )}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="body2" noWrap>
            {name}
          </Typography>
          {size && (
            <Typography variant="body3" color="text.secondary">
              {size}
            </Typography>
          )}
          {status === 'uploading' && (
            <LinearProgress
              variant={progress == null ? 'indeterminate' : 'determinate'}
              value={progress}
              sx={{ mt: 0.5 }}
            />
          )}
        </Box>
        {onRemove && (
          <IconButton aria-label="remove file" size="small" onClick={onRemove}>
            {status === 'success' ? (
              <DeleteIcon fontSize="small" />
            ) : (
              <CloseIcon fontSize="small" />
            )}
          </IconButton>
        )}
      </Box>
      {status === 'error' && error && (
        <Typography
          variant="body3"
          sx={{ color: c.semantic.alert.secondary, mt: 0.5, display: 'block' }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
}
