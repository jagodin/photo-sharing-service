import { Grid } from '@mui/material';
import { Outlet } from '@remix-run/react';

import { SettingsMenu } from '~/components/SettingsMenu';

export default function Account() {
  return (
    <Grid container sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
      <Grid item xs={4} sx={{ borderRight: '1px solid #e0e0e0' }}>
        <SettingsMenu />
      </Grid>
      <Grid item xs={8} sx={{ padding: (theme) => theme.spacing(4) }}>
        <Outlet />
      </Grid>
    </Grid>
  );
}
