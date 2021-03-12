// import { Editor } from 'react-draft-wysiwyg';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { DummyDefaultUpload } from 'assets';
import { Image, Radio, Sidebar, UploadPhoto } from 'components';
import TextField from 'components/atoms/textfield';

const Editor = dynamic(
  // eslint-disable-next-line
  // @ts-ignore
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

const CreateKomoditasPage = () => {
  const [price, setPrice] = useState<string>('');
  const [isUpload, setUpload] = useState<boolean>(false);

  const addCommas = (num: string) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const removeNonNumeric = (num: string) => num.toString().replace(/[^0-9]/g, '');

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setPrice(addCommas(removeNonNumeric(value)));
  };

  return (
    <>
      {isUpload && <UploadPhoto onCancel={() => setUpload(false)} />}
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
                    <Radio labelText="Buka 24 Jam" name="jam" value="24hours" />
                    <Radio labelText="Custom Jam" name="jam" value="custom" />
                  </div>
                </div>
                <TextField
                  fullWidth
                  labelText="Penjelasan Singkat Komoditas"
                  variant="borderless"
                />
                <div className="text-body-sm text-red text-right mt-1">0/180 Karakter</div>
              </div>
            </div>
            <h5 className="text-black font-bold mt-10 mb-6 text-h5">Detail</h5>
            <Editor
              toolbar={{
                options: ['inline', 'list', 'textAlign', 'link', 'emoji', 'remove', 'history'],
              }}
              editorClassName="border border-grey-light h-64"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateKomoditasPage;
