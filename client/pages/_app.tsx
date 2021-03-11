import { AppProps } from 'next/app';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
