import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Sidebar from '.';

const SidebarMobile = () => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setShow(!show)}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-purple-light shadow-lg flex justify-center items-center text-white"
      >
        X
      </button>
      <AnimatePresence exitBeforeEnter>
        {show && (
          <motion.div
            animate={{ translateX: 0 }}
            initial={{ translateX: -280 }}
            exit={{ translateX: -280 }}
            className="fixed top-0 left-0 z-50 w-[280px] h-full"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarMobile;
