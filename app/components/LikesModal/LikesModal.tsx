import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import type { User } from '@prisma/client';
import { useNavigate } from '@remix-run/react';

interface LikesModalProps {
  users: Omit<User, 'password'>[];
  open: boolean;
  onClose: () => void;
}

export const LikesModal = ({ users, open, onClose }: LikesModalProps) => {
  const navigate = useNavigate();

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
      <DialogContent>
        <Grid container rowGap={2}>
          {users.map((user) => (
            <Grid key={user.userId} item xs={12}>
              <Stack spacing={2} alignItems="center" direction="row">
                <Avatar
                  src={user.profilePicture || undefined}
                  onClick={() => navigate(`/${user.username}`)}
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                    },
                    height: 45,
                    width: 45,
                  }}
                />
                <Link
                  underline="hover"
                  color="text.primary"
                  href={`/${user.username}`}
                >
                  <Typography variant="body1" fontWeight={600}>
                    {user.username}
                  </Typography>
                </Link>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
