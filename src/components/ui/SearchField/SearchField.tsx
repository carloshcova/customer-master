import ClearIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from '@mui/material';
import { type KeyboardEvent, useRef } from 'react';
import { tokens } from '@/config/tokens';

export interface SearchFieldProps
  extends Omit<TextFieldProps, 'variant' | 'inputRef'> {
  /** Called on Enter or search-icon click with the current input value. */
  onSearch?: (value: string) => void;
  /** When provided, shows a clear (×) button that empties the field and calls this. */
  onClear?: () => void;
}

/**
 * SearchField (atom) — a rounded (pill) search input with a trailing search
 * button, optional clear (×), and search-on-Enter. Built on MUI's outlined
 * TextField. For the "search bar" variant, pass a leading icon via
 * `slotProps.input.startAdornment`.
 */
export function SearchField({
  onSearch,
  onClear,
  onKeyDown,
  slotProps,
  sx,
  ...props
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentValue = () => inputRef.current?.value ?? '';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') onSearch?.(currentValue());
    onKeyDown?.(event);
  };

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = '';
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <TextField
      variant="outlined"
      inputRef={inputRef}
      onKeyDown={handleKeyDown}
      slotProps={{
        ...slotProps,
        input: {
          ...((slotProps?.input as Record<string, unknown>) ?? {}),
          endAdornment: (
            <InputAdornment position="end">
              {onClear && (
                <IconButton
                  aria-label="clear search"
                  size="small"
                  onClick={handleClear}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                aria-label="search"
                size="small"
                onClick={() => onSearch?.(currentValue())}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      sx={[
        { '& .MuiOutlinedInput-root': { borderRadius: tokens.radius.full } },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}
