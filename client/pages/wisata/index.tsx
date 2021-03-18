import { Button, Image, MeetBallMore, Pagination, Sidebar, Switch, Textfield } from 'components';
import { useUser } from 'hooks';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { urlApi } from 'utils';
import { Travel } from 'utils/types';

interface WisataPageProps {
  data: {
    data: Travel[];
    max_page: number;
  };
}

export const getServerSideProps: GetServerSideProps<WisataPageProps> = async ({ req }) => {
  const headers = new Headers();
  if (req.headers.cookie) headers.append('cookie', req.headers.cookie);

  const res = await fetch(urlApi + '/admin/travels?page=1&content_per_page=7', {
    headers: headers,
  });

  const data = await res.json();

  if (!res.ok)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
      props: {
        data: undefined,
      },
    };

  return {
    props: {
      data: data.data,
    },
  };
};

const WisataPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data }) => {
  const { user } = useUser();
  const Router = useRouter();

  if (user?.role === 1) Router.replace('/penginapan');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchCache, setSearchCache] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const { data: travels, isSuccess } = useQuery(
    ['travels', currentPage, search],
    () => {
      const queryParams = [];
      if (search) queryParams.push(`search=${search}`);
      if (queryParams.length > 0) queryParams[0] = `&${queryParams[0]}`;

      return fetch(
        urlApi + `/admin/travels?page=${currentPage}&content_per_page=7${queryParams.join('&')}`,
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

  return (
    <div className="grid h-screen" style={{ gridTemplateColumns: '240px 1fr' }}>
      <Sidebar />
      <div className="overflow-y-auto pb-10">
        <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
          Wisata
        </h5>
        <div className="px-12 mt-6">
          <Button>+ Tambah Wisata</Button>
          <div className="flex items-center justify-between mt-10">
            <Pagination
              currentPage={currentPage}
              onChange={(cp) => setCurrentPage(cp)}
              maxPage={travels?.max_page}
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
              <div>Nama Wisata</div>
              <div>Harga Wisata</div>
              <div>Tampilkan</div>
              <div></div>
            </div>
            {travels?.data?.map(({ id, name, price, image }, i) => (
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
                <div>Rp {numeral(price).format('0,0')} /orang</div>
                <div>
                  <Switch />
                </div>
                <div className="relative">
                  <MeetBallMore />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WisataPage;
