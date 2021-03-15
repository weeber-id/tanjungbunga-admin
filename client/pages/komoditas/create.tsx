import { EditorProps } from 'react-draft-wysiwyg';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { DummyDefaultUpload, IconAdd, IconTrash } from 'assets';
import { Image, OperationTime, Radio, Sidebar, Textfield, UploadPhoto } from 'components';
import TextField from 'components/atoms/textfield';
import { Link } from 'utils/types';

const Editor: React.ComponentType<EditorProps> = dynamic(
  // eslint-disable-next-line
  // @ts-ignore
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

const CreateKomoditasPage = () => {
  const [price, setPrice] = useState<string>('');
  const [isUpload, setUpload] = useState<boolean>(false);
  const [linksLength, setLinksLength] = useState<Link[]>([{ name: '', link: '' }]);
  const [customHour, setCustomHour] = useState<boolean>(false);
  const [openingHour, setOpeningHour] = useState<Record<string, boolean>>({
    '24hours': true,
    custom: false,
  });

  const addCommas = (num: string) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const removeNonNumeric = (num: string) => num.toString().replace(/[^0-9]/g, '');

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setPrice(addCommas(removeNonNumeric(value)));
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

  return (
    <>
      {isUpload && <UploadPhoto aspectRatio="4/3" shape="rect" onCancel={() => setUpload(false)} />}
      {customHour && <OperationTime onCancel={() => setCustomHour(false)} />}
      <div className="grid grid-cols-page h-screen">
        <Sidebar />
        <div className="overflow-y-auto">
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
            Tambah Komoditas
          </h5>
          <div className="px-12 py-10">
            <div style={{ gridTemplateColumns: '312px 1fr' }} className="grid gap-x-6">
              <div className="flex flex-col items-start">
                <Image className="mb-4" src={DummyDefaultUpload} aspectRatio="4/3" />
                <button
                  onClick={() => setUpload(true)}
                  className="text-body mb-2 hover:text-purple-light"
                >
                  Upload foto
                </button>
                <button className="text-body text-red hover:text-purple-light">Hapus foto</button>
              </div>
              <div className="flex flex-col">
                <TextField
                  labelText="Nama Komoditas :"
                  fullWidth
                  placeholder="Please input text here"
                  variant="borderless"
                  className="mb-8"
                />
                <div className="grid grid-cols-3 gap-x-12">
                  <TextField
                    labelText="Harga Komoditas :"
                    placeholder="Masukan Harga"
                    variant="borderless"
                    fullWidth
                    onChange={handleChangePrice}
                    value={price}
                  />
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
                />
                <div className="text-body-sm text-red text-right mt-1">0/180 Karakter</div>
              </div>
            </div>
            <div className="pb-20 border-b border-black last:border-0">
              <h5 className="text-black font-bold mt-10 mb-6 text-h5">Detail</h5>
              <Editor
                toolbar={{
                  options: ['inline', 'list', 'textAlign', 'link', 'emoji', 'remove', 'history'],
                }}
                editorClassName="border border-grey-light h-64"
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
                    className="grid gap-x-6 gap-y-3 items-center"
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
        </div>
      </div>
    </>
  );
};

export default CreateKomoditasPage;
