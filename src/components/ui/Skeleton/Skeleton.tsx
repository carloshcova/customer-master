import {
  Skeleton as MuiSkeleton,
  type SkeletonProps as MuiSkeletonProps,
} from '@mui/material';

export type SkeletonProps = MuiSkeletonProps;

/**
 * Skeleton (atom) — placeholder shown while content loads. Use MUI `variant` for
 * the shape: `circular` (avatars/icons), `text` (headings/body), `rounded`/
 * `rectangular` (blocks). Defaults to the DS shimmer (`animation="wave"`).
 *
 * DS: mirror the final layout, keep it on a white background, and show it only
 * while loading (not as an error state).
 */
export function Skeleton(props: SkeletonProps) {
  return <MuiSkeleton animation="wave" {...props} />;
}
