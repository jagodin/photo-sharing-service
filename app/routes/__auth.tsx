import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { Alert, Container, Grid, Snackbar } from '@mui/material';
import { Outlet, useCatch } from '@remix-run/react';

export default function Auth() {
  return <AuthLayout />;
}

const AuthLayout = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <Container maxWidth="lg" sx={{ height: '100vh' }}>
      <Grid
        sx={{ height: '100%' }}
        container
        alignItems="center"
        justifyContent="center"
      >
        <Outlet />
        {children}
      </Grid>
    </Container>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (caught) {
      console.log(caught);
      setOpen(true);
    }
  }, [caught]);

  return (
    <AuthLayout>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {caught.data?.message || caught.data}
        </Alert>
      </Snackbar>
    </AuthLayout>
  );
};
