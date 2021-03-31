import { EditorProps } from 'react-draft-wysiwyg';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import dynamic from 'next/dynamic';
import { DummyDefaultUpload, IconAdd, IconTrash } from 'assets';
import {
  Button,
  Dialog,
  FasilitasIcon,
  Image,
  OperationTime,
  Radio,
  Sidebar,
  SidebarMobile,
  Textfield,
  UploadPhoto,
} from 'components';
import TextField from 'components/atoms/textfield';
import { Facility, Link, Lodging } from 'utils/types';
import { useMutation, useQuery } from 'react-query';
import { OperationTime24Hours, urlApi } from 'utils';
import { useRouter } from 'next/router';
import { uuid } from 'uuidv4';
import { Checkbox } from '@material-ui/core';
import { useMedia } from 'hooks';

const Editor: React.ComponentType<EditorProps> = dynamic(
  // eslint-disable-next-line
  // @ts-ignore
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

const CreatePenginapanPage = () => {
  const Router = useRouter();

  const [state, setState] = useState<Omit<Lodging, 'id' | 'slug' | 'active' | 'facilities'>>({
    description: '',
    image: '',
    name: '',
    price: {
      value: '',
      unit: 'orang',
    },
    short_description: '',
    links: [],
  });
  const [isUpload, setUpload] = useState<boolean>(false);
  const [displayImage, setDisplayImage] = useState<string>('');
  const [linksLength, setLinksLength] = useState<Link[]>([{ name: '', link: '' }]);
  const [customHour, setCustomHour] = useState<boolean>(false);
  const [openingHour, setOpeningHour] = useState<Record<string, boolean>>({
    '24hours': true,
    custom: false,
  });
  const [facilitiesMap, setFacilitiesMap] = useState<Record<string, boolean>>({});

  const { data: facilities, isLoading } = useQuery<Facility[]>('facilities', () =>
    fetch(urlApi + '/admin/lodging/facilities', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => data.data)
  );

  const isMobile = useMedia({ query: '(max-width: 640px)' });

  const addCommas = (num: string) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const removeNonNumeric = (num: string) => num.toString().replace(/[^0-9]/g, '');

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const number = addCommas(removeNonNumeric(value));

    setState({
      ...state,
      price: {
        unit: 'orang',
        value: number,
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
      formdata.append('folder_name', 'lodgings');

      return fetch(urlApi + '/admin/media/upload/public', {
        method: 'POST',
        body: formdata,
        credentials: 'include',
      });
    },
    {
      onSuccess: async (data, blob) => {
        const json = await data.json();

        const photo = json.data.url;

        setState({
          ...state,
          image: photo,
        });

        setUpload(false);
        setDisplayImage(URL.createObjectURL(blob));
      },
    }
  );

  const handleSave = useMutation(() => {
    const body = state;

    if (openingHour['24hours']) body.operation_time = OperationTime24Hours;

    body.links = linksLength;
    body.price.value = body.price.value.replace(/\./g, '');
    body.facilities_id = Object.keys(facilitiesMap).filter((key) => facilitiesMap[key]);

    return fetch(urlApi + '/admin/lodging/create', {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  const handleChangeFacilities = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;

    setFacilitiesMap({
      ...facilitiesMap,
      [value]: checked,
    });
  };

  return (
    <>
      {handleSave.isSuccess && (
        <Dialog
          singleButton
          onSubmit={() => Router.push('/penginapan')}
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
            Tambah Penginapan
          </h5>
          <div className="sm:px-12 px-6 py-10">
            <div style={{ gridTemplateColumns: '312px 1fr' }} className="sm:grid gap-x-6">
              <div className="flex flex-col items-start sm:mb-0 mb-4">
                <Image
                  className="mb-4"
                  src={state.image ? displayImage : DummyDefaultUpload}
                  aspectRatio="4/3"
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
                  labelText="Nama Penginapan :"
                  fullWidth
                  placeholder="Please input text here"
                  variant="borderless"
                  className="mb-8"
                  autoComplete="off"
                  name="name"
                  onChange={handleChange}
                />
                <div className="sm:grid grid-cols-3 gap-x-12 mb-6">
                  <div className="flex flex-col">
                    <TextField
                      labelText="Harga Penginapan :"
                      placeholder="Masukan Harga"
                      variant="borderless"
                      fullWidth
                      onChange={handleChangePrice}
                      value={state.price.value}
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
                  labelText="Penjelasan Singkat Penginapan"
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
              <h5 className="text-black font-bold mt-10 mb-6 text-h5">Pilih Fasilitas</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {isLoading ? (
                  <>
                    <Skeleton height={62} />
                    <Skeleton height={62} />
                    <Skeleton height={62} />
                    <Skeleton height={62} />
                    <Skeleton height={62} />
                    <Skeleton height={62} />
                    <Skeleton height={62} />
                    <Skeleton height={62} />
                    <Skeleton height={62} />
                  </>
                ) : (
                  facilities?.map(({ name, icon, id }) => (
                    <div key={id} className="flex items-center">
                      <Checkbox
                        value={id}
                        onChange={handleChangeFacilities}
                        style={{ color: '#F05B4C' }}
                        checked={facilitiesMap[id] || false}
                      />
                      <FasilitasIcon src={icon} text={name} />
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="pb-20 border-b border-black last:border-0">
              <h5 className="text-black font-bold mt-10 mb-6 text-h5">Pesan Penginapan</h5>
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
                      className="sm:mb-0 mb-3"
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
          <div className="flex justify-center mb-6">
            <Button isLoading={handleSave.isLoading} onClick={() => handleSave.mutate()}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePenginapanPage;
