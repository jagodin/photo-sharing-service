import { useEffect, useState } from 'react';

export const useLoadImage = (url: string | null) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    const image = new Image();
    image.onload = handleImageLoaded;
    if (url) image.src = url;
    setImage(image);
  }, [url]);

  return { image, imageLoaded };
};
