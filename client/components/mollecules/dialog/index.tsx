import { Button } from 'components/atoms';

interface DialogProps {
  heading?: string;
  message?: string;
  singleButton?: boolean;
  submitText?: string;
  cancelText?: string;
  headerColor?: 'red' | 'purple';
  highlightCancelButton?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  singleButton,
  heading,
  message,
  submitText = 'Oke',
  cancelText = 'Batal',
  headerColor = 'purple',
  highlightCancelButton = false,
  onCancel,
  onSubmit,
  isLoading,
}) => {
  return (
    <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-20 z-50 flex justify-center items-center p-10">
      <div className="bg-white w-full max-w-xs">
        <div
          className={`border-b border-${headerColor} text-${headerColor} text-center text-body p-5`}
        >
          {heading}
        </div>
        <div className="py-4 px-8 flex flex-col">
          <div className="mb-8 flex justify-center text-body text-black">{message}</div>
          <div className="flex items-center justify-center">
            {!singleButton && (
              <Button
                variant={highlightCancelButton ? 'default' : 'outlined'}
                color={highlightCancelButton ? 'default' : 'red'}
                className="mr-3 last:mr-0"
                onClick={() => {
                  if (!isLoading && onCancel) onCancel();
                }}
              >
                {cancelText}
              </Button>
            )}
            <Button
              variant={!highlightCancelButton ? 'default' : 'outlined'}
              color={!highlightCancelButton ? 'default' : 'red'}
              onClick={onSubmit}
              isLoading={isLoading}
            >
              {submitText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
