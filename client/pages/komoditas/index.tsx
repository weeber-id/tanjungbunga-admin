import { DummyMasakan } from 'assets';
import { Button, Checkbox, Image, MeetBallMore, Pagination, Sidebar, Textfield } from 'components';

const KomoditasPage = () => {
  return (
    <div className="grid h-screen" style={{ gridTemplateColumns: '240px 1fr' }}>
      <Sidebar />
      <div className="overflow-y-auto">
        <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
          Komoditas
        </h5>
        <div className="px-12 mt-6">
          <Button href="/komoditas/create">+ Tambah Komoditas</Button>
          <div className="flex items-center justify-between mt-10">
            <Pagination maxPage={7} />
            <Textfield variant="search-right" />
          </div>
          <div className="mt-4">
            <div className="grid gap-x-6 grid-cols-table text-body font-medium text-purple border border-purple-light rounded-tl-lg rounded-tr-lg py-2 mb-1">
              <div className="justify-self-center">No.</div>
              <div>Foto</div>
              <div>Nama Komoditas</div>
              <div>Harga Komoditas</div>
              <div>Tampilkan</div>
              <div></div>
            </div>
            <div className="grid gap-x-6 py-2 grid-cols-table items-center text-body text-black border border-purple-light">
              <div className="justify-self-center self-start font-bold">1</div>
              <div>
                <Image src={DummyMasakan} aspectRatio="4/3" className="rounded-lg" />
              </div>
              <div>Komoditas A</div>
              <div>Rp 120.000</div>
              <div>
                <Checkbox />
              </div>
              <div className="relative">
                <MeetBallMore />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KomoditasPage;
