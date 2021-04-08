import { DummyDefaultUpload } from 'assets';
import { Image, Sidebar, UploadPhoto, Textfield, Button, Dialog, SidebarMobile } from 'components';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { urlApi } from 'utils';
import { uuid } from 'uuidv4';
import { User } from 'utils/types';
import { useRouter } from 'next/router';
import { useMedia, useUser } from 'hooks';
import classNames from 'classnames';

const MyAccountPage = () => {
  const Router = useRouter();
  const { user, mutateUser } = useUser({ redirectTo: '/login' });

  const [isUpload, setUpload] = useState<boolean>(false);
  const [state, setState] = useState<Omit<User, 'id' | 'isLoggedIn'>>({
    name: user?.name || '',
    profile_picture: user?.profile_picture || '',
    role: 1,
    username: user?.username || '',
    address: user?.address || '',
    date_of_birth: user?.date_of_birth || '',
    email: user?.email || '',
    phone_number_whatsapp: user?.phone_number_whatsapp || '',
  });
  const [passwordState, setPasswordState] = useState<Record<string, string>>({
    old_password: '',
    new_password: '',
    confirm_new_password: '',
  });
  const [displayImage, setDisplayImage] = useState<string>(user?.profile_picture || '');
  const [active, setActive] = useState<'profil' | 'password'>('profil');

  const isMobile = useMedia({ query: '(max-width: 640px)' });

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

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setPasswordState({
      ...passwordState,
      [name]: value,
    });
  };

  const handleSave = useMutation(
    async () => {
      const res = await fetch(urlApi + '/admin/update', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(state),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      return fetch('/api/update', {
        method: 'POST',
        body: JSON.stringify(data.data),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());
    },
    {
      onSuccess: async (data) => {
        await mutateUser({
          id: user?.id || '',
          ...data,
        });
      },
    }
  );

  const handleSavePassword = useMutation(
    () => {
      return fetch(urlApi + '/admin/update/password', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(passwordState),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    {
      onSuccess: () => {
        setPasswordState({
          old_password: '',
          new_password: '',
          confirm_new_password: '',
        });
      },
    }
  );

  return (
    <>
      {handleSavePassword.isSuccess && (
        <Dialog
          singleButton
          onSubmit={() => handleSavePassword.reset()}
          heading="Berhasil"
          message="Password berhasil diperbaharui"
        />
      )}
      {handleSave.isSuccess && (
        <Dialog
          singleButton
          onSubmit={() => Router.push('/')}
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
      <div className="sm:grid grid-cols-page h-screen">
        {isMobile ? <SidebarMobile /> : <Sidebar />}
        <div className="overflow-y-auto">
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
            Akun Saya
          </h5>
          <div className="sm:px-12 px-6 py-10">
            <div style={{ gridTemplateColumns: '312px 1fr' }} className="sm:grid gap-x-16">
              <div className="flex flex-col items-center sm:mb-0 mb-4">
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
                <div className="flex items-center text-body sm:text-h5 border-b border-grey mb-12">
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
                      labelText="Email :"
                      fullWidth
                      placeholder="Jane Doe"
                      variant="borderless"
                      className="mb-8"
                      name="email"
                      onChange={handleChange}
                      value={state.email}
                      autoComplete="off"
                    />
                    <Textfield
                      placeholder="janedoe"
                      className="mb-8"
                      fullWidth
                      labelText="Username :"
                      variant="borderless"
                      name="username"
                      value={state.username}
                      autoComplete="off"
                      disabled
                    />
                    <Textfield
                      name="address"
                      fullWidth
                      className="mb-8"
                      labelText="Alamat :"
                      variant="borderless"
                      onChange={handleChange}
                      autoComplete="off"
                      value={state.address}
                    />
                    <Textfield
                      name="date_of_birth"
                      fullWidth
                      labelText="Tempat Tanggal Lahir :"
                      variant="borderless"
                      onChange={handleChange}
                      autoComplete="off"
                      value={state.date_of_birth}
                      className="mb-8"
                    />
                    <Textfield
                      name="phone_number_whatsapp"
                      fullWidth
                      labelText="No. Whatsapp :"
                      variant="borderless"
                      onChange={handleChange}
                      autoComplete="off"
                      value={state.phone_number_whatsapp}
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
                      name="old_password"
                      onChange={handleChangePassword}
                      type="password"
                      autoComplete="off"
                      placeholder="Masukkan password lama"
                      value={passwordState.old_password}
                    />
                    <Textfield
                      className="mb-8"
                      fullWidth
                      labelText="Password Baru :"
                      variant="borderless"
                      name="new_password"
                      onChange={handleChangePassword}
                      type="password"
                      autoComplete="off"
                      placeholder="Masukkan password baru"
                      value={passwordState.new_password}
                    />
                    <Textfield
                      name="confirm_new_password"
                      fullWidth
                      className="mb-8"
                      labelText="Konfirmasi Password :"
                      variant="borderless"
                      onChange={handleChangePassword}
                      type="password"
                      autoComplete="off"
                      placeholder="Masukkan password baru"
                      value={passwordState.confirm_new_password}
                      errorMessage="Password salah"
                      isError={
                        passwordState.new_password !== passwordState.confirm_new_password &&
                        passwordState.confirm_new_password.length > 0
                      }
                    />
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-20">
              {active === 'profil' ? (
                <Button
                  disabled={
                    !(
                      state.name &&
                      state.username &&
                      state.email &&
                      state.address &&
                      state.date_of_birth &&
                      state.phone_number_whatsapp
                    )
                  }
                  isLoading={handleSave.isLoading}
                  onClick={() => handleSave.mutate()}
                  className="w-40"
                >
                  Save
                </Button>
              ) : (
                <Button
                  disabled={
                    !(
                      passwordState.new_password &&
                      passwordState.old_password &&
                      passwordState.confirm_new_password
                    ) || passwordState.new_password !== passwordState.confirm_new_password
                  }
                  isLoading={handleSavePassword.isLoading}
                  onClick={() => handleSavePassword.mutate()}
                >
                  Save Password
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccountPage;
