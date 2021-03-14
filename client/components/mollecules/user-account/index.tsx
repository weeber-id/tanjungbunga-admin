import classNames from 'classnames';
import { Button, Image } from 'components/atoms';

interface UserAccountProps {
  className?: string;
  src?: string;
  name?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const UserAccount: React.FC<UserAccountProps> = ({ className, src, name, onEdit, onDelete }) => {
  return (
    <div
      className={classNames(
        'flex items-center px-6 border border-purple-light rounded-md py-2.5',
        className
      )}
    >
      <Image
        width={56}
        objectFit="cover"
        src={src}
        aspectRatio="1/1"
        className="rounded-full mr-6"
      />
      <div className="text-body mr-8">{name}</div>
      <div className="flex-items-center ml-auto">
        <Button className="mr-4" onClick={onEdit}>
          Edit
        </Button>
        <Button onClick={onDelete} variant="outlined" color="red">
          Delete
        </Button>
      </div>
    </div>
  );
};

export default UserAccount;
