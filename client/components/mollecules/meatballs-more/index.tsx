import { IconMeatballsMenu } from 'assets';
import { useUser } from 'hooks';
import { useOutside } from 'hooks/useOutside';
import React, { useRef, useState } from 'react';

interface MeetBallMoreProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onRecommend?: () => void;
}

const MeetBallMore: React.FC<MeetBallMoreProps> = ({ onDelete, onEdit, onRecommend }) => {
  const { user } = useUser();

  const [show, setShow] = useState<boolean>(false);
  const boxRef = useRef(null);
  const triggerRef = useRef(null);

  useOutside(boxRef, triggerRef, () => {
    setShow(false);
  });

  const handleEdit = () => {
    if (onEdit) onEdit();
    setShow(false);
  };

  const handleDelete = () => {
    if (onDelete) onDelete();
    setShow(false);
  };

  const handleRecommend = () => {
    if (onRecommend) onRecommend();
    setShow(false);
  };

  return (
    <div className="relative z-40">
      <button
        ref={triggerRef}
        onClick={() => setShow((show) => !show)}
        className="focus:outline-none"
      >
        <IconMeatballsMenu />
      </button>
      {show && (
        <div
          ref={boxRef}
          className="absolute top-7 right-6 bg-white text-body shadow-lg w-40 rounded-md overflow-hidden"
          style={{ zIndex: 40 }}
        >
          <button
            onClick={handleEdit}
            className="w-full py-2 px-6 text-left text-purple-light focus:outline-none hover:bg-purple-light hover:text-white"
          >
            Edit
          </button>
          {user?.role === 0 && (
            <button
              onClick={handleRecommend}
              className="w-full py-2 px-6 text-left text-purple-light focus:outline-none hover:bg-purple-light hover:text-white"
            >
              Rekomendasi
            </button>
          )}
          <button
            onClick={handleDelete}
            className="w-full py-2 px-6 text-left text-red focus:outline-none hover:bg-purple-light hover:text-white"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetBallMore;
