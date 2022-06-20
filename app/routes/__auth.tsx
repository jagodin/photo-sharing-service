import { Container, Grid } from '@mui/material';
import { Outlet } from '@remix-run/react';

export default function Auth() {
  return (
    <Container maxWidth="lg" sx={{ height: '100vh' }}>
      <Grid
        sx={{ height: '100%' }}
        container
        alignItems="center"
        justifyContent="center"
      >
        <Outlet />
      </Grid>
    </Container>
  );
}
