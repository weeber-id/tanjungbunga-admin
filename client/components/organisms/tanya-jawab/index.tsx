import React, { useState } from 'react';
import { IconClose } from '../../../assets';
import { Button, Textfield } from '../../atoms';
import { useMutation, useQueryClient } from 'react-query';
import { urlApi } from '../../../utils';
import { useUser } from 'hooks';

interface TanyaJawabProps {
  onCancel?: () => void;
  type?: 'jawab' | 'tanya';
  name?: string;
  created_at?: string;
  title?: string;
  body?: string;
  content_id?: string;
  content_name?: 'article' | 'travel' | 'culinary' | 'handcraft' | 'lodging';
  question_id?: string;
}

const TanyaJawab: React.FC<TanyaJawabProps> = ({
  onCancel,
  type,
  name,
  created_at,
  title,
  body,
  content_id,
  content_name,
  question_id,
}) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [textArea, setTextArea] = useState<string>('');
  const [state, setState] = useState({
    name: user?.name,
    email: user?.username,
  });

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    setTextArea(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  const handleTanya = useMutation(
    () => {
      const body = {
        ...state,
        body: textArea,
        question_id: type === 'jawab' ? question_id : null,
        content_name,
        content_id,
      };

      return fetch(urlApi + '/admin/discussion/create', {
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include',
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: 'discussions',
        });
        if (onCancel) onCancel();
      },
    }
  );

  return (
    <div className="fixed flex justify-center items-center top-0 left-0 w-full h-full overflow-auto bg-black bg-opacity-10 z-[120]">
      <div className="bg-white max-w-md w-full px-6 py-6 border border-purple-light">
        <div className="flex justify-between items-center mb-2">
          <span className="md:text-body text-body-sm font-medium text-black">Tanya Jawab</span>
          <button
            onClick={onCancel}
            className="flex items-center justify-center rounded-full bg-blue h-8 w-8 focus:outline-none"
          >
            <IconClose />
          </button>
        </div>
        <p className="md:text-body-sm text-body-xs text-grey pb-6 border-b border-purple-light">
          {title}
        </p>
        {type === 'jawab' && (
          <>
            <div className="mt-6 mb-4 flex items-center justify-between">
              <span className="md:text-body text-body-sm font-medium text-red">{name}</span>
              <span className="md:text-body-sm text-body-xs text-grey">{created_at}</span>
            </div>
            <p className="md:text-body-sm text-body-xs text-black">{body}</p>{' '}
          </>
        )}
        <p className="text-black font-medium text-body-sm mb-1.5 mt-4 md:mt-9">
          {type === 'jawab' ? 'Jawab' : 'Ajukan pertanyaan'}
        </p>
        <textarea
          onChange={handleChangeTextArea}
          value={textArea}
          maxLength={250}
          className="w-full border border-purple rounded-md md:h-28 h-20 resize-none p-3 md:text-body-sm text-body-xs text-black focus:outline-none"
          placeholder="Tulis Jawaban"
        ></textarea>
        <p className="text-red text-right text-body-xs md:text-body-sm mb-2 md:mb-4">
          {textArea.length}/250 Karakter
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-4">
          <Textfield
            errorMessage="Field wajib diisi"
            labelText="Name"
            fullWidth
            placeholder="Jane Doe"
            inputClassName="md:text-body-sm text-body-xs"
            name="name"
            value={state.name}
            onChange={handleChange}
            disabled
          />
          <Textfield
            errorMessage="Field wajib diisi"
            labelText="Email"
            fullWidth
            placeholder="janedoe@gmail.com"
            inputClassName="md:text-body-sm text-body-xs"
            name="email"
            value={state.email}
            onChange={handleChange}
            disabled
          />
        </div>
        <Button
          onClick={() => handleTanya.mutate()}
          className="mb-6"
          customHeight
          style={{ height: 38 }}
          isLoading={handleTanya.isLoading}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default TanyaJawab;
