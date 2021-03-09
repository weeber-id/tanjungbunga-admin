import { useEffect, useState } from 'react';

type options = {
  query?: string;
};

export const useMedia = (options: options) => {
  const [isTrue, setTrue] = useState<boolean>(false);
  const { query } = options;

  useEffect(() => {
    // server side rendering doesn't have window object
    if (typeof window !== 'undefined') {
      const matches = window.matchMedia(query);

      const handleMatch = (ev: MediaQueryListEvent) => {
        setTrue(ev.matches);
      };

      // check media query during the componentDidMount cycle
      setTrue(matches.matches);

      matches.addEventListener('change', handleMatch);

      return () => {
        matches.removeEventListener('change', handleMatch);
      };
    }
  }, [query]);

  return isTrue;
};
