import {useEffect, useRef} from "react";

export function useInterval(callback: Function, delay: number) {
    const savedCallback = useRef<any>(null);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            if (savedCallback.current !== null) {
                savedCallback?.current();
            }
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}