import type { CardMediaProps } from '@mui/material';
import { CardMedia as MuiCardMedia, styled } from '@mui/material';

export const CardMedia = styled((props: CardMediaProps) => (
  <MuiCardMedia {...props} />
))(() => ({
  '&.img': {
    width: '50vw',
    height: '50vw',
  },
}));
