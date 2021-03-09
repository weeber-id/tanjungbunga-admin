import Link from 'next/link';
import classNames from 'classnames';
import { IconTanjungBunga } from 'assets';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const { asPath } = useRouter();

  return (
    <div className="flex flex-col h-full bg-blue-light">
      <div className="px-5">
        <div className="flex py-6 justify-center border-b border-purple">
          <IconTanjungBunga height={52} />
        </div>
      </div>
      <div className="px-5">
        <div className="py-6 px-2 text-body border-b border-purple">
          <p className="text-purple-light mb-11">
            Hello <span className="font-bold">Dodo</span>, What do u want today?
          </p>
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
      <div className="px-5">
        <div className="py-6 px-2 text-body flex flex-col">
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
      <button className="h-20 w-full text-white mt-auto bg-purple-light flex justify-center items-center focus:outline-none">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
