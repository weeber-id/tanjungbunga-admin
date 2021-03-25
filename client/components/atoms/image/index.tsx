import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { LoadingAnimation } from '..';

interface ImageProps {
  src?: string;
  alt?: string;
  aspectRatio?: '4/3' | '16/9' | '1/1' | '3/4';
  width?: number;
  className?: string;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  objectPosition?: string;
  lazyLoading?: boolean;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  aspectRatio = '4/3',
  width,
  className,
  objectFit,
  objectPosition,
  lazyLoading,
}) => {
  const [loading, setLoading] = useState(true);
  const AR = aspectRatio.split('/');

  const paddingTop = `${(Number(AR[1]) / Number(AR[0])) * 100}%`;

  useEffect(() => {
    setLoading(false);
  }, []);

  const count = useRef(0);

  useEffect(() => {
    if (count.current > 0) setLoading(true);
    else count.current = 1;
  }, [src]);

  return (
    <div className={classNames('w-full overflow-hidden', className)} style={{ width }}>
      <div style={{ paddingTop }} className={classNames('relative w-full overflow-hidden')}>
        {lazyLoading && loading && (
          <div className="absolute z-40 top-0 left-0 bg-blue-light w-full h-full flex justify-center items-center">
            <LoadingAnimation color="purple" />
          </div>
        )}
        <img
          onLoad={() => {
            if (lazyLoading) setLoading(false);
          }}
          style={{ objectPosition, objectFit }}
          className="absolute top-0 left-0 w-full h-full"
          src={src}
          alt={alt}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Image;
