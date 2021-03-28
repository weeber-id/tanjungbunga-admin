import { IconClose } from 'assets';
import classNames from 'classnames';

interface CardRelatedProps {
  className?: string;
  text?: string;
  onDelete?: () => void;
}

const CardRelated: React.FC<CardRelatedProps> = ({ className, text, onDelete }) => {
  return (
    <div
      className={classNames(
        'py-2 px-5 flex items-start border border-purple-light w-full rounded-md',
        className
      )}
    >
      <button onClick={onDelete} className="mr-3 mt-0.5 focus:outline-none">
        <IconClose className="ic-red" height={20} width={20} />
      </button>
      <span className="text-black text-body">{text}</span>
    </div>
  );
};

export default CardRelated;
