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
      <h4 className="text-h4 mb-7">{title}</h4>
      <h1 className="text-h1">{value}</h1>
    </div>
  );
};

export default CardDashboard;
