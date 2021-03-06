import React, { useState } from 'react';
import classNames from 'classnames';
import InputRange from 'react-input-range';
import { Button, Image as Img } from 'components/atoms';
import Cropper from 'react-easy-crop';
import { Point } from 'react-easy-crop/types';
import { getCroppedImg } from 'utils/get-cropped-image';

interface UploadPhotoProps {
  onUpload?: (blob: Blob) => void;
  onCancel?: () => void;
  aspectRatio?: '4/3' | '16/9' | '1/1' | '3/4';
  shape?: 'rect' | 'round';
  isLoading?: boolean;
  initialPhoto?: string;
}

const UploadPhoto: React.FC<UploadPhotoProps> = ({
  onCancel,
  onUpload,
  aspectRatio = '1/1',
  shape = 'round',
  isLoading,
  initialPhoto = '',
}) => {
  const [isEdit, setEdit] = useState<boolean>(false);
  const [firstTime, setFirstTime] = useState<boolean>(false);
  const [photo, setPhoto] = useState<string>(initialPhoto);
  const [blob, setBlob] = useState<Blob>();
  const [cachedCrop, setCachedCrop] = useState({ x: 0, y: 0 });
  const [cropState, setCropState] = useState({
    image: initialPhoto,
    crop: { x: 0, y: 0 },
    zoom: 1,
  });
  const [cropAreaPixel, setCropAreaPixel] = useState({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  });

  const AR = aspectRatio.split('/');

  const aspect = Number(AR[0]) / Number(AR[1]);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    let file = '';

    if (files && files?.length > 0) file = URL.createObjectURL(files[0]);

    setCropState({
      ...cropState,
      crop: { x: 0, y: 0 },
      image: file,
      zoom: 1,
    });

    setPhoto(file);
    setEdit(true);
    setFirstTime(true);
  };

  const handleCropChange = (location: Point) => {
    setCropState({
      ...cropState,
      crop: location,
    });
  };

  const handleSaveEdit = async () => {
    const image = new Image();
    image.src = photo;

    const blob = await getCroppedImg(image, cropAreaPixel);

    const blobUrlObj = URL.createObjectURL(blob);

    setBlob(blob);
    setPhoto(blobUrlObj);
    setCropState({ ...cropState, image: blobUrlObj, crop: cachedCrop, zoom: 1 });
    setFirstTime(false);
    setEdit(false);
  };

  const handleUpload = () => {
    if (onUpload && blob) onUpload(blob);
  };

  const handleCancelEdit = () => {
    if (firstTime) {
      setPhoto('');
      setCropState({
        ...cropState,
        image: '',
      });
    }

    setEdit(false);
  };

  return (
    <div className="z-50 fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-20 overflow-auto py-10">
      <div style={{ height: 'fit-content' }} className="bg-white  max-w-screen-sm w-full">
        <div
          className={classNames(
            'text-body  text-center py-5 border-b border-purple-light',
            isEdit ? 'text-red' : 'text-purple-light'
          )}
        >
          {!isEdit ? 'Upload Photo' : 'Edit Photo'}
        </div>
        {isEdit ? (
          <>
            <div className="relative h-80">
              <Cropper
                onCropChange={handleCropChange}
                crop={cropState.crop}
                zoom={cropState.zoom}
                image={cropState.image}
                aspect={aspect}
                onCropComplete={(crop, cropAreaPixel) => {
                  setCropAreaPixel(cropAreaPixel);
                  setCachedCrop(crop);
                }}
                cropShape={shape}
              />
            </div>
            <div className="px-6 mt-6">
              <InputRange
                formatLabel={() => ''}
                maxValue={180}
                minValue={100}
                value={cropState.zoom * 100}
                onChange={(value) => setCropState({ ...cropState, zoom: (value as number) / 100 })}
              />
            </div>
            <div className="flex justify-end items-center w-full mt-10 mb-6 pr-4">
              <button
                onClick={handleCancelEdit}
                className="text-body text-red mr-5 focus:outline-none"
              >
                Batal
              </button>
              <Button onClick={handleSaveEdit} variant="outlined">
                Save
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center px-24">
              <div className="w-64">
                <Img
                  className={classNames('my-5 bg-blue-light', {
                    'rounded-full': shape === 'round',
                  })}
                  aspectRatio={aspectRatio}
                  objectFit="cover"
                  objectPosition="top"
                  src={photo}
                />
              </div>
              <label className="relative">
                <span
                  style={{ height: 42 }}
                  className="text-body w-36 border border-purple-light rounded-md flex justify-center items-center mb-3 cursor-pointer"
                >
                  Pilih Foto
                </span>
                <input
                  onChange={handleSelectFile}
                  style={{ zIndex: -1 }}
                  className="top-0 left-0 absolute opacity-0 w-0 h-0"
                  type="file"
                  id="file"
                  aria-label="File browser example"
                  accept="image/*"
                />
              </label>
              {photo && (
                <Button onClick={() => setEdit(true)} className="w-36" color="red">
                  Edit Foto
                </Button>
              )}
            </div>
            <div className="flex justify-end items-center w-full mt-10 mb-6 pr-4">
              {!isLoading && (
                <button onClick={onCancel} className="text-body text-red mr-5 focus:outline-none">
                  Batal
                </button>
              )}
              <Button isLoading={isLoading} onClick={handleUpload}>
                Upload
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadPhoto;
