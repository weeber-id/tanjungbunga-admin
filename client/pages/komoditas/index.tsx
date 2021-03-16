import {
  Button,
  Dialog,
  Image,
  MeetBallMore,
  Pagination,
  Sidebar,
  Switch,
  Textfield,
} from 'components';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import numeral from 'numeral';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { urlApi } from 'utils';
import { Commodity } from 'utils/types';

interface KomoditasPageProps {
  data: {
    data: Commodity[] | null;
    max_page: number;
  };
}

export const getServerSideProps: GetServerSideProps<KomoditasPageProps> = async ({ req }) => {
  const headers = new Headers();
  if (req.headers.cookie) headers.append('cookie', req.headers.cookie);

  const res = await fetch(urlApi + '/admin/culinaries?page=1&content_per_page=7', {
    headers: headers,
  });

  const data = await res.json();

  return {
    props: {
      data: data.data,
    },
  };
};

const KomoditasPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  data,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchCache, setSearchCache] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [itemToDelete, setItemToDelete] = useState<Pick<Commodity, 'id' | 'name'>>();

  const queryClient = useQueryClient();

  const { data: culinaries, isSuccess } = useQuery(
    ['culinaries', currentPage, search],
    () => {
      const queryParams = [];
      if (search) queryParams.push(`search=${search}`);
      if (queryParams.length > 0) queryParams[0] = `&${queryParams[0]}`;

      return fetch(
        urlApi + `/admin/culinaries?page=${currentPage}&content_per_page=7${queryParams.join('&')}`,
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
      return fetch(urlApi + `/admin/culinary/delete?id=${id}`, {
        method: 'POST',
        credentials: 'include',
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: 'culinaries' });
        setItemToDelete(undefined);
      },
    }
  );

  return (
    <>
      {handleDelete.isSuccess && (
        <Dialog
          singleButton
          heading="Berhasil"
          message={`${itemToDelete?.name ?? 'Komoditas'} berhasil dihapus`}
          onSubmit={() => {
            handleDelete.reset();
          }}
        />
      )}
      {itemToDelete && (
        <Dialog
          highlightCancelButton
          headerColor="red"
          heading="Hapus Komoditas"
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
            Komoditas
          </h5>
          <div className="px-12 mt-6">
            <Button href="/komoditas/create">+ Tambah Komoditas</Button>
            <div className="flex items-center justify-between mt-10">
              <Pagination
                onChange={(cp) => setCurrentPage(cp)}
                currentPage={currentPage}
                maxPage={culinaries?.max_page}
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
                <div>Nama Komoditas</div>
                <div>Harga Komoditas</div>
                <div>Tampilkan</div>
                <div></div>
              </div>
              {culinaries?.data?.map(({ id, name, price, image, active }, i) => (
                <div
                  key={id}
                  className="grid gap-x-6 py-2 grid-cols-table items-center text-body text-black border border-purple-light mb-3 last:mb-0"
                >
                  <div className="justify-self-center self-start font-bold">
                    {i + 1 + (currentPage - 1) * 7}
                  </div>
                  <div>
                    <Image src={image} aspectRatio="4/3" className="rounded-lg" />
                  </div>
                  <div>{name}</div>
                  <div>Rp {numeral(price.start).format('0,0')}</div>
                  <div>
                    <Switch checked={active} />
                  </div>
                  <div className="relative">
                    <MeetBallMore onDelete={() => setItemToDelete({ id, name })} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KomoditasPage;
