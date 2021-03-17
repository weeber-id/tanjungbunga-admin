import classNames from 'classnames';
import styles from './switch.module.css';

interface SwitchProps {
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  name?: string;
  value?: string;
  defaultChecked?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  className,
  onChange,
  checked,
  name,
  value,
  defaultChecked,
}) => {
  return (
    <label className={classNames(styles.switch, className)}>
      <input
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={styles.input}
        type="checkbox"
        defaultChecked={defaultChecked}
      />
      <span className={classNames(styles.slider, styles.round)}></span>
    </label>
  );
};

export default Switch;
