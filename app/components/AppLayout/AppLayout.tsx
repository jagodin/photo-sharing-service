import type { PropsWithChildren } from 'react';
import { Box, Container } from '@mui/material';
import type { User } from '@prisma/client';

import { AppBar } from '../AppBar';

interface AppLayoutProps extends PropsWithChildren<unknown> {
  user: Omit<User, 'password'>;
}

export const AppLayout = ({ children, user }: AppLayoutProps) => {
  return (
    <Box>
      <AppBar user={user} />
      <Container maxWidth="md" sx={{ pt: '92px' }}>
        {children}
      </Container>
    </Box>
  );
};
