import { AppProps } from 'next/app';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-input-range/lib/css/index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
// (async () => {
//   if (process.env.NODE_ENV === 'development') {
//     await require('../styles/build.css');
//   } else {
//     await require('../styles/globals.css');
//   }
// })();

import '../styles/globals.css';
import dayjs from 'dayjs';
import relativePlugins from 'dayjs/plugin/relativeTime';
// import '../styles/build.css';
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
import Head from 'next/head';
//Binding events.
NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const queryClient = new QueryClient();
dayjs.extend(relativePlugins);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Admin Desa Tanjung Bunga</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <MuiPickersUtilsProvider utils={DayjsUtils}>
          <Component {...pageProps} />
        </MuiPickersUtilsProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
