import { DummyDefaultUpload } from 'assets';
import { Button, Dialog, Image, Sidebar, UploadPhoto } from 'components';
import TextField from 'components/atoms/textfield';
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
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

interface ArticlePageProps {
  data: Article;
}

export const getServerSideProps: GetServerSideProps<ArticlePageProps> = async ({ req, query }) => {
  const headers = new Headers();
  if (req.headers.cookie) headers.append('cookie', req.headers.cookie);

  const { id, slug } = query;

  const res = await fetch(urlApi + `/admin/article?id=${id}&slug=${slug}`, {
    headers: headers,
  });

  const data = await res.json();

  if (!res.ok)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };

  return {
    props: {
      data: data.data,
    },
  };
};

const EditArtikelPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  data,
}) => {
  const Router = useRouter();

  const [state, setState] = useState<Pick<Article, 'image_cover' | 'title' | 'body'>>({
    image_cover: data.image_cover,
    title: data.title,
    body: data.body,
  });
  const [isUpload, setUpload] = useState<boolean>(false);
  const [textEditor, setTextEditor] = useState<EditorState | undefined>(() => {
    if (!process.browser) return undefined;

    const blocksFromHTML = convertFromHTML(data.body);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    return EditorState.createWithContent(state);
  });

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

    return fetch(urlApi + `/admin/article/update?id=${data.id}`, {
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
          message={`${state.title} Berhasil diupdate!`}
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

      <div className="grid grid-cols-page h-screen">
        <Sidebar />
        <div className="overflow-y-auto">
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
            Tambah Artikel
          </h5>
          <div className="px-12 py-10">
            <div style={{ gridTemplateColumns: '312px 1fr' }} className="grid gap-x-6">
              <div className="flex flex-col items-start">
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
                  }}
                  editorClassName="border border-grey-light min-h-[200px]"
                  onEditorStateChange={(editorState) => {
                    const rawContent = convertToRaw(editorState.getCurrentContent());

                    const html = draftToHtml(rawContent);

                    setTextEditor(editorState);
                    setState({
                      ...state,
                      body: html,
                    });
                  }}
                  editorState={textEditor}
                />
              </div>
            </div>
            <div className="pb-20 border-b border-black last:border-0"></div>
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

export default EditArtikelPage;
