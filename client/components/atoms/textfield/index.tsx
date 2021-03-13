import classNames from 'classnames';
import { IconSearch } from '../../../assets';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'search' | 'default' | 'search-right' | 'borderless';
  inputClassName?: string;
  fullWidth?: boolean;
  width?: string | number;
  labelText?: string;
  isError?: boolean;
  errorMessage?: string;
  labelTextColor?: 'red' | 'purple-light' | 'black';
  variantHeight?: 'sm' | 'md';
}

const TextField: React.FC<TextFieldProps> = ({
  className = '',
  inputClassName = '',
  variant = 'default',
  type = 'text',
  fullWidth,
  labelText,
  isError,
  errorMessage,
  width,
  labelTextColor = 'black',
  variantHeight = 'md',
  ...otherProps
}) => {
  return (
    <div
      style={{ width }}
      className={classNames('relative', className, {
        'w-full': fullWidth,
        'border border-purple-light rounded-md overflow-hidden': variant === 'search-right',
      })}
    >
      {variant === 'search' ? (
        <IconSearch className="absolute transform top-1/2 left-2 -translate-y-2/4" />
      ) : null}
      {labelText ? (
        <label className={`block text-body text-${labelTextColor} mb-1.5`}>
          {labelText} <span className="text-red">{errorMessage && '*'}</span>
        </label>
      ) : null}
      <div className="flex items-center">
        <input
          {...otherProps}
          style={{ height: variantHeight === 'md' ? 40 : 32 }}
          type={variant.startsWith('search') ? 'search' : type}
          className={classNames('focus:outline-none px-2', inputClassName, {
            'border-b text-body pl-11': variant === 'search',
            'w-full': fullWidth || width,
            'border-red': isError,
            'border-purple-light': !isError,
            'border text-body rounded-md': variant === 'default',
            'border-0': variant === 'search-right',
            'border-b border-black text-body': variant === 'borderless',
          })}
        />
        {variant === 'search-right' && (
          <button className="focus:outline-none border-l border-purple-light">
            <IconSearch className="mx-2" viewBox="0 0 32 32" height="24" width="24" />
          </button>
        )}
      </div>
      {isError && <span className="text-body-sm text-red mt-1 block">{errorMessage}</span>}
    </div>
  );
};

export default TextField;
