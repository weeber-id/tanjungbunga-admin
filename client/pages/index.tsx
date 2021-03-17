import { CardDashboard, Sidebar } from 'components';
import { useUser } from 'hooks';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { urlApi } from 'utils';
import { DashboardInfo } from 'utils/types';

interface DashboardPageProps {
  data: DashboardInfo;
}

export const getServerSideProps: GetServerSideProps<DashboardPageProps> = async ({ req }) => {
  const headers = new Headers();
  if (req.headers.cookie) headers.append('cookie', req.headers.cookie);

  const res = await fetch(urlApi + '/admin/analytics/content-count', {
    headers: headers,
  });

  const data = await res.json();

  return {
    props: {
      data: data.data,
    },
  };
};

const Home: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data }) => {
  const { user } = useUser({ redirectTo: '/login' });

  const { article, culinary, handcraft, lodging, travel } = data;

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid h-screen grid-cols-page">
        <Sidebar />
        <div className="overflow-y-auto pb-10 min-w-[900px]">
          <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
            Wisata
          </h5>
          <div className="px-12 mt-6">
            <div className="grid grid-cols-4 mb-20 gap-x-6 mt-10">
              {user?.role === 0 && <CardDashboard title="Artikel" value={article?.count} />}
            </div>
            <div className="grid grid-cols-4 gap-x-6">
              {user?.role === 0 && <CardDashboard title="Wisata" value={travel?.count} />}
              <CardDashboard title="Penginapan" value={lodging.count} />
              <CardDashboard title="Kuliner" value={culinary.count} />
              <CardDashboard title="Produk Belanja" value={handcraft.count} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
