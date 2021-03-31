import { DummyDefaultUpload } from 'assets';
import { Button, Dialog, Image, Sidebar, SidebarMobile, UploadPhoto } from 'components';
import TextField from 'components/atoms/textfield';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { useMedia } from 'hooks';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { EditorProps } from 'react-draft-wysiwyg';
import { useMutation } from 'react-query';
import { urlApi } from 'utils';
import { Article } from 'utils/types';
import { uuid } from 'uuidv4';

const Editor: React.ComponentType<EditorProps> = dynamic(
  // eslint-disable-next-line
  // @ts-ignore
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

const CreateArtikelPage = () => {
  const Router = useRouter();

  const [state, setState] = useState<Pick<Article, 'image_cover' | 'title' | 'body'>>({
    image_cover: '',
    title: '',
    body: '',
  });
  const [isUpload, setUpload] = useState<boolean>(false);

  const isMobile = useMedia({ query: '(max-width: 640px)' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  const handleUpload = useMutation(
    (blob: Blob) => {
      const formdata = new FormData();
      formdata.append('file', blob, uuid());
      formdata.append('folder_name', 'handcrafts');

      return fetch(urlApi + '/admin/media/upload/public', {
        method: 'POST',
        body: formdata,
        credentials: 'include',
      });
    },
    {
      onSuccess: async (data) => {
        const json = await data.json();

        const photo = json.data.url;

        setState({
          ...state,
          image_cover: photo,
        });

        setUpload(false);
      },
    }
  );

  const handleSave = useMutation(() => {
    const body = state;

    return fetch(urlApi + '/admin/article/create', {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  return (
    <>
      {handleSave.isSuccess && (
        <Dialog
          singleButton
          onSubmit={() => Router.push('/artikel')}
          heading="Berhasil"
          message={`${state.title} Berhasil dibuat!`}
        />
      )}
      {isUpload && (
        <UploadPhoto
          isLoading={handleUpload.isLoading}
          onUpload={(blob) => handleUpload.mutate(blob)}
          aspectRatio="16/9"
          shape="rect"
          onCancel={() => setUpload(false)}
          initialPhoto={state.image_cover}
        />
      )}

      <div className="sm:grid grid-cols-page h-screen">
        {isMobile ? <SidebarMobile /> : <Sidebar />}
        <div className="overflow-y-auto">
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
            Tambah Artikel
          </h5>
          <div className="sm:px-12 px-6 py-10">
            <div style={{ gridTemplateColumns: '312px 1fr' }} className="sm:grid gap-x-6">
              <div className="flex flex-col items-start mb-4 sm:mb-0">
                <Image
                  className="mb-4"
                  src={state.image_cover ? state.image_cover : DummyDefaultUpload}
                  aspectRatio="16/9"
                  lazyLoading
                />
                <button
                  onClick={() => setUpload(true)}
                  className="text-body mb-2 hover:text-purple-light"
                >
                  Upload foto
                </button>
                {state.image_cover && (
                  <button className="text-body text-red hover:text-purple-light">Hapus foto</button>
                )}
              </div>
              <div className="flex flex-col">
                <TextField
                  labelText="Judul Artikel :"
                  fullWidth
                  placeholder="Please input text here"
                  variant="borderless"
                  className="mb-8"
                  autoComplete="off"
                  name="title"
                  onChange={handleChange}
                  value={state.title}
                />
                <div className="text-black mb-6 text-body">Isi Artikel :</div>
                <Editor
                  toolbar={{
                    options: [
                      'inline',
                      'blockType',
                      'list',
                      'textAlign',
                      'link',
                      'emoji',
                      'remove',
                      'image',
                      'history',
                    ],
                    blockType: {
                      options: ['Normal', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
                    },
                  }}
                  editorClassName="border border-grey-light px-3 min-h-[200px]"
                  onEditorStateChange={(editorState) => {
                    const rawContent = convertToRaw(editorState.getCurrentContent());

                    const html = draftToHtml(rawContent);

                    setState({
                      ...state,
                      body: html,
                    });
                  }}
                />
              </div>
            </div>
            <div className="sm:pb-20 border-b border-black last:border-0"></div>
          </div>
          <div className="flex justify-center mb-6">
            <Button
              disabled={!(state.image_cover && state.title)}
              isLoading={handleSave.isLoading}
              onClick={() => handleSave.mutate()}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateArtikelPage;
