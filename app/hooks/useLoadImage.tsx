import { useEffect, useState } from 'react';

export const useLoadImage = (url: string) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    const image = new Image();
    image.onload = handleImageLoaded;
    image.src = url;
    console.log(image.src);
    setImage(image);
  }, [url]);

  return { image, imageLoaded };
};
