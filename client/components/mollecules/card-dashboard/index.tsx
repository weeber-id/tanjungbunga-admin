import classNames from 'classnames';

interface CardDashboardProps {
  className?: string;
  title?: string;
  value?: string | number;
}

const CardDashboard: React.FC<CardDashboardProps> = ({ className, title, value }) => {
  return (
    <div
      className={classNames(
        'py-6 shadow-lg flex flex-col text-center items-center text-purple-light rounded-[20px] border border-purple-light',
        className
      )}
    >
      <h4 className="sm:text-h4 text-h5 sm:mb-7 mb-4">{title}</h4>
      <h1 className="sm:text-h1 text-h3">{value}</h1>
    </div>
  );
};

export default CardDashboard;
