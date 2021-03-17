import Link from 'next/link';
import { IconNotFound } from '../assets';
import { Button } from '../components';

const NotFoundPage = () => {
  return (
    <div className="h-screen flex-col flex justify-center items-center">
      <IconNotFound className="mb-8" />
      <h3 className="text-h3 text-center font-medium text-purple-light mb-7">
        Opps Terjadi Kesalahan
      </h3>
      <Link href="/">
        <a>
          <Button variant="outlined" color="red">
            Kembali ke Halaman Utama
          </Button>
        </a>
      </Link>
    </div>
  );
};

export default NotFoundPage;
