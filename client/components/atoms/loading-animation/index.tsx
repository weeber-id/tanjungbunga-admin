import classNames from 'classnames';
import styles from './loading-animation.module.css';

interface LoadingAnimationProps {
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ className }) => {
  return (
    <div className={classNames(styles['lds-ring'], className)}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingAnimation;
