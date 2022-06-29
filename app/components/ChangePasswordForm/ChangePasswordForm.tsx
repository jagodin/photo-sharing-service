import { useRef } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { Form } from '@remix-run/react';

import type { ValidationError } from '~/services/user.server';

interface ChangePasswordFormProps {
  errors?: ValidationError[];
}

export const ChangePasswordForm = ({ errors }: ChangePasswordFormProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const currentPasswordError = errors?.find(
    (error) => error.field === 'currentPassword'
  );
  const newPassword1Error = errors?.find(
    (error) => error.field === 'newPassword1'
  );
  const newPassword2Error = errors?.find(
    (error) => error.field === 'newPassword2'
  );

  const clearData = () => {
    if (formRef.current) formRef.current.reset();
  };

  return (
    <Form ref={formRef} method="post">
      <Grid item xs={12} container rowGap={4} justifyContent="center">
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            FormHelperTextProps={{
              sx: { margin: 0, mt: 1 },
            }}
            type="password"
            autoComplete="current-password"
            helperText={currentPasswordError && currentPasswordError.message}
            error={currentPasswordError ? true : false}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="New Password"
            name="newPassword1"
            type="password"
            FormHelperTextProps={{
              sx: { margin: 0, mt: 1 },
            }}
            helperText={newPassword1Error && newPassword1Error.message}
            error={newPassword1Error ? true : false}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Confirm New Password"
            name="newPassword2"
            type="password"
            FormHelperTextProps={{
              sx: { margin: 0, mt: 1 },
            }}
            helperText={newPassword2Error && newPassword2Error.message}
            error={newPassword2Error ? true : false}
          />
        </Grid>
        <Grid item xs={12} container justifyContent="space-between">
          <Grid item>
            <Button variant="outlined" type="submit">
              Submit
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={clearData}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Form>
  );
};
