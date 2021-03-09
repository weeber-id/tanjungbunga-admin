import { DummyHotel, IconMeatballsMenu } from 'assets';
import { Button, Pagination, Sidebar, Textfield, Image, Checkbox } from 'components';

const PenginapanPage = () => {
  return (
    <div className="grid h-screen" style={{ gridTemplateColumns: '240px 1fr' }}>
      <Sidebar />
      <div className="overflow-y-auto">
        <h5 className="text-h5 font-bold text-purple-light pt-6 pb-4 px-12 border-b border-purple-light">
          Penginapan
        </h5>
        <div className="px-12 mt-6">
          <Button>+ Tampah Penginapan</Button>
          <div className="flex items-center justify-between mt-10">
            <Pagination maxPage={7} />
            <Textfield variant="search-right" />
          </div>
          <div className="mt-4">
            <div className="grid gap-x-6 grid-cols-table text-body font-medium text-purple border border-purple-light rounded-tl-lg rounded-tr-lg py-2 mb-1">
              <div className="justify-self-center">No.</div>
              <div>Foto</div>
              <div>Nama Penginapan</div>
              <div>Harga Penginapan</div>
              <div>Tampilkan</div>
              <div></div>
            </div>
            <div className="grid gap-x-6 py-2 grid-cols-table items-center text-body text-black border border-purple-light">
              <div className="justify-self-center self-start font-bold">1</div>
              <div>
                <Image src={DummyHotel} aspectRatio="4/3" className="rounded-lg" />
              </div>
              <div>Hotel A</div>
              <div>Rp 120.000 /hari</div>
              <div>
                <Checkbox />
              </div>
              <div>
                <button className="focus:outline-none">
                  <IconMeatballsMenu />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenginapanPage;