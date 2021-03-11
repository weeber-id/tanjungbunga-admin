import { DummyOrang } from 'assets';
import { Button, Image } from 'components/atoms';

interface UploadPhotoProps {
  onUpload?: () => void;
}

const UploadPhoto: React.FC<UploadPhotoProps> = () => {
  return (
    <div className="z-50 fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-20">
      <div className="bg-white">
        <div className="text-body text-purple-light text-center py-5 border-b border-purple-light">
          Upload Photo
        </div>
        <div className="flex flex-col items-center px-24">
          <div className="w-64">
            <Image
              className="rounded-full my-5"
              aspectRatio="1/1"
              objectFit="cover"
              objectPosition="center"
              src={DummyOrang}
            />
          </div>
          <Button className="mb-4 w-36" variant="outlined">
            Pilih Foto
          </Button>
          <Button className="w-36" color="red">
            Edit Foto
          </Button>
        </div>
        <div className="flex justify-end items-center w-full mt-10 mb-6 pr-4">
          <button className="text-body text-red mr-5 focus:outline-none">Batal</button>
          <Button>Upload</Button>
        </div>
      </div>
    </div>
  );
};

export default UploadPhoto;
