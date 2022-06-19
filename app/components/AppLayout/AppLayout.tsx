import type { PropsWithChildren } from 'react';
import { Box, Container } from '@mui/material';

import { AppBar } from '../AppBar';

export const AppLayout = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <Box>
      <AppBar />
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
};
