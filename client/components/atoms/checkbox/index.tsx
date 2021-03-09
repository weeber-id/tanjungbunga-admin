import classNames from 'classnames';
import styles from './checkbox.module.css';

interface CheckboxProps {
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  name?: string;
  value?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ className, onChange, checked, name, value }) => {
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

export default Checkbox;
