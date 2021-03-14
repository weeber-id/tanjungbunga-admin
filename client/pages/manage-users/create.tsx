import { DummyDefaultUpload } from 'assets';
import { Image, Sidebar, UploadPhoto, Textfield, Button } from 'components';
import { useState } from 'react';

const CreateUserPage = () => {
  const [isUpload, setUpload] = useState<boolean>(false);

  return (
    <>
      {isUpload && (
        <UploadPhoto aspectRatio="1/1" shape="round" onCancel={() => setUpload(false)} />
      )}
      <div className="grid grid-cols-page h-screen">
        <Sidebar />
        <div className="overflow-y-auto">
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
            Tambah Komoditas
          </h5>
          <div className="px-12 py-10">
            <div style={{ gridTemplateColumns: '312px 1fr' }} className="grid gap-x-16">
              <div className="flex flex-col items-center">
                <Image
                  width={224}
                  className="mb-4 rounded-full"
                  src={DummyDefaultUpload}
                  aspectRatio="1/1"
                />
                <button
                  onClick={() => setUpload(true)}
                  className="text-body mb-2 hover:text-purple-light"
                >
                  Upload foto
                </button>
                <button className="text-body text-red hover:text-purple-light">Hapus foto</button>
              </div>
              <div className="flex flex-col">
                <Textfield
                  labelText="Nama :"
                  fullWidth
                  placeholder="Jane Doe"
                  variant="borderless"
                  className="mb-8"
                />
                <Textfield
                  placeholder="janedoe"
                  className="mb-8"
                  fullWidth
                  labelText="Username :"
                  variant="borderless"
                />
                <Textfield fullWidth labelText="Password :" type="password" variant="borderless" />
              </div>
            </div>
            <div className="flex justify-center mt-20">
              <Button className="w-40">Save</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUserPage;
