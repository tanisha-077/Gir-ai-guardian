import { useEffect, useRef } from 'react';

/** Auto-scroll a container to the bottom whenever deps change */
export function useAutoScroll(deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
