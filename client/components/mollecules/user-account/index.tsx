import classNames from 'classnames';
import { Button, Image } from 'components/atoms';

interface UserAccountProps {
  className?: string;
  src?: string;
  name?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
  phoneNumber?: string;
  address?: string;
}

const UserAccount: React.FC<UserAccountProps> = ({
  className,
  src,
  name,
  onEdit,
  onDelete,
  isAdmin = false,
  phoneNumber = '0878 365 222',
  address = 'Jln. Kenangan No. 21, Indonesia',
}) => {
  return (
    <div className={classNames('border border-purple-light rounded-md py-2.5', className)}>
      <div
        className={classNames('px-6 flex items-start mb-3 pt-3', {
          'border-b border-purple-light pb-8': !isAdmin,
        })}
      >
        <Image
          width={56}
          objectFit="cover"
          src={src}
          aspectRatio="1/1"
          className="rounded-full mr-6"
        />
        <div className="text-black">
          <div className="text-body mr-8 font-bold mb-2.5">{name}</div>
          <div className="text-body-sm mb-1">
            <span className="font-bold">No. Whatsapp :</span>
            &nbsp;{phoneNumber}
          </div>
          <div className="text-body-sm">
            <span className="font-bold">Alamat :</span>
            &nbsp;{address}
          </div>
        </div>
      </div>
      {!isAdmin && (
        <div className="px-6 flex items-center justify-end ml-auto">
          <Button className="mr-4" onClick={onEdit}>
            Edit
          </Button>
          <Button onClick={onDelete} variant="outlined" color="red">
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserAccount;
