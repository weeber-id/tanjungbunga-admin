import classNames from 'classnames';
import styles from './switch.module.css';

interface SwitchProps {
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  name?: string;
  value?: string;
}

const Switch: React.FC<SwitchProps> = ({ className, onChange, checked, name, value }) => {
  return (
    <label className={classNames(styles.switch, className)}>
      <input
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={styles.input}
        type="checkbox"
      />
      <span className={classNames(styles.slider, styles.round)}></span>
    </label>
  );
};

export default Switch;
