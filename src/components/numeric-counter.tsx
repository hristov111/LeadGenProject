"use client";

import { useEffect, useState, useRef } from "react";

export function NumericCounter({
    target,
    duration = 1000,
    suffix = "",
    prefix = ""
}: {
    target: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
}) {
    const [count, setCount] = useState(0);
    const countRef = useRef(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !countRef.current) {
                    countRef.current = true;
                    let startTimestamp: number | null = null;
                    const step = (timestamp: number) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                        const easedProgress = progress * (2 - progress);
                        setCount(Math.floor(easedProgress * target));
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        }
                    };
                    window.requestAnimationFrame(step);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [target, duration]);

    return (
        <div ref={elementRef}>
            {prefix}{count.toLocaleString()}{suffix}
        </div>
    );
}
