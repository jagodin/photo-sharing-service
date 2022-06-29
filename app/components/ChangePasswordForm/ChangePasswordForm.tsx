import type { ChangeEvent } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { Form } from '@remix-run/react';

import type { ValidationError } from '~/services/user.server';

interface ChangePasswordFormProps {
  errors?: ValidationError[];
}

export const ChangePasswordForm = ({ errors }: ChangePasswordFormProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const changeCurrentPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const changeNewPassword1 = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword1(e.target.value);
  };

  const changeNewPassword2 = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword2(e.target.value);
  };

  useEffect(() => {
    if (newPassword1 !== newPassword2) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  }, [newPassword1, newPassword2]);

  return (
    <Form method="post">
      <Grid item xs={12} container rowGap={4} justifyContent="center">
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            FormHelperTextProps={{
              sx: { margin: 0, mt: 1 },
            }}
            onChange={changeCurrentPassword}
            value={currentPassword}
            type="password"
            autoComplete="current-password"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="New Password"
            name="newPassword1"
            onChange={changeNewPassword1}
            value={newPassword1}
            type="password"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Confirm New Password"
            name="newPassword2"
            onChange={changeNewPassword2}
            value={newPassword2}
            type="password"
            error={!passwordsMatch}
            helperText={!passwordsMatch ? 'Passwords do not match.' : undefined}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
};
