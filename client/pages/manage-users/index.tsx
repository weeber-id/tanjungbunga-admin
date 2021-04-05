import { ImgNoAvatar } from 'assets';
import { Button, Dialog, Pagination, Sidebar, Textfield, UserAccount } from 'components';
import { useUser } from 'hooks';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { urlApi } from 'utils';
import { User } from 'utils/types';

interface ManageUsersPageProps {
  admin: {
    data: User[];
    max_page: number;
  };
  seller: {
    data: User[];
    max_page: number;
  };
}

export const getServerSideProps: GetServerSideProps<ManageUsersPageProps> = async ({ req }) => {
  const headers = new Headers();
  if (req.headers.cookie) headers.append('cookie', req.headers.cookie);

  const resAdmin = await fetch(urlApi + '/admin/list?page=1&content_per_page=10&role=0', {
    headers: headers,
  });

  const resSeller = await fetch(urlApi + '/admin/list?page=1&content_per_page=10&role=1', {
    headers: headers,
  });

  const dataAdmin = await resAdmin.json();
  const dataSeller = await resSeller.json();

  if (!resAdmin.ok || !resSeller.ok)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };

  return {
    props: {
      admin: dataAdmin.data,
      seller: dataSeller.data,
    },
  };
};

const ManageUsersPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  admin,
  seller,
}) => {
  const { user } = useUser({ redirectTo: '/login' });
  const Router = useRouter();
  const queryClient = useQueryClient();

  if (user?.role === 1) Router.replace('/penginapan');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchCache, setSearchCache] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [userToDelete, setUserToDelete] = useState<User>();

  const { data: admins } = useQuery(
    ['admins', currentPage, search],
    () => {
      const queryParams = [];
      if (search) queryParams.push(`search=${search}`);
      if (queryParams.length > 0) queryParams[0] = `&${queryParams[0]}`;

      return fetch(
        urlApi +
          `/admin/list?page=${currentPage}&content_per_page=10&role=0${queryParams.join('&')}`,
        {
          credentials: 'include',
        }
      )
        .then((res) => res.json())
        .then((data) => data.data);
    },
    {
      initialData: admin,
    }
  );

  const { data: sellers, isPreviousData } = useQuery(
    ['sellers', currentPage, search],
    () => {
      const queryParams = [];
      if (search) queryParams.push(`search=${search}`);
      if (queryParams.length > 0) queryParams[0] = `&${queryParams[0]}`;

      return fetch(
        urlApi +
          `/admin/list?page=${currentPage}&content_per_page=10&role=1${queryParams.join('&')}`,
        {
          credentials: 'include',
        }
      )
        .then((res) => res.json())
        .then((data) => data.data);
    },
    {
      initialData: seller,
      keepPreviousData: true,
    }
  );

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchCache);
    setCurrentPage(1);
  };

  const handleDelete = useMutation(
    (username: string) => {
      return fetch(urlApi + `/admin/delete?username=${username}`, {
        method: 'POST',
        credentials: 'include',
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: 'sellers' });
        setUserToDelete(undefined);
      },
    }
  );

  return (
    <>
      {userToDelete && (
        <Dialog
          submitText="Hapus"
          highlightCancelButton
          headerColor="red"
          heading="Hapus Seller"
          message={`Anda yakin ingin menghapus ${userToDelete?.name ?? ''}`}
          onCancel={() => setUserToDelete(undefined)}
          isLoading={handleDelete.isLoading}
          onSubmit={() => handleDelete.mutate(userToDelete.username)}
        />
      )}
      <div className="grid grid-cols-page h-screen">
        <Sidebar />
        <div className="overflow-y-auto pb-10">
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
            Kelola User
          </h5>
          <div className="px-12 mt-6">
            <div className="pb-20 border-b border-purple-light">
              <h5 className="text-h5 font-bold text-black mb-8">Super Admin</h5>
              <div className="grid grid-cols-2 gap-6">
                {admins?.data?.map(
                  ({ id, name, profile_picture, address, phone_number_whatsapp }) => {
                    let img = profile_picture;
                    if (!profile_picture) img = ImgNoAvatar;
                    if (!address) address = '-';
                    if (!phone_number_whatsapp) phone_number_whatsapp = '-';

                    return (
                      <UserAccount
                        address={address}
                        phoneNumber={phone_number_whatsapp}
                        isAdmin
                        key={id}
                        name={name}
                        src={img}
                      />
                    );
                  }
                )}
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center">
                <h5 className="text-h5 font-bold text-black mr-6">Seller</h5>
                <Button href="/manage-users/create">+ Tambah Seller</Button>
              </div>
              <div className="flex items-center justify-between mt-10 mb-6">
                <Pagination
                  currentPage={currentPage}
                  onChange={(cp) => setCurrentPage(cp)}
                  maxPage={sellers?.max_page}
                />
                <form onSubmit={handleSubmitSearch}>
                  <Textfield
                    value={searchCache}
                    onChange={(e) => setSearchCache(e.target.value)}
                    variant="search-right"
                  />
                </form>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {isPreviousData && [0, 1, 2, 3].map((val) => <Skeleton key={val} height={200} />)}
                {!isPreviousData &&
                  sellers?.data?.map((seller) => {
                    // eslint-disable-next-line prefer-const
                    let { id, name, profile_picture, address, phone_number_whatsapp } = seller;
                    let img = profile_picture;
                    if (!profile_picture) img = ImgNoAvatar;
                    if (!address) address = '-';
                    if (!phone_number_whatsapp) phone_number_whatsapp = '-';

                    return (
                      <UserAccount
                        onDelete={() => setUserToDelete(seller)}
                        key={id}
                        name={name}
                        src={img}
                        onEdit={() => Router.push(`/manage-users/edit?id=${id}`)}
                        address={address}
                        phoneNumber={phone_number_whatsapp}
                      />
                    );
                  })}
                {!sellers?.data && !isPreviousData && (
                  <div className="text-body text-center col-span-2 italic">Tidak ada seller</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageUsersPage;
