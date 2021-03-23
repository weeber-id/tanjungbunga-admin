import { DummyDefaultUpload } from 'assets';
import { Image, Sidebar, UploadPhoto, Textfield, Button, Dialog } from 'components';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { urlApi } from 'utils';
import { uuid } from 'uuidv4';
import { User } from 'utils/types';
import { useRouter } from 'next/router';

const AboutPage = () => {
  const Router = useRouter();

  const [isUpload, setUpload] = useState<boolean>(false);
  const [state, setState] = useState<Omit<User, 'id' | 'isLoggedIn'> & { password: string }>({
    name: '',
    profile_picture: '',
    role: 1,
    username: '',
    password: '',
  });
  const [displayImage, setDisplayImage] = useState<string>('');

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
          profile_picture: photo,
        });

        setUpload(false);
        setDisplayImage(URL.createObjectURL(blob));
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSave = useMutation(() => {
    return fetch(urlApi + '/admin/register', {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(state),
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
          onSubmit={() => Router.push('/manage-users')}
          heading="Berhasil"
          message={`${state.name} Berhasil dibuat!`}
        />
      )}
      {isUpload && (
        <UploadPhoto
          onUpload={(blob) => handleUpload.mutate(blob)}
          aspectRatio="3/4"
          shape="round"
          onCancel={() => setUpload(false)}
          isLoading={handleUpload.isLoading}
        />
      )}
      <div className="grid grid-cols-page h-screen">
        <Sidebar />
        <div className="overflow-y-auto">
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
            Tentang
          </h5>
          <div className="px-12 py-10">
            <div style={{ gridTemplateColumns: '312px 1fr' }} className="grid gap-x-16">
              <div className="flex flex-col items-start">
                <h5 className="text-h5 font-bold mb-4">Sambutan</h5>
                <Image
                  width={224}
                  className="mb-4"
                  src={state.profile_picture ? displayImage : DummyDefaultUpload}
                  aspectRatio="3/4"
                  lazyLoading
                />
                <button
                  onClick={() => setUpload(true)}
                  className="text-body mb-2 hover:text-purple-light"
                >
                  Upload foto
                </button>
                {state.profile_picture && (
                  <button className="text-body text-red hover:text-purple-light">Hapus foto</button>
                )}
              </div>
              <div className="flex flex-col">
                <Textfield
                  labelText="Nama :"
                  fullWidth
                  placeholder="Jane Doe"
                  variant="borderless"
                  className="mb-8"
                  name="name"
                  onChange={handleChange}
                  value={state.name}
                  autoComplete="off"
                />
                <Textfield
                  placeholder="janedoe"
                  className="mb-8"
                  fullWidth
                  labelText="Jabatan :"
                  variant="borderless"
                  name="username"
                  onChange={handleChange}
                  value={state.username}
                  autoComplete="off"
                />
                <div>
                  <p className="text-body text-black mb-1">Isi Sambutan :</p>
                  <textarea
                    maxLength={750}
                    className="border border-purple-light rounded-md resize-none w-full h-64"
                  />
                  <div className="text-body text-red text-right">0 / 750 Karakter</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-20">
              <Button
                isLoading={handleSave.isLoading}
                onClick={() => handleSave.mutate()}
                className="w-40"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
