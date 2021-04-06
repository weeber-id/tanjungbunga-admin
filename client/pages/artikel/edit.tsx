import { DummyDefaultUpload } from 'assets';
import { Button, Dialog, Image, Sidebar, SidebarMobile, UploadPhoto } from 'components';
import TextField from 'components/atoms/textfield';
import { convertToRaw, EditorState } from 'draft-js';
import { convertFromHTML } from 'draft-convert';
import draftToHtml from 'draftjs-to-html';
import { useMedia } from 'hooks';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { EditorProps } from 'react-draft-wysiwyg';
import { useMutation, useQuery } from 'react-query';
import { urlApi } from 'utils';
import { Article } from 'utils/types';
import { uuid } from 'uuidv4';
import Select, { OptionTypeBase } from 'react-select';
import CardRelated from 'components/mollecules/card-related';

const Editor: React.ComponentType<EditorProps> = dynamic(
  // eslint-disable-next-line
  // @ts-ignore
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

interface ArticlePageProps {
  data: Article;
}

interface RelatedContent {
  id: string;
  name: string;
  source: 'article' | 'travel' | 'culinary' | 'handcraft' | 'lodging';
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

  const [state, setState] = useState<Pick<Article, 'image_cover' | 'title' | 'body' | 'relateds'>>({
    image_cover: data.image_cover,
    title: data.title,
    body: data.body,
  });
  const [isUpload, setUpload] = useState<boolean>(false);
  const [textEditor, setTextEditor] = useState<EditorState | undefined>(() => {
    if (!process.browser) return undefined;

    const blocksFromHTML = convertFromHTML({
      htmlToEntity: (nodeName, node, createEntity) => {
        if (nodeName === 'p' && node.innerHTML === '') {
          return createEntity('BREAK', 'MUTABLE', node);
        }
      },
    })(data.body);

    return EditorState.createWithContent(blocksFromHTML);
  });
  const [relatedOptions, setRelatedOptions] = useState<Record<string, OptionTypeBase>>({});
  const [relatedContent, setRelatedContent] = useState<Record<string, RelatedContent | undefined>>(
    () => {
      const obj: Record<string, RelatedContent | undefined> = {};

      data?.related_details?.forEach(({ id, title, source }) => {
        obj[id] = {
          id,
          source,
          name: title,
        };
      });

      return obj;
    }
  );

  const isMobile = useMedia({ query: '(max-width: 640px)' });

  const { isLoading } = useQuery<RelatedContent[]>(
    'related-articles',
    () => {
      return fetch(urlApi + '/admin/article/list-contents-related', {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => data.data.data);
    },
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        const obj: Record<string, OptionTypeBase> = {};

        data.forEach(({ id, name, source }) => {
          obj[id] = {
            value: id,
            label: name,
            disabled: Object.keys(relatedContent).includes(id),
            data: {
              id,
              source,
              name,
            },
          };
        });
        if (Object.keys(relatedOptions).length <= 0) setRelatedOptions(obj);
      },
    }
  );

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
    body.relateds = Object.values(relatedContent).filter((val) => val !== undefined);

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

      <div className="sm:grid grid-cols-page h-screen">
        {isMobile ? <SidebarMobile /> : <Sidebar />}
        <div className="overflow-y-auto">
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
            Edit Artikel
          </h5>
          <div className="sm:px-12 px-6 py-10">
            <div style={{ gridTemplateColumns: '312px 1fr' }} className="sm:grid gap-x-6">
              <div className="flex flex-col items-start sm:mb-0 mb-4">
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
                  <button className="text-body text-red mb-2 hover:text-purple-light">
                    Hapus foto
                  </button>
                )}
                <div className="text-h5 text-black font-bold my-4">Konten Terkait</div>
                <Select
                  styles={{
                    container: (base) => ({
                      ...base,
                      color: '#393B3D',
                      fontSize: '18px',
                      height: 'fit-content',
                    }),
                    control: (base) => ({
                      ...base,
                      border: '1px solid #485FC0',
                    }),
                  }}
                  className="w-full"
                  isLoading={isLoading}
                  options={Object.values(relatedOptions)}
                  placeholder="Pilih Konten"
                  isSearchable
                  value={null}
                  isDisabled={
                    Object.values(relatedContent).filter((val) => val !== undefined).length >= 3
                  }
                  isOptionDisabled={(option) => Boolean(option.disabled)}
                  onChange={(value) => {
                    setRelatedContent({
                      ...relatedContent,
                      [value?.value]: value?.data,
                    });

                    setRelatedOptions({
                      ...relatedOptions,
                      [value?.value]: {
                        ...value,
                        disabled: true,
                      },
                    });
                  }}
                />
                <div className="mt-4 w-full">
                  {Object.values(relatedContent)
                    .filter((val) => val !== undefined)
                    .map(({ id, name }) => (
                      <CardRelated
                        onDelete={() => {
                          setRelatedContent({
                            ...relatedContent,
                            [id]: undefined,
                          });

                          setRelatedOptions({
                            ...relatedOptions,
                            [id]: {
                              ...relatedOptions[id],
                              disabled: false,
                            },
                          });
                        }}
                        className="mb-3 last:mb-0"
                        key={id}
                        text={name}
                      />
                    ))}
                </div>
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
                  editorClassName="border border-grey-light min-h-[200px] px-3"
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

export default EditArtikelPage;
