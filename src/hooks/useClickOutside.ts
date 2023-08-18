
// Absolute imports
import { useRef, useEffect } from 'react';

const useOutsideClick = (callback: () => void): React.RefObject<HTMLDivElement> => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [callback]);

    return ref;
};

export default useOutsideClick;