import classNames from 'classnames';
import {
  Button,
  Switch,
  Image,
  MeetBallMore,
  Pagination,
  Sidebar,
  Textfield,
  Dialog,
  ItemCardMobile,
  SidebarMobile,
} from 'components';
import { useMedia, useUser } from 'hooks';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { urlApi } from 'utils';
import { Handcraft } from 'utils/types';

interface KerajinanPageProps {
  data: {
    data: Handcraft[];
    max_page: number;
  };
}

export const getServerSideProps: GetServerSideProps<KerajinanPageProps> = async ({ req }) => {
  const headers = new Headers();
  if (req.headers.cookie) headers.append('cookie', req.headers.cookie);

  const res = await fetch(urlApi + '/admin/handcrafts?page=1&content_per_page=5', {
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

const KerajinanPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  data,
}) => {
  const Router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchCache, setSearchCache] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [itemToDelete, setItemToDelete] = useState<Pick<Handcraft, 'id' | 'name'>>();
  const [itemToRecommend, setItemToRecommend] = useState<
    Pick<Handcraft, 'id' | 'recommendation' | 'name'> | undefined
  >(undefined);

  const { data: handcrafts, isSuccess, isPreviousData } = useQuery(
    ['handcrafts', currentPage, search],
    () => {
      const queryParams = [];
      if (search) queryParams.push(`search=${search}`);
      if (queryParams.length > 0) queryParams[0] = `&${queryParams[0]}`;

      return fetch(
        urlApi + `/admin/handcrafts?page=${currentPage}&content_per_page=5${queryParams.join('&')}`,
        {
          credentials: 'include',
        }
      )
        .then((res) => res.json())
        .then((data) => data.data);
    },
    {
      initialData: data,
      keepPreviousData: true,
    }
  );

  const isMobile = useMedia({ query: '(max-width: 640px)' });

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchCache);
    if (isSuccess) setCurrentPage(1);
  };

  const handleDelete = useMutation(
    (id: string) => {
      return fetch(urlApi + `/admin/handcraft/delete?id=${id}`, {
        method: 'POST',
        credentials: 'include',
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: 'handcrafts' });
        setItemToDelete(undefined);
      },
    }
  );

  const handleChangeSwitch = useMutation(
    ({ e, handcraft }: { e: React.ChangeEvent<HTMLInputElement>; handcraft: Handcraft }) => {
      const { checked } = e.target;

      const body = {
        id: handcraft.id,
        active: !checked,
      };

      return fetch(urlApi + `/admin/handcraft/update/active`, {
        body: JSON.stringify(body),
        method: 'POST',
        credentials: 'include',
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: 'handcrafts' });
      },
    }
  );

  const handleChangeRecommendation = useMutation(
    ({ id, recommendation }: { id: string; recommendation: boolean }) => {
      const body = {
        id,
        recommendation,
      };

      return fetch(urlApi + `/admin/handcraft/update/recommendation`, {
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include',
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: 'handcrafts' });
        setItemToRecommend(undefined);
      },
    }
  );

  return (
    <>
      {handleDelete.isSuccess && (
        <Dialog
          singleButton
          heading="Berhasil"
          message={`${itemToDelete?.name ?? 'Kerajinan'} berhasil dihapus`}
          onSubmit={() => {
            handleDelete.reset();
          }}
        />
      )}
      {handleChangeRecommendation.isSuccess && (
        <Dialog
          singleButton
          heading="Berhasil"
          message={`${itemToRecommend?.name ?? 'Kerajinan'} berhasil direkomendasikan`}
          onSubmit={() => {
            handleChangeRecommendation.reset();
          }}
        />
      )}
      {itemToDelete && (
        <Dialog
          submitText="Hapus"
          highlightCancelButton
          headerColor="red"
          heading="Hapus Kerajinan"
          message={`Anda yakin ingin menghapus ${itemToDelete?.name ?? ''}`}
          onCancel={() => setItemToDelete(undefined)}
          isLoading={handleDelete.isLoading}
          onSubmit={() => handleDelete.mutate(itemToDelete.id)}
        />
      )}
      {itemToRecommend && (
        <Dialog
          heading={
            itemToRecommend.recommendation ? 'Batalkan Rekomendasi' : 'Rekomendasikan Kerajinan'
          }
          message={`Anda yakin ingin ${
            itemToRecommend.recommendation ? 'menghapus rekomendasi' : 'merekomendasikan'
          } ${itemToRecommend?.name ?? ''}`}
          onCancel={() => setItemToRecommend(undefined)}
          isLoading={handleChangeRecommendation.isLoading}
          onSubmit={() =>
            handleChangeRecommendation.mutate({
              id: itemToRecommend.id,
              recommendation: !itemToRecommend.recommendation,
            })
          }
        />
      )}
      {!isMobile && (
        <div className="grid h-screen" style={{ gridTemplateColumns: '240px 1fr' }}>
          <Sidebar />
          <div className="overflow-y-auto pb-10">
            <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
              Belanja
            </h5>
            <div className="px-12 mt-6">
              <Button href="/kerajinan/create">+ Tambah Belanja</Button>
              <div className="flex items-center justify-between mt-10">
                <Pagination
                  onChange={(cp) => setCurrentPage(cp)}
                  currentPage={currentPage}
                  maxPage={handcrafts?.max_page}
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
                  <div>Nama Belanja</div>
                  <div>Harga Belanja</div>
                  <div>Tampilkan</div>
                  <div></div>
                </div>
                {isPreviousData && <Skeleton count={5} height={180} />}
                {!isPreviousData &&
                  handcrafts?.data?.map((handcraft, i) => {
                    const { id, image, name, price, active, slug, recommendation } = handcraft;
                    return (
                      <div
                        key={id}
                        className={classNames(
                          'grid gap-x-6 py-2 grid-cols-table items-center text-body text-black mb-3 last:mb-0',
                          user?.role === 0 && recommendation && active ? 'border-2' : 'border',
                          !active ? 'border-grey-light' : 'border-purple-light'
                        )}
                      >
                        <div className="justify-self-center self-start font-bold">
                          {i + 1 + (currentPage - 1) * 5}
                        </div>
                        <div>
                          <Image src={image} aspectRatio="4/3" className="rounded-lg" />
                        </div>
                        <div>{name}</div>
                        <div>Rp {numeral(price).format('0,0')}</div>
                        <div>
                          <Switch
                            checked={active}
                            onChange={(e) => handleChangeSwitch.mutate({ e, handcraft })}
                          />
                        </div>
                        <div className="relative">
                          <MeetBallMore
                            onEdit={() => Router.push(`/kerajinan/edit?id=${id}&slug=${slug}`)}
                            onDelete={() => setItemToDelete({ id, name })}
                            onRecommend={() => setItemToRecommend({ id, name, recommendation })}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
      {isMobile && (
        <>
          <SidebarMobile />
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-4 border-b border-purple-light">
            Kerajinan
          </h5>
          <div className="p-4">
            <div className="flex items-center mb-8">
              <Button className="mr-6">+ Tambah Kerajinan</Button>
              <form onSubmit={handleSubmitSearch}>
                <Textfield
                  value={searchCache}
                  onChange={(e) => setSearchCache(e.target.value)}
                  variant="search-right"
                  inputClassName="w-full"
                />
              </form>
            </div>
            <Pagination
              currentPage={currentPage}
              onChange={(cp) => setCurrentPage(cp)}
              maxPage={handcrafts?.max_page}
            />
            <div className="mt-6">
              {isPreviousData && <Skeleton count={5} height={200} />}
              {!isPreviousData &&
                handcrafts?.data?.map((handcraft, i) => {
                  const { id, name, price, image, active, slug, recommendation } = handcraft;
                  const orderNumber = i + 1 + (currentPage - 1) * 5;
                  return (
                    <ItemCardMobile
                      className="mb-3"
                      orderNumber={orderNumber}
                      key={id}
                      label="Harga Kerajinan"
                      price={numeral(price).format('0,0')}
                      name={name}
                      image={image}
                      active={active}
                      onEdit={() => Router.push(`/penginapan/edit?id=${id}&slug=${slug}`)}
                      onDelete={() => setItemToDelete(handcraft)}
                      onRecommend={() => setItemToRecommend({ id, name, recommendation })}
                      isRecommended={recommendation}
                      onSwitchChange={(e) => handleChangeSwitch.mutate({ e, handcraft })}
                    />
                  );
                })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default KerajinanPage;
