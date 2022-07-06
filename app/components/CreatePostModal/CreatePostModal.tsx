import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import type { User } from '@prisma/client';
import {
  Form,
  useLocation,
  useSearchParams,
  useSubmit,
  useTransition,
} from '@remix-run/react';

import { EditView } from './EditView';
import { Footer } from './Footer';
import { UploadView } from './UploadView';

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  user: Omit<User, 'password' | 'email'>;
}

interface ViewProps {
  currentStep: number;
  uploadedImage: string | null;
  user: Omit<User, 'password' | 'email'>;
  postCaption: string;
  setPostCaption: Dispatch<SetStateAction<string>>;
}

const View = ({
  currentStep,
  uploadedImage,
  user,
  postCaption,
  setPostCaption,
}: ViewProps) => {
  switch (currentStep) {
    case 0:
      return <UploadView />;
    case 1:
      return (
        <EditView
          postCaption={postCaption}
          setPostCaption={setPostCaption}
          user={user}
          uploadedImage={uploadedImage}
        />
      );
    default:
      return <Typography>All done</Typography>;
  }
};

export const CreatePostModal = ({
  open,
  onClose,
  user,
}: CreatePostModalProps) => {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const uploadedImage = params.get('uploadedImage');
  const [currentStep, setCurrentStep] = useState(0);
  const [postCaption, setPostCaption] = useState('');
  const transition = useTransition();
  const submit = useSubmit();
  const handleNext = () => {
    setCurrentStep((currentStep) => currentStep + 1);
  };

  const handleOnClose = () => {
    onClose();
    setCurrentStep(0);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    submit(e.currentTarget);
    handleOnClose();
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Create Post</DialogTitle>
      <DialogContent dividers>
        <Grid rowGap={2} container alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Stepper activeStep={currentStep}>
              <Step>
                <StepLabel>Upload</StepLabel>
              </Step>
              <Step>
                <StepLabel>Edit</StepLabel>
              </Step>
              <Step>
                <StepLabel>Post</StepLabel>
              </Step>
            </Stepper>
          </Grid>
          <Grid item xs={12}>
            <View
              user={user}
              currentStep={currentStep}
              uploadedImage={uploadedImage}
              postCaption={postCaption}
              setPostCaption={setPostCaption}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Footer
          currentStep={currentStep}
          onClose={handleOnClose}
          uploadedImage={uploadedImage}
          handleNext={handleNext}
          loading={transition.state !== 'idle'}
        />
      </DialogActions>
      <Form
        id="submit-post"
        method="post"
        action="/resource/post"
        onSubmit={handleSubmit}
      >
        <input name="action" readOnly hidden value="submit" />
        <input name="redirectTo" readOnly hidden value={pathname} />
        <input
          name="imgSrc"
          readOnly
          hidden
          value={uploadedImage ? uploadedImage : ''}
        />
        <input name="description" value={postCaption} readOnly hidden />
      </Form>
    </Dialog>
  );
};
