import Head from 'next/head';
import { Sidebar } from 'components';

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid h-screen grid-cols-page">
        <Sidebar />
      </div>
    </>
  );
}
