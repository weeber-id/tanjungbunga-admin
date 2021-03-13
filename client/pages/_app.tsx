import { AppProps } from 'next/app';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-input-range/lib/css/index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
