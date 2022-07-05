import { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';

interface FooterProps {
  onClose: () => void;
  handleNext: () => void;
  currentStep: number;
  uploadedImage: string | null;
  loading: boolean;
}

export const Footer = ({
  onClose,
  handleNext,
  currentStep,
  uploadedImage,
  loading,
}: FooterProps) => {
  useEffect(() => {
    if (uploadedImage) {
      handleNext();
    }
  }, [uploadedImage]); //eslint-disable-line

  const nextButtonDisabled = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return uploadedImage === null;
      case 1:
        return false;
      default:
        return true;
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <Button onClick={onClose}>Close</Button>
      {currentStep !== 2 &&
        (currentStep == 1 ? (
          <LoadingButton
            variant="contained"
            disabled={nextButtonDisabled(currentStep)}
            type="submit"
            form="submit-post"
            loading={loading}
          >
            Post
          </LoadingButton>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={nextButtonDisabled(currentStep)}
          >
            Next
          </Button>
        ))}
    </Stack>
  );
};
