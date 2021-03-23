import { DummyDefaultUpload } from 'assets';
import { Image, Sidebar, UploadPhoto, Textfield, Button, Dialog } from 'components';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { urlApi } from 'utils';
import { uuid } from 'uuidv4';
import { User } from 'utils/types';
import { useRouter } from 'next/router';
import { useUser } from 'hooks';
import classNames from 'classnames';

const MyAccountPage = () => {
  const Router = useRouter();
  const { user } = useUser({ redirectTo: '/login' });

  const [isUpload, setUpload] = useState<boolean>(false);
  const [state, setState] = useState<Omit<User, 'id' | 'isLoggedIn'>>({
    name: user?.name || '',
    profile_picture: user?.profile_picture || '',
    role: 1,
    username: user?.username || '',
  });
  const [displayImage, setDisplayImage] = useState<string>(user?.profile_picture || '');
  const [active, setActive] = useState<'profil' | 'password'>('profil');

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
          aspectRatio="1/1"
          shape="round"
          onCancel={() => setUpload(false)}
          isLoading={handleUpload.isLoading}
        />
      )}
      <div className="grid grid-cols-page h-screen">
        <Sidebar />
        <div className="overflow-y-auto">
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
            Akun Saya
          </h5>
          <div className="px-12 py-10">
            <div style={{ gridTemplateColumns: '312px 1fr' }} className="grid gap-x-16">
              <div className="flex flex-col items-center">
                <Image
                  width={224}
                  className="mb-4 rounded-full"
                  src={state.profile_picture ? displayImage : DummyDefaultUpload}
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
                <div className="flex items-center text-h5 border-b border-grey mb-12">
                  <button
                    onClick={() => setActive('profil')}
                    className={classNames(
                      'text-center py-2 focus:outline-none w-[266px]',
                      active === 'profil' ? 'text-red' : 'text-purple',
                      {
                        'border-b-2 border-red': active === 'profil',
                      }
                    )}
                  >
                    Profil
                  </button>
                  <button
                    onClick={() => setActive('password')}
                    className={classNames(
                      'text-center py-2 focus:outline-none w-[266px]',
                      active === 'password' ? 'text-red' : 'text-purple',
                      {
                        'border-b-2 border-red': active === 'password',
                      }
                    )}
                  >
                    Edit Password
                  </button>
                </div>
                {active === 'profil' && (
                  <>
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
                      labelText="Username :"
                      variant="borderless"
                      name="username"
                      onChange={handleChange}
                      value={state.username}
                      autoComplete="off"
                    />
                    <Textfield
                      name="address"
                      fullWidth
                      className="mb-8"
                      labelText="Alamat :"
                      variant="borderless"
                      onChange={handleChange}
                      autoComplete="off"
                    />
                    <Textfield
                      name="born"
                      fullWidth
                      labelText="Tempat Tanggal Lahir :"
                      variant="borderless"
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </>
                )}
                {active === 'password' && (
                  <>
                    <Textfield
                      labelText="Password Lama :"
                      fullWidth
                      variant="borderless"
                      className="mb-8"
                      name="name"
                      onChange={handleChange}
                      type="password"
                      autoComplete="off"
                    />
                    <Textfield
                      className="mb-8"
                      fullWidth
                      labelText="Password Baru :"
                      variant="borderless"
                      name="username"
                      onChange={handleChange}
                      type="password"
                      autoComplete="off"
                    />
                    <Textfield
                      name="address"
                      fullWidth
                      className="mb-8"
                      labelText="Konfirmasi Password :"
                      variant="borderless"
                      onChange={handleChange}
                      type="password"
                      autoComplete="off"
                    />
                  </>
                )}
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

export default MyAccountPage;
