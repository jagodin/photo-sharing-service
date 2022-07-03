import type { ChangeEvent } from 'react';
import { useState } from 'react';
import {
  Button,
  FormHelperText,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { User } from '@prisma/client';
import { Form } from '@remix-run/react';

import { Avatar } from '../Avatar';
import { ChangeAvatarModal } from '../ChangeAvatarModal';

import type { ValidationError } from '~/services/user.server';

interface EditProfileFormProps {
  user: Omit<User, 'password'>;
  errors?: ValidationError[];
  uploadedAvatar?: string;
}

export const EditProfileForm = ({
  user,
  errors,
  uploadedAvatar,
}: EditProfileFormProps) => {
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name);
  const [profileDescription, setProfileDescription] = useState(
    user.profileDescription
  );
  const [username, setUsername] = useState(user.username);
  const [changeAvatarOpen, setChangeAvatarOpen] = useState(false);

  const changeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const changeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const changeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const changeProfileDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileDescription(e.target.value);
  };

  const openChangeAvatar = () => {
    setChangeAvatarOpen(true);
  };

  const closeChangeAvatar = () => {
    setChangeAvatarOpen(false);
  };

  const usernameError = errors?.find((error) => error.field === 'username');
  const emailError = errors?.find((error) => error.field === 'email');

  return (
    <Form method="post">
      <Grid item xs={12} container rowGap={4} justifyContent="center">
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar user={user} onClick={undefined} />
            <Typography variant="h5">{user.username}</Typography>
            <Button onClick={openChangeAvatar} variant="outlined">
              Change Avatar
            </Button>
            <ChangeAvatarModal
              open={changeAvatarOpen}
              onClose={closeChangeAvatar}
              user={user}
              uploadedAvatar={uploadedAvatar}
            />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <input hidden readOnly name="action" value="edit" />
          <TextField
            helperText={
              "Help people discover your account by using the name that you're known by: either your full name, nickname or business name."
            }
            fullWidth
            label="Name"
            name="name"
            value={name}
            FormHelperTextProps={{
              sx: { margin: 0, mt: 1 },
            }}
            onChange={changeName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={username}
            onChange={changeUsername}
            error={usernameError ? true : false}
          />
          {usernameError && (
            <FormHelperText error>{usernameError.message}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            fullWidth
            label="Bio"
            name="profileDescription"
            value={profileDescription}
            minRows={2}
            onChange={changeProfileDescription}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={email}
            helperText={
              !emailError && 'Your email address is never shared with anyone.'
            }
            FormHelperTextProps={{
              sx: { margin: 0, mt: 1 },
            }}
            onChange={changeEmail}
            error={emailError ? true : false}
          />
          {emailError && (
            <FormHelperText error>{emailError.message}</FormHelperText>
          )}
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
