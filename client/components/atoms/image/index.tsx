import classNames from 'classnames';

interface ImageProps {
  src?: string;
  alt?: string;
  aspectRatio?: '4/3' | '16/9' | '1/1';
  width?: number;
  className?: string;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  objectPosition?: string;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  aspectRatio = '4/3',
  width,
  className,
  objectFit,
  objectPosition,
}) => {
  const AR = aspectRatio.split('/');

  const paddingTop = `${(Number(AR[1]) / Number(AR[0])) * 100}%`;

  return (
    <div className={classNames('w-full overflow-hidden', className)} style={{ width }}>
      <div style={{ paddingTop }} className={classNames('relative w-full overflow-hidden')}>
        <img
          style={{ objectPosition, objectFit }}
          className="absolute top-0 left-0 w-full h-full"
          src={src}
          alt={alt}
        />
      </div>
    </div>
  );
};

export default Image;
