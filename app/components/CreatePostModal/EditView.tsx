import type { ChangeEvent, Dispatch } from 'react';
import type { SetStateAction } from 'react';
import { Grid, Input, Skeleton, Stack, Typography } from '@mui/material';
import type { User } from '@prisma/client';

import { Avatar } from '../Avatar';

import { useLoadImage } from '~/hooks/useLoadImage';
import { useWidth } from '~/hooks/useWidth';

interface PreviewViewProps {
  uploadedImage: string | null;
  user: Omit<User, 'password' | 'email'>;
  postCaption: string;
  setPostCaption: Dispatch<SetStateAction<string>>;
}

export const EditView = ({
  uploadedImage,
  user,
  postCaption,
  setPostCaption,
}: PreviewViewProps) => {
  const { image, imageLoaded } = useLoadImage(uploadedImage);
  const width = useWidth();
  return (
    <Grid
      direction={width !== 'sm' && width !== 'xs' ? 'row' : 'column'}
      gap={width !== 'sm' && width !== 'xs' ? 0 : 2}
      container
      justifyContent="center"
    >
      <Grid item sm={12} md={8}>
        {imageLoaded && image ? (
          <img
            style={{
              width: '100%',
              height: '100%',
            }}
            alt="Post Preview"
            src={image.src}
          />
        ) : (
          <Skeleton height={500} width={500} />
        )}
      </Grid>

      <Grid item sm={12} md={4}>
        <SidePanel
          postCaption={postCaption}
          setPostCaption={setPostCaption}
          user={user}
        />
      </Grid>
    </Grid>
  );
};

interface SidePanelProps {
  user: Omit<User, 'password' | 'email'>;
  postCaption: string;
  setPostCaption: Dispatch<SetStateAction<string>>;
}

const SidePanel = ({ user, postCaption, setPostCaption }: SidePanelProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPostCaption(e.target.value);
  };

  return (
    <Grid rowGap={2} container sx={{ padding: (theme) => theme.spacing(0, 2) }}>
      <Grid item xs={12}>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Avatar
            onClick={undefined}
            sx={{ height: 30, width: 30, '&:hover': { cursor: 'default' } }}
            user={user}
          />
          <Typography fontWeight={600} variant="body1">
            {user.username}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Input
          multiline
          disableUnderline
          fullWidth
          placeholder="Add a caption..."
          maxRows={10}
          value={postCaption}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};
