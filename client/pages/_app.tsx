import { AppProps } from 'next/app';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-input-range/lib/css/index.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
