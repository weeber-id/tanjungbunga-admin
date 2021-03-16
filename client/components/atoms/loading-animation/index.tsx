import classNames from 'classnames';
import styles from './loading-animation.module.css';

interface LoadingAnimationProps {
  className?: string;
  color?: 'red' | 'purple';
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ className, color }) => {
  return (
    <div
      className={classNames(styles['lds-ring'], className, {
        [styles.red]: color === 'red',
        [styles.purple]: color === 'purple',
      })}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingAnimation;
