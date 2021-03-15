import { AppProps } from 'next/app';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-input-range/lib/css/index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../styles/globals.css';

const queryClient = new QueryClient();

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
