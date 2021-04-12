import classNames from 'classnames';
import {
  Button,
  Dialog,
  Image,
  ItemCardMobile,
  MeetBallMore,
  Pagination,
  Sidebar,
  SidebarMobile,
  Switch,
  Textfield,
} from 'components';
import { useMedia, useUser } from 'hooks';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { urlApi } from 'utils';
import { Lodging } from 'utils/types';

interface PenginapanPageProps {
  data: {
    data: Lodging[];
    max_page: number;
  };
}

export const getServerSideProps: GetServerSideProps<PenginapanPageProps> = async ({ req }) => {
  const headers = new Headers();
  if (req.headers.cookie) headers.append('cookie', req.headers.cookie);

  const res = await fetch(urlApi + '/admin/lodgings?page=1&content_per_page=5', {
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
  const { user } = useUser();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchCache, setSearchCache] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [itemToDelete, setItemToDelete] = useState<Pick<Lodging, 'id' | 'name'>>();
  const [itemToRecommend, setItemToRecommend] = useState<
    Pick<Lodging, 'id' | 'recommendation' | 'name'> | undefined
  >(undefined);

  const queryClient = useQueryClient();

  const isMobile = useMedia({ query: '(max-width: 640px)' });

  const { data: lodgings, isSuccess, isPreviousData } = useQuery(
    ['lodgings', currentPage, search],
    () => {
      const queryParams = [];
      if (search) queryParams.push(`search=${search}`);
      if (queryParams.length > 0) queryParams[0] = `&${queryParams[0]}`;

      return fetch(
        urlApi + `/admin/lodgings?page=${currentPage}&content_per_page=5${queryParams.join('&')}`,
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
        active: !checked,
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

  const handleChangeRecommendation = useMutation(
    ({ id, recommendation }: { id: string; recommendation: boolean }) => {
      const body = {
        id,
        recommendation,
      };

      return fetch(urlApi + `/admin/lodging/update/recommendation`, {
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include',
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: 'lodgings' });
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
          message={`${itemToDelete?.name ?? 'Penginapan'} berhasil dihapus`}
          onSubmit={() => {
            handleDelete.reset();
          }}
        />
      )}
      {handleChangeRecommendation.isSuccess && (
        <Dialog
          singleButton
          heading="Berhasil"
          message={`${itemToRecommend?.name ?? 'Penginapan'} berhasil direkomendasikan`}
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
          heading="Hapus Penginapan"
          message={`Anda yakin ingin menghapus ${itemToDelete?.name ?? ''}`}
          onCancel={() => setItemToDelete(undefined)}
          isLoading={handleDelete.isLoading}
          onSubmit={() => handleDelete.mutate(itemToDelete.id)}
        />
      )}
      {itemToRecommend && (
        <Dialog
          heading={
            itemToRecommend.recommendation ? 'Batalkan Rekomendasi' : 'Rekomendasikan Penginapan'
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
                {isPreviousData && <Skeleton count={5} height={180} />}
                {!isPreviousData &&
                  lodgings?.data?.map((lodging, i) => {
                    const { id, name, price, image, active, slug, recommendation } = lodging;
                    return (
                      <div
                        key={id}
                        className={classNames(
                          'grid gap-x-6 py-2 grid-cols-table items-center text-body text-black  mb-3 last:mb-0',
                          user?.role === 0 && recommendation && active ? 'border-2' : 'border',
                          !active ? 'border-grey-light' : 'border-purple-light'
                        )}
                      >
                        <div className="justify-self-center self-start font-bold">
                          {i + 1 + (currentPage - 1) * 5}
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
                            checked={active}
                            onChange={(e) => handleChangeSwitch.mutate({ e, lodging })}
                          />
                        </div>
                        <div className="relative">
                          <MeetBallMore
                            onEdit={() => Router.push(`/penginapan/edit?id=${id}&slug=${slug}`)}
                            onDelete={() => setItemToDelete(lodging)}
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
            Penginapan
          </h5>
          <div className="p-4">
            <div className="flex items-center mb-8">
              <Button href="/penginapan/create" className="mr-6">
                + Tambah Penginapan
              </Button>
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
              maxPage={lodgings?.max_page}
            />
            <div className="mt-6">
              {isPreviousData && <Skeleton count={5} height={200} />}
              {!isPreviousData &&
                lodgings?.data?.map((lodging, i) => {
                  const { id, name, price, image, active, slug, recommendation } = lodging;
                  const orderNumber = i + 1 + (currentPage - 1) * 5;
                  return (
                    <ItemCardMobile
                      className="mb-3"
                      orderNumber={orderNumber}
                      key={id}
                      label="Harga Penginapan"
                      price={numeral(price.value).format('0,0')}
                      unit={price.unit}
                      name={name}
                      image={image}
                      active={active}
                      onEdit={() => Router.push(`/penginapan/edit?id=${id}&slug=${slug}`)}
                      onDelete={() => setItemToDelete(lodging)}
                      onRecommend={() => setItemToRecommend({ id, name, recommendation })}
                      isRecommended={recommendation}
                      onSwitchChange={(e) => handleChangeSwitch.mutate({ e, lodging })}
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

export default PenginapanPage;
