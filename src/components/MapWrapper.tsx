import {useEffect, useRef} from 'react';
import {initMap} from '@/assets/map-project.js';

export default function MapWrapper() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const map = initMap({target: ref.current});
        return () => map.setTarget(null);
    }, []);

    return <div ref={ref} style={{width: '100%', height: '100vh'}}/>;
}