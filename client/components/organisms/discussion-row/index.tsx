import dayjs from 'dayjs';
import { useMedia } from 'hooks';
import { useState } from 'react';
import { Discussion } from 'utils/types';
import TanyaJawab from '../tanya-jawab';

interface DiscussionRowProps {
  numberOrder?: string | number;
  email?: string;
  body?: string;
  onAnswer?: () => void;
  onDelete?: () => void;
  questions?: Discussion[] | null;
  content_id?: string;
  question_id?: string;
  created_at?: string;
  content_name?: 'article' | 'travel' | 'culinary' | 'handcraft' | 'lodging';
  name?: string;
}

const DiscussionRow: React.FC<DiscussionRowProps> = ({
  body,
  email,
  numberOrder,
  onDelete,
  questions = [],
  question_id,
  content_id,
  created_at,
  content_name,
  name,
}) => {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [jawab, setJawab] = useState<boolean>(false);

  const isMobile = useMedia({ query: '(max-width: 640px)' });

  return (
    <>
      {jawab && (
        <TanyaJawab
          type="jawab"
          question_id={question_id}
          content_id={content_id}
          created_at={dayjs(created_at).fromNow()}
          content_name={content_name}
          name={name}
          onCancel={() => setJawab(false)}
        />
      )}
      <div className="mb-2.5 last:mb-0">
        <div
          style={{ gridTemplateColumns: '80px 250px 1fr 200px' }}
          className="sm:grid border border-purple-light text-black py-5 mb-1.5 px-4 gap-x-4"
        >
          {isMobile ? (
            <div className="flex items-center mb-2">
              <div className="mr-2 font-semibold">{numberOrder}</div>
              <div className="text-purple-light">{email}</div>
            </div>
          ) : (
            <>
              <div>{numberOrder}</div>
              <div>{email}</div>
            </>
          )}
          <div className="sm:mb-0 mb-4">{body}</div>
          <div className="flex sm:flex-col text-body-sm sm:text-body sm:pt-0 pt-4 sm:border-t-0 border-t border-purple-light justify-end sm:justify-start">
            <button
              onClick={() => setJawab(true)}
              className="text-purple-light text-left underline focus:outline-none hover:text-black sm:mr-0 mr-auto"
            >
              Bantu Jawab
            </button>
            <button
              onClick={onDelete}
              className="text-red text-left focus:outline-none hover:text-black mr-2 sm:mr-0"
            >
              Hapus
            </button>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="text-purple-light text-left focus:outline-none hover:text-black"
            >
              {showAnswer ? 'Sembunyikan' : 'Tampilkan'} ({questions?.length || 0})
            </button>
          </div>
        </div>
        <div>
          {showAnswer &&
            questions?.map(({ id, email, body }) => (
              <div
                key={id}
                style={{ gridTemplateColumns: '80px 250px 1fr 200px' }}
                className="sm:grid bg-blue-light border border-black mb-1 text-black py-5 px-4 gap-x-4"
              >
                <div></div>
                <div className="sm:text-black text-purple-light sm:mb-0 mb-2">{email}</div>
                <div>{body}</div>
                <div className="text-red hover:text-black sm:text-body text-body-sm text-right sm:text-left sm:mt-0 mt-3">
                  <button className="text-left focus:outline-none">Delete</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default DiscussionRow;
