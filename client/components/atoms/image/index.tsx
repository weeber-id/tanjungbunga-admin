import classNames from 'classnames';

interface ImageProps {
  src?: string;
  alt?: string;
  aspectRatio?: '4/3' | '16/9' | '1/1';
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  objectPosition?: string;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  aspectRatio = '4/3',
  width,
  height,
  className,
  objectFit,
  objectPosition,
}) => {
  const AR = aspectRatio.split('/');

  const paddingTop = `${(Number(AR[1]) / Number(AR[0])) * 100}%`;

  return (
    <div
      style={{ paddingTop, width, height }}
      className={classNames('relative w-full overflow-hidden', className)}
    >
      <img
        style={{ objectPosition, objectFit }}
        className="absolute top-0 left-0 w-full h-full"
        src={src}
        alt={alt}
      />
    </div>
  );
};

export default Image;
