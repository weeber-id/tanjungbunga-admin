import classNames from 'classnames';
import { useState } from 'react';
import { IconArrowLeft, IconArrowRight } from '../../../assets';
import styles from './pagination.module.css';

interface PaginationProps {
  maxPage?: number;
  isDisabled?: boolean;
  onChange?: (currentPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ maxPage = 10, isDisabled, onChange }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  let element: any[] = [];

  const handleChangePage = (page: number) => {
    if (!isDisabled) setCurrentPage(page);
    if (onChange && !isDisabled) onChange(page);
  };

  if (maxPage >= 4 && currentPage <= maxPage - 4) {
    const el = [];
    let count = 0;
    while (count < 3) {
      const page = count + 1;
      el.push(
        <button
          onClick={() => handleChangePage(page)}
          className={classNames('mr-5 focus:outline-none hover:text-red', {
            'text-purple-light underline font-semibold': currentPage === count + 1,
          })}
        >
          {count + 1}
        </button>
      );
      count++;
    }
    el.push(<div className="mr-5">...</div>);
    el.push(
      <button
        onClick={() => handleChangePage(maxPage)}
        className={classNames('mr-5 focus:outline-none hover:text-red', {
          'text-purple-light underline font-semibold': currentPage === maxPage,
        })}
      >
        {maxPage}
      </button>
    );
    element = el;
  }

  if (maxPage > 4 && currentPage + 4 > maxPage) {
    const el = [];
    let count = maxPage - 5;
    while (count < maxPage) {
      const page = count + 1;
      el.push(
        <button
          onClick={() => handleChangePage(page)}
          className={classNames('mr-5 focus:outline-none hover:text-red', {
            'text-purple-light underline font-semibold': currentPage === count + 1,
          })}
        >
          {count + 1}
        </button>
      );
      count++;
    }
    element = el;
  }

  if (maxPage >= 4 && currentPage <= maxPage - 4 && currentPage >= 4) {
    const el = [];
    let count = currentPage;
    while (count > currentPage - 3) {
      const page = count;
      el.unshift(
        <button
          onClick={() => handleChangePage(page)}
          className={classNames('mr-5 focus:outline-none hover:text-red', {
            'text-purple-light underline font-semibold': currentPage === count,
          })}
        >
          {count}
        </button>
      );
      count--;
    }
    el.push(<div className="mr-5">...</div>);
    el.push(
      <button
        onClick={() => handleChangePage(maxPage)}
        className={classNames('mr-5 focus:outline-none hover:text-red', {
          'text-purple-light underline font-semibold': currentPage === maxPage,
        })}
      >
        {maxPage}
      </button>
    );
    element = el;
  }

  if (maxPage <= 4) {
    const el = [];
    let count = 0;

    while (count < maxPage) {
      const page = count + 1;
      el.push(
        <button
          onClick={() => handleChangePage(page)}
          className={classNames('mr-5 focus:outline-none hover:text-red', {
            'text-purple-light underline font-semibold': currentPage === count + 1,
          })}
        >
          {count + 1}
        </button>
      );
      count++;
    }

    element = el;
  }

  return (
    <div className="flex items-center">
      <button
        disabled={currentPage === 1}
        onClick={() => handleChangePage(currentPage - 1)}
        className={classNames(
          'h-8 w-8 flex items-center justify-center rounded-full focus:outline-none mr-5',
          {
            'bg-blue': currentPage === 1,
            'bg-purple-light hover:bg-red': currentPage > 1,
          }
        )}
      >
        <IconArrowLeft
          className={classNames('mr-0.5', { [styles['ic-active']]: currentPage > 1 })}
        />
      </button>
      {element.map((val, i) => (
        <div className="select-none" key={`pagination-${i}`}>
          {val}
        </div>
      ))}
      <button
        disabled={currentPage === maxPage}
        onClick={() => handleChangePage(currentPage + 1)}
        className={classNames(
          'h-8 w-8 flex items-center justify-center rounded-full focus:outline-none',
          {
            'bg-blue-light': currentPage === maxPage,
            'bg-purple-light hover:bg-red': currentPage < maxPage,
          }
        )}
      >
        <IconArrowRight
          fill="red"
          className={classNames('ml-0.5', { [styles['ic-disable']]: currentPage === maxPage })}
        />
      </button>
    </div>
  );
};

export default Pagination;
