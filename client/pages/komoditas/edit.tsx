import { DummyDefaultUpload, IconAdd, IconTrash } from 'assets';
import classNames from 'classnames';
import {
  Button,
  Dialog,
  DiscussionRow,
  Image,
  OperationTime,
  Radio,
  Sidebar,
  SidebarMobile,
  Textfield,
  UploadPhoto,
} from 'components';
import TextField from 'components/atoms/textfield';
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { useMedia } from 'hooks';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { EditorProps } from 'react-draft-wysiwyg';
import Skeleton from 'react-loading-skeleton';
import { useMutation, useQuery } from 'react-query';
import { OperationTime24Hours, urlApi } from 'utils';
import { Commodity, Discussion, Link } from 'utils/types';
import { uuid } from 'uuidv4';

const Editor: React.ComponentType<EditorProps> = dynamic(
  // eslint-disable-next-line
  // @ts-ignore
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

interface KomoditasPageProps {
  data: Commodity;
}

export const getServerSideProps: GetServerSideProps<KomoditasPageProps> = async ({
  req,
  query,
}) => {
  const headers = new Headers();
  if (req.headers.cookie) headers.append('cookie', req.headers.cookie);

  const { id, slug } = query;

  const res = await fetch(urlApi + `/admin/culinary?id=${id}&slug=${slug}`, {
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

const EditKomoditasPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  data,
}) => {
  const Router = useRouter();

  const [state, setState] = useState<Omit<Commodity, 'id' | 'slug' | 'active'>>({
    description: data.description,
    image: data.image,
    name: data.name,
    price: {
      unit: data.price.unit,
      start: addCommas(removeNonNumeric(data.price.start)),
      end: addCommas(removeNonNumeric(data.price.end)),
    },
    short_description: data.short_description,
    links: data.links,
    operation_time: data.operation_time,
  });
  const [isUpload, setUpload] = useState<boolean>(false);
  const [linksLength, setLinksLength] = useState<Link[]>(data.links || []);
  const [customHour, setCustomHour] = useState<boolean>(false);
  const [openingHour, setOpeningHour] = useState<Record<string, boolean>>(() => {
    const operationTime: Record<string, any> = { ...data.operation_time };
    const is24Hour = Object.keys(operationTime).every(
      (k) =>
        operationTime[k].open &&
        operationTime[k].from === '00:00' &&
        operationTime[k].to === '23:59'
    );

    if (is24Hour)
      return {
        '24hours': true,
        custom: false,
      };

    return {
      '24hours': false,
      custom: true,
    };
  });
  const [textEditor, setTextEditor] = useState<EditorState | undefined>(() => {
    if (!process.browser) return undefined;

    const blocksFromHTML = convertFromHTML(data.description);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    return EditorState.createWithContent(state);
  });
  const [active, setActive] = useState<'edit' | 'tanya-jawab'>('edit');

  const { data: discussions, isLoading: discussionLoading } = useQuery<Discussion[]>(
    'discussions',
    () => {
      return fetch(
        urlApi + `/admin/discussion?content_name=culinary&content_id=${data.id}&show_answer=true`,
        {
          credentials: 'include',
        }
      )
        .then((res) => res.json())
        .then((data) => data.data);
    }
  );

  const isMobile = useMedia({ query: '(max-width: 640px)' });

  function addCommas(num: string) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  function removeNonNumeric(num: string) {
    return num.toString().replace(/[^0-9]/g, '');
  }

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    const number = addCommas(removeNonNumeric(value));

    setState({
      ...state,
      price: {
        ...state.price,
        unit: 'Item',
        [name]: number,
      },
    });
  };

  const handleAddLink = () => {
    if (linksLength.length < 3) {
      const newItem = { name: '', link: '' };

      setLinksLength([...linksLength, newItem]);
    }
  };

  const handleDeleteLink = () => {
    if (linksLength.length > 1) {
      const newLinks = [...linksLength];
      newLinks.pop();
      setLinksLength(newLinks);
    }
  };

  const handleChangeLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    const index = e.target.getAttribute('data-index');

    let newItem = { ...linksLength[Number(index)] };
    newItem = {
      ...newItem,
      [name]: value,
    };

    const newArray = [...linksLength];
    newArray[Number(index)] = newItem;

    setLinksLength(newArray);
  };

  const handleChangeOpeningHour = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;

    const newObj: Record<string, boolean> = { ...openingHour };

    Object.keys(newObj).forEach((key) => {
      newObj[key] = false;
    });

    setOpeningHour({
      ...newObj,
      [value]: checked,
    });
  };

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
      formdata.append('folder_name', 'commodities');

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
          image: photo,
        });

        setUpload(false);
      },
    }
  );

  const handleSave = useMutation(() => {
    const body = state;

    if (openingHour['24hours']) body.operation_time = OperationTime24Hours;

    body.links = linksLength;
    body.price.start = body.price.start.replace(/\./g, '');
    body.price.end = body.price.end.replace(/\./g, '');

    return fetch(urlApi + `/admin/culinary/update?id=${data.id}`, {
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
          onSubmit={() => Router.push('/komoditas')}
          heading="Berhasil"
          message={`${state.name} Berhasil dibuat!`}
        />
      )}
      {isUpload && (
        <UploadPhoto
          isLoading={handleUpload.isLoading}
          onUpload={(blob) => handleUpload.mutate(blob)}
          aspectRatio="4/3"
          shape="rect"
          onCancel={() => setUpload(false)}
          initialPhoto={state.image}
        />
      )}
      {customHour && (
        <OperationTime
          state={state.operation_time}
          onSave={(operationTime) => {
            setState({
              ...state,
              operation_time: operationTime,
            });
            setCustomHour(false);
          }}
          onCancel={() => setCustomHour(false)}
        />
      )}
      <div className="sm:grid grid-cols-page h-screen">
        {isMobile ? <SidebarMobile /> : <Sidebar />}
        <div className="overflow-y-auto">
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
            Edit Komoditas
          </h5>
          <div className="sm:px-12 px-6 py-10">
            <div style={{ gridTemplateColumns: '312px 1fr' }} className="sm:grid gap-x-6">
              <div className="flex flex-col items-start mb-4 sm:mb-0">
                <Image
                  className="mb-4"
                  src={state.image ? state.image : DummyDefaultUpload}
                  aspectRatio="4/3"
                  lazyLoading
                />
                <button
                  onClick={() => setUpload(true)}
                  className="text-body mb-2 hover:text-purple-light"
                >
                  {data.image ? 'Edit foto' : 'Upload foto'}
                </button>
                {state.image && (
                  <button className="text-body text-red hover:text-purple-light">Hapus foto</button>
                )}
              </div>
              <div className="flex flex-col">
                <TextField
                  labelText="Nama Komoditas :"
                  fullWidth
                  placeholder="Please input text here"
                  variant="borderless"
                  className="mb-8"
                  autoComplete="off"
                  name="name"
                  onChange={handleChange}
                  value={state.name}
                />
                <div className="sm:grid grid-cols-3 gap-x-12 mb-6">
                  <div className="flex flex-col mb-4 sm:mb-0">
                    <TextField
                      labelText="Harga Mulai Dari :"
                      placeholder="Masukan Harga"
                      variant="borderless"
                      fullWidth
                      onChange={handleChangePrice}
                      value={state.price.start}
                      className="mb-4"
                      name="start"
                      autoComplete="off"
                    />
                    <TextField
                      labelText="Harga Sampai Dengan :"
                      placeholder="Masukan Harga"
                      variant="borderless"
                      fullWidth
                      onChange={handleChangePrice}
                      value={state.price.end}
                      name="end"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <span className="text-body text-black mb-2">Jam Buka :</span>
                    <Radio
                      onChange={handleChangeOpeningHour}
                      checked={openingHour['24hours']}
                      labelText="Buka 24 Jam"
                      name="jam"
                      value="24hours"
                    />
                    <Radio
                      onClick={() => setCustomHour(true)}
                      onChange={handleChangeOpeningHour}
                      checked={openingHour['custom']}
                      labelText="Atur Jam Buka"
                      name="jam"
                      value="custom"
                    />
                  </div>
                </div>
                <TextField
                  fullWidth
                  labelText="Penjelasan Singkat Komoditas"
                  variant="borderless"
                  maxLength={180}
                  autoComplete="off"
                  name="short_description"
                  onChange={handleChange}
                  value={state.short_description}
                />
                <div className="text-body-sm text-red text-right mt-1">
                  {state.short_description.length}/180 Karakter
                </div>
              </div>
            </div>
            <div className="flex items-center text-body sm:text-h5 border-b border-grey mt-20">
              <button
                onClick={() => setActive('edit')}
                className={classNames(
                  'text-center py-2 focus:outline-none w-[266px]',
                  active === 'edit' ? 'text-red' : 'text-purple',
                  {
                    'border-b-2 border-red': active === 'edit',
                  }
                )}
              >
                Edit Konten Lengkap
              </button>
              <button
                onClick={() => setActive('tanya-jawab')}
                className={classNames(
                  'text-center py-2 focus:outline-none w-[266px]',
                  active === 'tanya-jawab' ? 'text-red' : 'text-purple',
                  {
                    'border-b-2 border-red': active === 'tanya-jawab',
                  }
                )}
              >
                Tanya Jawab
              </button>
            </div>
            {active === 'edit' && (
              <div>
                <div className="pb-20 border-b border-black last:border-0">
                  <h5 className="text-black font-bold mt-10 mb-6 text-h5">Detail</h5>
                  <Editor
                    toolbar={{
                      options: [
                        'inline',
                        'list',
                        'textAlign',
                        'link',
                        'emoji',
                        'remove',
                        'history',
                      ],
                    }}
                    editorClassName="border border-grey-light h-64"
                    onEditorStateChange={(editorState) => {
                      const rawContent = convertToRaw(editorState.getCurrentContent());

                      const html = draftToHtml(rawContent);

                      setTextEditor(editorState);
                      setState({
                        ...state,
                        description: html,
                      });
                    }}
                    editorState={textEditor}
                  />
                </div>
                <div className="pb-20 border-b border-black last:border-0">
                  <h5 className="text-black font-bold mt-10 mb-6 text-h5">Pesan Komoditas</h5>
                  {linksLength.map((value, i) => (
                    <div
                      key={`value.name-${i}`}
                      style={{ gridTemplateColumns: '80px 1fr' }}
                      className="grid gap-x-6 text-black mb-6 last:mb-0"
                    >
                      <h4 className="text-h4 font-bold">#{i + 1}</h4>
                      <div
                        style={{ gridTemplateColumns: '120px 1fr' }}
                        className="sm:grid gap-x-6 gap-y-3 items-center"
                      >
                        <h5 className="text-h5 font-bold">Platform :</h5>
                        <Textfield
                          onChange={handleChangeLink}
                          inputClassName="bg-blue-light"
                          fullWidth
                          name="name"
                          value={value.name}
                          data-index={i}
                          autoComplete="off"
                          className="mb-3 sm:mb-0"
                        />
                        <h5 className="text-h5 font-bold">Link :</h5>
                        <Textfield
                          onChange={handleChangeLink}
                          fullWidth
                          name="link"
                          value={value.link}
                          data-index={i}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-end mt-6">
                    {linksLength.length < 3 && (
                      <button
                        onClick={handleAddLink}
                        className="h-9 w-9 flex justify-center items-center rounded-md border border-purple-light mr-4"
                      >
                        <IconAdd />
                      </button>
                    )}
                    <button
                      onClick={handleDeleteLink}
                      className="h-9 w-9 flex justify-center items-center rounded-md border border-purple-light"
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {active === 'tanya-jawab' && (
              <div className="mt-10">
                <div className="text-h5 text-black font-medium mb-7">Pertanyaan</div>
                <div>
                  <div
                    style={{ gridTemplateColumns: '80px 250px 1fr 200px' }}
                    className="grid bg-blue-light mb-2.5 text-black py-5 px-4"
                  >
                    <div>No.</div>
                    <div>Email</div>
                    <div>Pertanyaan</div>
                    <div>Jawaban</div>
                  </div>
                  <div>
                    {discussionLoading ? (
                      <Skeleton count={4} height={130} />
                    ) : (
                      discussions?.map(({ id, ...otherProps }, i) => (
                        <DiscussionRow
                          key={id}
                          numberOrder={i + 1}
                          {...otherProps}
                          content_name="culinary"
                          name={data.name}
                          question_id={id}
                        />
                      ))
                    )}
                  </div>
                </div>
                <div className="flex justify-center mt-16">{/* <Pagination /> */}</div>
              </div>
            )}
          </div>
          {active === 'edit' && (
            <div className="flex justify-center mb-6">
              <Button isLoading={handleSave.isLoading} onClick={() => handleSave.mutate()}>
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditKomoditasPage;
