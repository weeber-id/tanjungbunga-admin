import { IconWhatsapp } from 'assets';
import { Button, SidebarLogin } from 'components';
import { useMedia } from 'hooks';

const RegisterPage = () => {
  const isMobile = useMedia({ query: '(max-width: 640px)' });

  return (
    <div className="sm:grid grid-cols-page h-screen">
      {!isMobile && <SidebarLogin />}
      <div className="flex flex-col h-full">
        <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
          Daftar
        </h5>
        <div className="flex flex-col items-center justify-center flex-auto px-6">
          <IconWhatsapp className="mb-8" />
          <h5 className="text-h5 font-bold text-center mb-10 max-w-[600px]">
            Halo! Selamat Datang pengguna baru. Silahkan klik button di bawah ini untuk memulai
            pendaftaran.
          </h5>
          <Button className="mb-2.5">WA (0626 - 01020304)</Button>
          <div className="text-body text-grey">Hubungan Masyarakat (Humas)</div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
