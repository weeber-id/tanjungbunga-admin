import { useEffect } from 'react';

export function useOutside(ref: any, refTrigger: any, callback: () => void) {
  return useEffect(() => {
    const handleOutside = (e: any) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !refTrigger.current.contains(e.target)
      ) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleOutside);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  });
}
