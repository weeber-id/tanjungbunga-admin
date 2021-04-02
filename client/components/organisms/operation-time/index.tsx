import { KeyboardTimePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { IconClose } from 'assets';
import { Button, Switch } from 'components/atoms';
import dayjs from 'dayjs';
import { useMedia } from 'hooks';
import { useState } from 'react';
import { OperationTimeState } from 'utils/types';

type Day = {
  displayName: string;
  name: keyof OperationTimeState;
};

const days: Day[] = [
  {
    displayName: 'Senin',
    name: 'monday',
  },
  {
    displayName: 'Selasa',
    name: 'tuesday',
  },
  {
    displayName: 'Rabu',
    name: 'wednesday',
  },
  {
    displayName: 'Kamis',
    name: 'thursday',
  },
  {
    displayName: 'Jumat',
    name: 'friday',
  },
  {
    displayName: 'Sabtu',
    name: 'saturday',
  },
  {
    displayName: 'Minggu',
    name: 'sunday',
  },
];

const initialState = {
  monday: {
    open: false,
    from: '08:00',
    to: '20:00',
  },
  tuesday: {
    open: false,
    from: '08:00',
    to: '20:00',
  },
  wednesday: {
    open: false,
    from: '08:00',
    to: '20:00',
  },
  thursday: {
    open: false,
    from: '08:00',
    to: '20:00',
  },
  friday: {
    open: false,
    from: '08:00',
    to: '20:00',
  },
  saturday: {
    open: false,
    from: '08:00',
    to: '20:00',
  },
  sunday: {
    open: false,
    from: '08:00',
    to: '20:00',
  },
};

interface OperationTimeProps {
  state?: OperationTimeState;
  onSave?: (state: OperationTimeState) => void;
  onCancel?: () => void;
}

const OperationTime: React.FC<OperationTimeProps> = ({
  state = initialState,
  onCancel,
  onSave,
}) => {
  const [operationTimeState, setOperationTimeState] = useState<OperationTimeState>({ ...state });

  const isMobile = useMedia({ query: '(max-width: 640px)' });

  const handleChangeDate = (
    date: MaterialUiPickersDate,
    name: keyof OperationTimeState,
    time: 'from' | 'to'
  ) => {
    const hour = date?.format('HH:mm');
    const newObj = {
      ...operationTimeState,
      [name]: {
        ...operationTimeState[name],
        [time]: hour,
      },
    };

    setOperationTimeState(newObj);
  };

  const handleChangeOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    const name = e.target.name as keyof OperationTimeState;

    const newObj = {
      ...operationTimeState,
      [name]: {
        ...operationTimeState[name],
        open: checked,
      },
    };

    setOperationTimeState(newObj);
  };

  const handleSave = () => {
    if (onSave) onSave(operationTimeState);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-y-auto bg-black bg-opacity-20 flex justify-center items-start sm:items-center py-10 z-50">
      <div className="bg-white px-6 py-8 w-full max-w-xl relative">
        <button
          onClick={onCancel}
          className="absolute right-7 top-7 flex justify-center items-center h-8 w-8 rounded-full bg-blue-light"
        >
          <IconClose />
        </button>
        <div className="text-body text-black pb-6 border-b border-black mb-6">Atur jam buka</div>
        {days.map(({ name, displayName }) => {
          const from = operationTimeState[name].from.split(':');
          const to = operationTimeState[name].to.split(':');

          const fromTime = dayjs().set('hour', Number(from[0])).set('minute', Number(from[1]));
          const toTime = dayjs().set('hour', Number(to[0])).set('minute', Number(to[1]));

          if (isMobile)
            return (
              <div key={name} className="flex flex-col text-body-sm text-black mb-4 last:mb-0">
                <span className="font-medium mb-3">
                  {displayName} - {operationTimeState[name].open ? 'Buka' : 'Tutup'}
                </span>
                <div className="flex items-center">
                  <div className="w-[60px] mr-3">
                    <Switch
                      size={isMobile ? 'sm' : 'md'}
                      onChange={handleChangeOpen}
                      name={name}
                      checked={operationTimeState[name].open}
                    />
                  </div>
                  {operationTimeState[name].open && (
                    <>
                      <KeyboardTimePicker
                        ampm={false}
                        placeholder="08:00"
                        value={fromTime}
                        onChange={(date) => handleChangeDate(date, name, 'from')}
                      />
                      <div className="relative w-8 mx-3">
                        <div className="absolute w-full h-0.5 bg-black"></div>
                      </div>
                      <KeyboardTimePicker
                        ampm={false}
                        placeholder="20:00"
                        value={toTime}
                        onChange={(date) => handleChangeDate(date, name, 'to')}
                      />
                    </>
                  )}
                </div>
              </div>
            );

          return (
            <div
              key={name}
              className="grid gap-x-4 grid-cols-operation-time items-center text-body-sm text-black mb-4 last:mb-0"
            >
              <span className="font-medium">{displayName}</span>
              <Switch
                size={isMobile ? 'sm' : 'md'}
                onChange={handleChangeOpen}
                name={name}
                checked={operationTimeState[name].open}
              />
              <span className="font-medium">
                {operationTimeState[name].open ? 'Buka' : 'Tutup'}
              </span>
              {operationTimeState[name].open && (
                <>
                  <KeyboardTimePicker
                    ampm={false}
                    placeholder="08:00"
                    value={fromTime}
                    onChange={(date) => handleChangeDate(date, name, 'from')}
                  />
                  <div className="relative">
                    <div className="absolute w-full h-0.5 bg-black"></div>
                  </div>
                  <KeyboardTimePicker
                    ampm={false}
                    placeholder="20:00"
                    value={toTime}
                    onChange={(date) => handleChangeDate(date, name, 'to')}
                  />
                </>
              )}
            </div>
          );
        })}
        <div className="flex justify-center mt-6">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default OperationTime;
