"use client";

import React, { useState, useEffect } from "react";

export function TypedHighlight({ text }: { text: string }) {
    const [displayText, setDisplayText] = useState("");
    const [showCaret, setShowCaret] = useState(true);

    useEffect(() => {
        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            setDisplayText(text);
            setShowCaret(false);
            return;
        }

        let currentIndex = 0;
        const typingSpeed = 50; // Average of 40-60ms as requested

        const type = () => {
            if (currentIndex <= text.length) {
                setDisplayText(text.substring(0, currentIndex));
                currentIndex++;
                setTimeout(type, typingSpeed + (Math.random() * 20 - 10)); // Add slight variance
            } else {
                // Typing complete, hide caret after a short delay (3 blinks)
                setTimeout(() => setShowCaret(false), 2400);
            }
        };

        const timeout = setTimeout(type, 100); // Very small initial delay
        return () => clearTimeout(timeout);
    }, [text]);

    return (
        <span className="relative inline-block whitespace-nowrap">
            {/* Invisible phantom text to reserve space and prevent layout shift */}
            <span className="invisible select-none" aria-hidden="true">
                {text}
            </span>

            {/* The actual typed text overlay */}
            <span className="absolute left-0 top-0 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                {displayText}
                {showCaret && (
                    <span className="inline-block ml-0.5 text-primary-500 animate-caret select-none" aria-hidden="true">
                        |
                    </span>
                )}
            </span>
        </span>
    );
}
