import { DummyDefaultUpload } from 'assets';
import { Image, Sidebar, UploadPhoto, Textfield, Button, Dialog } from 'components';
import React, { useState, useCallback } from 'react';
import { useMutation } from 'react-query';
import { urlApi } from 'utils';
import { uuid } from 'uuidv4';
import { User } from 'utils/types';
import { useRouter } from 'next/router';
import debounce from 'lodash.debounce';

const CreateUserPage = () => {
  const Router = useRouter();

  const [isUpload, setUpload] = useState<boolean>(false);
  const [state, setState] = useState<Omit<User, 'id' | 'isLoggedIn'> & { password: string }>({
    name: '',
    profile_picture: '',
    role: 1,
    username: '',
    password: '',
    address: '',
    date_of_birth: '',
    email: '',
    phone_number_whatsapp: '',
  });
  const [displayImage, setDisplayImage] = useState<string>('');
  const [isUserNameExist, setIsUserNameExist] = useState<boolean>();
  const [loadingUsername, setLoadingUsername] = useState<boolean>(false);

  const handleUpload = useMutation(
    (blob: Blob) => {
      const formdata = new FormData();
      formdata.append('file', blob, uuid());
      formdata.append('folder_name', 'sellers');

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

  const handleCheckUserName = useCallback(
    debounce(async (username: string) => {
      const res = await fetch(urlApi + `/admin/register/check-username?username=${username}`, {
        credentials: 'include',
      });

      if (res.ok) setIsUserNameExist(true);
      else setIsUserNameExist(false);

      setLoadingUsername(false);
    }, 500),
    []
  );

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;

      setState({
        ...state,
        [name]: value,
      });

      if (name === 'username' && value) {
        setLoadingUsername(true);
        handleCheckUserName(value);
      }
    },
    [handleCheckUserName, state]
  );

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
            Tambah Seller
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
                {displayImage && (
                  <button
                    onClick={() => {
                      setDisplayImage('');
                      setState({
                        ...state,
                        profile_picture: '',
                      });
                    }}
                    className="text-body text-red hover:text-purple-light"
                  >
                    Hapus foto
                  </button>
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
                  labelText="Email :"
                  fullWidth
                  placeholder="jonedoe@gmail.com"
                  variant="borderless"
                  className="mb-8"
                  name="email"
                  onChange={handleChange}
                  value={state.email}
                  autoComplete="off"
                />
                <Textfield
                  labelText="Alamat :"
                  fullWidth
                  placeholder="Jl. Penuh Kenangan No.6"
                  variant="borderless"
                  className="mb-8"
                  name="address"
                  onChange={handleChange}
                  value={state.address}
                  autoComplete="off"
                />
                <Textfield
                  labelText="Tempat, Tanggal Lahir :"
                  fullWidth
                  placeholder="Semarang, 3 September 1996"
                  variant="borderless"
                  className="mb-8"
                  name="date_of_birth"
                  onChange={handleChange}
                  value={state.date_of_birth}
                  autoComplete="off"
                />
                <Textfield
                  labelText="No. Whatsapp :"
                  fullWidth
                  placeholder="08123677489"
                  variant="borderless"
                  className="mb-8"
                  name="phone_number_whatsapp"
                  onChange={handleChange}
                  value={state.phone_number_whatsapp}
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
                  errorMessage="Username tidak dapat digunakan"
                  isValid={isUserNameExist && state.username.length > 0}
                  isError={!isUserNameExist && state.username.length > 0}
                  validMessage="Username dapat digunakan"
                  isLoading={loadingUsername}
                />
                <Textfield
                  name="password"
                  fullWidth
                  labelText="Password :"
                  type="password"
                  variant="borderless"
                  onChange={handleChange}
                  value={state.password}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="flex justify-center mt-20">
              <Button
                disabled={
                  !(
                    state.name &&
                    state.username &&
                    state.password &&
                    isUserNameExist &&
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUserPage;
