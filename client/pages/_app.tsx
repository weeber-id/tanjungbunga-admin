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

const queryClient = new QueryClient();
dayjs.extend(relativePlugins);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MuiPickersUtilsProvider utils={DayjsUtils}>
          <Component {...pageProps} />
        </MuiPickersUtilsProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
