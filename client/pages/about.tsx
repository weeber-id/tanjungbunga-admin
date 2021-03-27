import { DummyDefaultUpload } from 'assets';
import { Button, Dialog, Image, Sidebar, Textfield, UploadPhoto } from 'components';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { urlApi } from 'utils';
import { About } from 'utils/types';
import { uuid } from 'uuidv4';

interface PenginapanPageProps {
  data: About;
}

export const getServerSideProps: GetServerSideProps<PenginapanPageProps> = async ({ req }) => {
  const headers = new Headers();
  if (req.headers.cookie) headers.append('cookie', req.headers.cookie);

  const res = await fetch(urlApi + '/admin/about', {
    headers: headers,
  });

  const data = await res.json();

  if (!res.ok)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };

  return {
    props: {
      data: data.data,
    },
  };
};

const AboutPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data }) => {
  const Router = useRouter();

  const [isUpload, setUpload] = useState<boolean>(false);
  const [state, setState] = useState<Omit<About, 'id'>>({
    name: data.name,
    profile_picture: data.profile_picture,
    body: data.body,
    position: data.position,
  });

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
      onSuccess: async (data) => {
        const json = await data.json();

        const photo = json.data.url;

        setState({
          ...state,
          profile_picture: photo,
        });

        setUpload(false);
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

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    setState({
      ...state,
      body: value,
    });
  };

  const handleSave = useMutation(() => {
    return fetch(urlApi + '/admin/about/update', {
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
          onSubmit={() => Router.reload()}
          heading="Berhasil"
          message="Data berhasil diupdate!"
        />
      )}
      {isUpload && (
        <UploadPhoto
          onUpload={(blob) => handleUpload.mutate(blob)}
          aspectRatio="3/4"
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
                  src={state.profile_picture ? state.profile_picture : DummyDefaultUpload}
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
                  name="position"
                  onChange={handleChange}
                  value={state.position}
                  autoComplete="off"
                />
                <div>
                  <p className="text-body text-black mb-1">Isi Sambutan :</p>
                  <textarea
                    maxLength={750}
                    className="border text-body text-black p-2 border-purple-light rounded-md resize-none w-full h-64 focus:outline-none"
                    value={state.body}
                    onChange={handleChangeTextArea}
                  />
                  <div className="text-body text-red text-right">
                    {state.body.length} / 750 Karakter
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-20">
              <Button
                isLoading={handleSave.isLoading}
                onClick={() => handleSave.mutate()}
                className="w-40"
                disabled={!(state.profile_picture && state.name)}
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
