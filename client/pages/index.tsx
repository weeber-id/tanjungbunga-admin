import { Sidebar } from 'components';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid h-screen grid-cols-page">
        <Sidebar />
        <div className="overflow-y-auto pb-10">
          <div className="bg-[#eee] h-[700px]">
            <h1 className="text-h1">Artikel</h1>
          </div>
        </div>
      </div>
    </>
  );
}
