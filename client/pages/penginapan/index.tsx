import numeral from 'numeral';
import {
  Button,
  Switch,
  Image,
  MeetBallMore,
  Pagination,
  Sidebar,
  Textfield,
  Dialog,
} from 'components';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { urlApi } from 'utils';
import { Lodging } from 'utils/types';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface PenginapanPageProps {
  data: {
    data: Lodging[];
    max_page: number;
  };
}

export const getServerSideProps: GetServerSideProps<PenginapanPageProps> = async ({ req }) => {
  const headers = new Headers();
  if (req.headers.cookie) headers.append('cookie', req.headers.cookie);

  const res = await fetch(urlApi + '/admin/lodgings?page=1&content_per_page=7', {
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

const PenginapanPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  data,
}) => {
  const Router = useRouter();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchCache, setSearchCache] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [itemToDelete, setItemToDelete] = useState<Pick<Lodging, 'id' | 'name'>>();

  const queryClient = useQueryClient();

  const { data: lodgings, isSuccess } = useQuery(
    ['lodgings', currentPage, search],
    () => {
      const queryParams = [];
      if (search) queryParams.push(`search=${search}`);
      if (queryParams.length > 0) queryParams[0] = `&${queryParams[0]}`;

      return fetch(
        urlApi + `/admin/lodgings?page=${currentPage}&content_per_page=7${queryParams.join('&')}`,
        {
          credentials: 'include',
        }
      )
        .then((res) => res.json())
        .then((data) => data.data);
    },
    {
      initialData: data,
    }
  );

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchCache);
    if (isSuccess) setCurrentPage(1);
  };

  const handleDelete = useMutation(
    (id: string) => {
      return fetch(urlApi + `/admin/lodging/delete?id=${id}`, {
        method: 'POST',
        credentials: 'include',
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: 'lodgings' });
        setItemToDelete(undefined);
      },
    }
  );

  const handleChangeSwitch = useMutation(
    ({ e, lodging }: { e: React.ChangeEvent<HTMLInputElement>; lodging: Lodging }) => {
      const { checked } = e.target;

      const body = {
        id: lodging.id,
        active: checked,
      };

      return fetch(urlApi + `/admin/lodging/update/active`, {
        body: JSON.stringify(body),
        method: 'POST',
        credentials: 'include',
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: 'lodgings' });
      },
    }
  );

  return (
    <>
      {handleDelete.isSuccess && (
        <Dialog
          singleButton
          heading="Berhasil"
          message={`${itemToDelete?.name ?? 'Penginapan'} berhasil dihapus`}
          onSubmit={() => {
            handleDelete.reset();
          }}
        />
      )}
      {itemToDelete && (
        <Dialog
          submitText="Hapus"
          highlightCancelButton
          headerColor="red"
          heading="Hapus Penginapan"
          message={`Anda yakin ingin menghapus ${itemToDelete?.name ?? ''}`}
          onCancel={() => setItemToDelete(undefined)}
          isLoading={handleDelete.isLoading}
          onSubmit={() => handleDelete.mutate(itemToDelete.id)}
        />
      )}
      <div className="grid h-screen" style={{ gridTemplateColumns: '240px 1fr' }}>
        <Sidebar />
        <div className="overflow-y-auto pb-10">
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
            Penginapan
          </h5>
          <div className="px-12 mt-6">
            <Button href="/penginapan/create">+ Tambah Penginapan</Button>
            <div className="flex items-center justify-between mt-10">
              <Pagination
                currentPage={currentPage}
                onChange={(cp) => setCurrentPage(cp)}
                maxPage={lodgings?.max_page}
              />
              <form onSubmit={handleSubmitSearch}>
                <Textfield
                  value={searchCache}
                  onChange={(e) => setSearchCache(e.target.value)}
                  variant="search-right"
                />
              </form>
            </div>
            <div className="mt-4">
              <div className="grid gap-x-6 grid-cols-table text-body font-medium text-purple border border-purple-light rounded-tl-lg rounded-tr-lg py-2 mb-1">
                <div className="justify-self-center">No.</div>
                <div>Foto</div>
                <div>Nama Penginapan</div>
                <div>Harga Penginapan</div>
                <div>Tampilkan</div>
                <div></div>
              </div>
              {lodgings?.data?.map((lodging, i) => {
                const { id, name, price, image, active, slug } = lodging;
                return (
                  <div
                    key={id}
                    className="grid gap-x-6 py-2 grid-cols-table items-center text-body text-black border border-purple-light mb-3 last:mb-0"
                  >
                    <div className="justify-self-center self-start font-bold">
                      {i + 1 + (currentPage - 1) * 7}
                    </div>
                    <div>
                      <Image
                        src={image}
                        objectPosition="0 0"
                        objectFit="cover"
                        aspectRatio="4/3"
                        className="rounded-lg"
                      />
                    </div>
                    <div>{name}</div>
                    <div>
                      Rp {numeral(price.value).format('0,0')} /{price.unit}
                    </div>
                    <div>
                      <Switch
                        defaultChecked={active}
                        onChange={(e) => handleChangeSwitch.mutate({ e, lodging })}
                      />
                    </div>
                    <div className="relative">
                      <MeetBallMore
                        onEdit={() => Router.push(`/penginapan/edit?id=${id}&slug=${slug}`)}
                        onDelete={() => setItemToDelete(lodging)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PenginapanPage;
