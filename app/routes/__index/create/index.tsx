import { useNavigate } from '@remix-run/react';

import { CreatePostForm } from '~/components/CreatePostForm';

export default function Create() {
  const navigate = useNavigate();
  const handleClose = () => {
    navigate('/');
  };
  return <CreatePostForm onClose={handleClose} open={true} />;
}
