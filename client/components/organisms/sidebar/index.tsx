import Link from 'next/link';
import classNames from 'classnames';
import { IconTanjungBunga } from 'assets';
import { useRouter } from 'next/router';
import { useUser } from 'hooks';
import { Button } from 'components/atoms';
import { urlApi } from 'utils';

const Sidebar = () => {
  const { user, mutateUser } = useUser({
    redirectTo: '/login',
  });
  const { asPath, replace } = useRouter();

  const handleLogout = async () => {
    await fetch(urlApi + '/logout', {
      method: 'POST',
      credentials: 'include',
    });
    const res = await fetch('/api/logout', { method: 'POST' });

    mutateUser(await res.json());

    replace('/login');
  };

  return (
    <div className="flex flex-col h-full bg-blue-light">
      <div className="px-5">
        <div className="flex flex-col py-6 justify-center border-b border-purple">
          <IconTanjungBunga height={52} />
          {user?.role === 0 && (
            <>
              <div className="text-center text-red my-3">Superadmin</div>
              <Button href="/manage-users">Kelola User</Button>
            </>
          )}
          {user?.role === 1 && (
            <Button className="mt-5" href="/akun-saya">
              Akun Saya
            </Button>
          )}
        </div>
      </div>
      {user?.isLoggedIn && (
        <>
          <div className="px-5">
            <div className="py-6 px-2 text-body border-b border-purple">
              <p className="text-purple-light mb-8">
                Hello <span className="font-bold">{user?.name}</span>, What do u want today?
              </p>
              <div className="flex flex-col">
                <Link href="/">
                  <a
                    className={classNames(
                      'hover:text-red mb-5',
                      asPath === '/' ? 'text-red' : 'text-purple-light '
                    )}
                  >
                    Dashboard
                  </a>
                </Link>
                <Link href="/artikel">
                  <a
                    className={classNames(
                      'hover:text-red',
                      asPath === '/artikel' ? 'text-red' : 'text-purple-light '
                    )}
                  >
                    Artikel/Posting
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="px-5">
            <div
              className={classNames('py-6 px-2 text-body flex flex-col', {
                'border-b border-purple': user.role === 0,
              })}
            >
              {user?.role === 0 && (
                <Link href="/wisata">
                  <a
                    className={classNames(
                      'hover:text-red mb-5',
                      asPath === '/wisata' ? 'text-red' : 'text-purple-light '
                    )}
                  >
                    Wisata
                  </a>
                </Link>
              )}
              <Link href="/penginapan">
                <a
                  className={classNames(
                    'hover:text-red mb-5',
                    asPath === '/penginapan' ? 'text-red' : 'text-purple-light '
                  )}
                >
                  Penginapan
                </a>
              </Link>
              <Link href="/komoditas">
                <a
                  className={classNames(
                    'hover:text-red mb-5',
                    asPath === '/komoditas' ? 'text-red' : 'text-purple-light '
                  )}
                >
                  Komoditas
                </a>
              </Link>
              <Link href="/kerajinan">
                <a
                  className={classNames(
                    'hover:text-red',
                    asPath === '/kerajinan' ? 'text-red' : 'text-purple-light '
                  )}
                >
                  Kerajinan/Belanja
                </a>
              </Link>
            </div>
          </div>
          <div className="px-5">
            <div className="py-6 px-2 text-body">
              {user?.role === 0 && (
                <Link href="/about">
                  <a
                    className={classNames(
                      'hover:text-red mb-5',
                      asPath === '/about' ? 'text-red' : 'text-purple-light '
                    )}
                  >
                    Tentang
                  </a>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
      {!user?.isLoggedIn && (
        <div className="px-5 h-full">
          <div className="py-6 h-full px-2 text-body">
            <div className="flex flex-col h-full justify-center items-center">
              <Link href="/panduan">
                <a
                  className={classNames(
                    'hover:text-red mb-5 font-bold',
                    asPath === '/panduan' ? 'text-red' : 'text-purple-light '
                  )}
                >
                  Panduan
                </a>
              </Link>
            </div>
          </div>
        </div>
      )}
      {user?.isLoggedIn && (
        <button
          onClick={handleLogout}
          className="h-20 w-full text-white mt-auto bg-purple-light flex justify-center items-center focus:outline-none"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Sidebar;
