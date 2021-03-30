import { IconEdit, IconRecommendation, IconTrash } from 'assets';
import classNames from 'classnames';
import { Image, Switch } from 'components/atoms';

interface ItemCardMobileProps {
  className?: string;
  name?: string;
  image?: string;
  price?: string;
  unit?: string;
  active?: boolean;
  label?: string;
  orderNumber?: string | number;
  onRecommend?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSwitchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  aspectRatio?: '16/9' | '4/3';
  isRecommended?: boolean;
  createdAt?: string;
}

const ItemCardMobile: React.FC<ItemCardMobileProps> = ({
  className,
  active,
  name,
  price,
  unit,
  label,
  orderNumber,
  aspectRatio = '4/3',
  image,
  onSwitchChange,
  onDelete,
  onEdit,
  onRecommend,
  isRecommended,
  createdAt,
}) => {
  return (
    <div
      className={classNames('px-2 py-4 text-black', className, {
        'border-2 border-purple-light': isRecommended && active,
        'border-grey-light border': !active,
        'border border-purple-light': active && !isRecommended,
      })}
    >
      <div className="grid grid-cols-12 gap-x-4 pb-4 mb-3 border-b border-black">
        <div className="col-span-1">{orderNumber}</div>
        <div className="col-span-4">
          <Image aspectRatio={aspectRatio} src={image} />
        </div>
        <div className="col-span-7 text-body-sm">{name}</div>
      </div>
      <div className="grid grid-cols-12 gap-x-4 text-body-xs">
        <div className="col-span-4">
          <div className="text-grey-light mb-2">{label}</div>
          {price && (
            <div>
              Rp {price} {unit && '/'} {unit}
            </div>
          )}
          {createdAt && <div>{createdAt}</div>}
        </div>
        <div className="col-span-3">
          <div className="text-grey-light mb-2">Tampilkan</div>
          <div>
            <Switch checked={active} onChange={onSwitchChange} size="sm" />
          </div>
        </div>
        <div className="col-span-5 grid grid-cols-3 gap-x-3">
          <button
            onClick={onRecommend}
            className="w-[34px] h-[34px] border border-black rounded-md flex items-center justify-center"
          >
            <IconRecommendation />
          </button>
          <button
            onClick={onDelete}
            className="w-[34px] h-[34px] border border-black rounded-md flex items-center justify-center"
          >
            <IconTrash className="ic-stroke-red" />
          </button>
          <button
            onClick={onEdit}
            className="w-[34px] h-[34px] border border-black rounded-md flex items-center justify-center"
          >
            <IconEdit />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCardMobile;
