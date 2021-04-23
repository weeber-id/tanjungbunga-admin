import { IconTanjungBunga } from 'assets';
import classNames from 'classnames';

const SidebarLogin = () => {
  return (
    <>
      <div className="flex flex-col h-full bg-blue-light">
        <div className="px-5">
          <div className="flex flex-col py-6 justify-center border-b border-purple">
            <IconTanjungBunga height={52} />
          </div>
        </div>

        <div className="px-5 h-full">
          <div className="py-6 h-full px-2 text-body">
            <div className="flex flex-col h-full justify-center items-center">
              <a
                href="https://drive.google.com/file/d/1VKMe0mcOYfWYwG6in3hcT7kQNa_uG_bR/view"
                target="_blank"
                rel="noreferrer noopener"
                className={classNames('hover:text-red mb-5 font-bold', 'text-purple-light ')}
              >
                Panduan
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarLogin;
