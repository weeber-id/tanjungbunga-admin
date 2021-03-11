import classNames from 'classnames';
import styles from './radio.module.css';

interface RadioProps {
  className?: string;
  labelText?: string;
  checked?: boolean;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Radio: React.FC<RadioProps> = ({ className, labelText, checked, name, value, onChange }) => {
  return (
    <label className={classNames(styles.container, className)}>
      {labelText}
      <input onChange={onChange} checked={checked} name={name} value={value} type="radio" />
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default Radio;
