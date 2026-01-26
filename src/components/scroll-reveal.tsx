"use client";

import { useEffect, useRef } from "react";

export function ScrollReveal({ children, staggerDelay = 120, threshold = 0.3 }: {
    children: React.ReactNode;
    staggerDelay?: number;
    threshold?: number;
}) {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const children = entry.target.querySelectorAll(".reveal-item");
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add("is-visible");
                            }, index * staggerDelay);
                        });
                        // Once triggered, stop observing
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [staggerDelay, threshold]);

    return (
        <div ref={sectionRef}>
            {children}
        </div>
    );
}
