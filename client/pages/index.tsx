import { CardDashboard, Sidebar, SidebarMobile } from 'components';
import { useMedia, useUser } from 'hooks';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { urlApi } from 'utils';
import { DashboardInfo } from 'utils/types';

interface DashboardPageProps {
  data?: DashboardInfo;
}

export const getServerSideProps: GetServerSideProps<DashboardPageProps> = async ({ req }) => {
  const headers = new Headers();
  if (req.headers.cookie) headers.append('cookie', req.headers.cookie);

  const res = await fetch(urlApi + '/admin/analytics/content-count', {
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

const Home: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data }) => {
  const { user } = useUser({ redirectTo: '/login' });

  const isMobile = useMedia({ query: '(max-width: 640px)' });

  return (
    <>
      <div className="sm:grid h-screen grid-cols-page">
        {isMobile ? <SidebarMobile /> : <Sidebar />}
        <div className="overflow-y-auto pb-10 sm:min-w-[900px]">
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
            Dasboard
          </h5>
          <div className="sm:px-12 px-6 mt-6">
            {user?.role === 0 && (
              <div className="grid grid-cols-4 mb-20 gap-x-6 mt-10">
                <CardDashboard title="Artikel" value={data?.article?.count} />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-6 gap-y-4">
              {user?.role === 0 && <CardDashboard title="Wisata" value={data?.travel?.count} />}
              <CardDashboard title="Penginapan" value={data?.lodging.count} />
              <CardDashboard title="Kuliner" value={data?.culinary.count} />
              <CardDashboard title="Produk Belanja" value={data?.handcraft.count} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
