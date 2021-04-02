import { IconTanjungBunga } from 'assets';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SidebarLogin = () => {
  const { asPath } = useRouter();

  return (
    <>
      <div className="flex flex-col h-full bg-blue-light">
        <div className="px-5">
          <div className="flex flex-col py-6 justify-center border-b border-purple">
            <IconTanjungBunga height={52} />
          </div>
        </div>

        <div className="px-5 h-full">
          <div className="py-6 h-full px-2 text-body">
            <div className="flex flex-col h-full justify-center items-center">
              <Link href="/register">
                <a
                  className={classNames(
                    'hover:text-red mb-5 font-bold',
                    asPath === '/register' ? 'text-red' : 'text-purple-light '
                  )}
                >
                  Panduan
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarLogin;
