import { DummyDefaultUpload } from 'assets';
import { Image, Sidebar } from 'components';
import TextField from 'components/atoms/textfield';
import React, { useState } from 'react';

const CreateKomoditasPage = () => {
  const [price, setPrice] = useState<string>('');

  const addCommas = (num: string) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const removeNonNumeric = (num: string) => num.toString().replace(/[^0-9]/g, '');

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setPrice(addCommas(removeNonNumeric(value)));
  };

  return (
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
              <button className="text-body mb-2 hover:text-purple-light">Upload foto</button>
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
              <div className="grid grid-cols-2 gap-x-6">
                <TextField
                  labelText="Harga Komoditas :"
                  placeholder="Masukan Harga"
                  variant="borderless"
                  fullWidth
                  onChange={handleChangePrice}
                  value={price}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateKomoditasPage;
