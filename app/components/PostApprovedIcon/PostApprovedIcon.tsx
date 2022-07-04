import { CheckCircle, Error } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import type { Post } from '@prisma/client';

interface PostApprovedIconProps {
  post: Post;
}

export const PostApprovedIcon = ({ post }: PostApprovedIconProps) => {
  return post.approved ? (
    <Tooltip title="Post is approved and can be seen by other accounts">
      <CheckCircle color="success" />
    </Tooltip>
  ) : (
    <Tooltip title="Post is awaiting approval and cannot be seen by other accounts">
      <Error color="warning" />
    </Tooltip>
  );
};
