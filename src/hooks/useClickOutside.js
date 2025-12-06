import { useEffect } from "react";

/**
 * Hook that handles clicks outside of the passed ref
 * @param {React.RefObject} ref - The ref to the element
 * @param {Function} handler - The callback to execute when clicking outside
 */
function useClickOutside(ref, handler) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, handler]);
}

export default useClickOutside;
