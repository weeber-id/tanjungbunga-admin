import { DummyOrang } from 'assets';
import { Button, Pagination, Sidebar, Textfield, UserAccount } from 'components';
import { useUser } from 'hooks';
import { useRouter } from 'next/router';
import { useState } from 'react';

const ManageUsersPage = () => {
  const { user } = useUser({ redirectTo: '/login' });
  const Router = useRouter();

  if (user?.role === 1) Router.replace('/penginapan');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchCache, setSearchCache] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchCache);
    // if (isSuccess) setCurrentPage(1);
  };

  return (
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
              <UserAccount name="Dadang Suparman" src={DummyOrang} />
              <UserAccount name="Dadang Suparman" src={DummyOrang} />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center">
              <h5 className="text-h5 font-bold text-black mr-6">Seller</h5>
              <Button>+ Tambah Seller</Button>
            </div>
            <div className="flex items-center justify-between mt-10 mb-6">
              <Pagination
                currentPage={currentPage}
                onChange={(cp) => setCurrentPage(cp)}
                maxPage={1}
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
              <UserAccount name="Dadang Suparman" src={DummyOrang} />
              <UserAccount name="Dadang Suparman" src={DummyOrang} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
