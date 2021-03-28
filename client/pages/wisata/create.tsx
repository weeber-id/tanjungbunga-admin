import { DummyDefaultUpload } from 'assets';
import { Button, Dialog, Image, OperationTime, Radio, Sidebar, UploadPhoto } from 'components';
import TextField from 'components/atoms/textfield';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { EditorProps } from 'react-draft-wysiwyg';
import { useMutation } from 'react-query';
import Select from 'react-select';
import { OperationTime24Hours, urlApi } from 'utils';
import { Travel } from 'utils/types';
import { uuid } from 'uuidv4';

const Editor: React.ComponentType<EditorProps> = dynamic(
  // eslint-disable-next-line
  // @ts-ignore
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

const CreateWisataPage = () => {
  const Router = useRouter();

  const [state, setState] = useState<Omit<Travel, 'id' | 'slug' | 'active'>>({
    description: '',
    image: '',
    name: '',
    price: '',
    short_description: '',
  });
  const [isUpload, setUpload] = useState<boolean>(false);
  const [customHour, setCustomHour] = useState<boolean>(false);
  const [openingHour, setOpeningHour] = useState<Record<string, boolean>>({
    '24hours': true,
    custom: false,
  });

  const addCommas = (num: string) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const removeNonNumeric = (num: string) => num.toString().replace(/[^0-9]/g, '');

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const number = addCommas(removeNonNumeric(value));

    setState({
      ...state,
      price: number,
    });
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
      formdata.append('folder_name', 'travels');

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

    body.price = body.price.replace(/\./g, '');

    return fetch(urlApi + '/admin/travel/create', {
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
          onSubmit={() => Router.push('/wisata')}
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
      <div className="grid grid-cols-page h-screen">
        <Sidebar />
        <div className="overflow-y-auto">
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
            Tambah Wisata
          </h5>
          <div className="px-12 py-10">
            <div style={{ gridTemplateColumns: '312px 1fr' }} className="grid gap-x-6">
              <div className="flex flex-col items-start">
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
                  Upload foto
                </button>
                {state.image && (
                  <button className="text-body text-red hover:text-purple-light">Hapus foto</button>
                )}
              </div>
              <div className="flex flex-col">
                <TextField
                  labelText="Nama Wisata :"
                  fullWidth
                  placeholder="Please input text here"
                  variant="borderless"
                  className="mb-8"
                  autoComplete="off"
                  name="name"
                  onChange={handleChange}
                />
                <div className="grid grid-cols-3 gap-x-12 mb-6">
                  <div className="flex flex-col">
                    <TextField
                      labelText="Harga Wisata :"
                      placeholder="Masukan Harga"
                      variant="borderless"
                      fullWidth
                      onChange={handleChangePrice}
                      value={state.price}
                      className="mb-4"
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
                  labelText="Penjelasan Singkat Wisata"
                  variant="borderless"
                  maxLength={180}
                  autoComplete="off"
                  name="short_description"
                  onChange={handleChange}
                />
                <div className="text-body-sm text-red text-right mt-1">
                  {state.short_description.length}/180 Karakter
                </div>
              </div>
            </div>
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
                    'image',
                  ],
                }}
                editorClassName="border border-grey-light h-64"
                onEditorStateChange={(editorState) => {
                  const rawContent = convertToRaw(editorState.getCurrentContent());

                  const html = draftToHtml(rawContent);

                  setState({
                    ...state,
                    description: html,
                  });
                }}
              />
            </div>
            <div className="pb-20 border-b border-black last:border-0">
              <h5 className="text-black font-bold mt-10 mb-6 text-h5">Hotel Terdekat</h5>
              <div className="grid grid-cols-3">
                <Select
                  isSearchable
                  options={[
                    {
                      label: 'Nginep di Hotel',
                      value: '123870491lkj',
                      disabled: true,
                    },
                    {
                      label: 'Nginep di Gudang',
                      value: '123870491lk',
                    },
                    {
                      label: 'Nginep di Cafe',
                      value: '123870491kj',
                    },
                  ]}
                  placeholder="Pilih Hotel"
                  styles={{
                    container: (base) => ({
                      ...base,
                      color: '#393B3D',
                      fontSize: '18px',
                    }),
                    control: (base) => ({
                      ...base,
                      border: '1px solid #485FC0',
                    }),
                  }}
                  isOptionDisabled={(option) => Boolean(option.disabled)}
                  value={null}
                  onChange={(value) => console.log(value)}
                />
              </div>
            </div>
            <div className="pb-20 border-b border-black last:border-0">
              <h5 className="text-black font-bold mt-10 mb-6 text-h5">Kuliner Terdekat</h5>
              <div className="grid grid-cols-3">
                <Select
                  isSearchable
                  options={[
                    {
                      label: 'Nginep di Hotel',
                      value: '123870491lkj',
                      disabled: true,
                    },
                    {
                      label: 'Nginep di Gudang',
                      value: '123870491lk',
                    },
                    {
                      label: 'Nginep di Cafe',
                      value: '123870491kj',
                    },
                  ]}
                  placeholder="Pilih Hotel"
                  styles={{
                    container: (base) => ({
                      ...base,
                      color: '#393B3D',
                      fontSize: '18px',
                    }),
                    control: (base) => ({
                      ...base,
                      border: '1px solid #485FC0',
                    }),
                  }}
                  isOptionDisabled={(option) => Boolean(option.disabled)}
                  value={null}
                  onChange={(value) => console.log(value)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center mb-6">
            <Button
              disabled={!(state.name && state.image)}
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

export default CreateWisataPage;
