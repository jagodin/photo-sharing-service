import { Grid } from '@mui/material';
import { Outlet } from '@remix-run/react';

import { SettingsMenu } from '~/components/SettingsMenu';
import { useWidth } from '~/hooks/useWidth';

export default function Account() {
  const width = useWidth();

  const border = '1px solid #e0e0e0';

  return (
    <Grid
      container
      sx={{
        border,
        borderRadius: '4px',
        minHeight: '730px',
        mb: 4,
      }}
      direction={width === 'xs' ? 'column' : 'row'}
    >
      <Grid
        item
        xs={4}
        sm={4}
        sx={{
          borderRight: width !== 'xs' ? border : 'none',
          borderBottom: width === 'xs' ? border : 'none',
        }}
      >
        <SettingsMenu />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{ padding: (theme) => theme.spacing(4), mt: 2 }}
      >
        <Outlet />
      </Grid>
    </Grid>
  );
}
