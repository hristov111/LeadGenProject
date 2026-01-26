"use client";

import { useEffect, useRef, useState } from "react";
import { Zap, ShieldCheck, CheckCircle2 } from "lucide-react";

interface StepTimelineProps {
    dict: any;
}

export function StepTimeline({ dict }: StepTimelineProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate progress based on position in viewport
            // Start when top of section enters bottom of viewport
            // End when bottom of section reaches top of viewport
            const start = viewportHeight;
            const end = -rect.height;
            const current = rect.top;

            let p = (start - current) / (start - end);
            p = Math.max(0, Math.min(1, p)); // Clamp 0-1

            // Map progress specifically to the drawing phase (centered in view)
            // Adjust these values to fine-tune when the line starts/ends drawing
            const drawStart = 0.2;
            const drawEnd = 0.8;
            let drawP = (p - drawStart) / (drawEnd - drawStart);
            drawP = Math.max(0, Math.min(1, drawP));

            setProgress(drawP);

            if (drawP >= 0.95 && !completed) {
                setCompleted(true);
            }
        };

        const onScroll = () => window.requestAnimationFrame(handleScroll);
        window.addEventListener("scroll", onScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener("scroll", onScroll);
    }, [completed]);

    const steps = [
        { icon: Zap, ...dict.howItWorks.step1 },
        { icon: ShieldCheck, ...dict.howItWorks.step2 },
        { icon: CheckCircle2, ...dict.howItWorks.step3 },
    ];

    return (
        <div ref={sectionRef} className="timeline-container" style={{ "--timeline-progress": progress } as React.CSSProperties}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative pt-8 md:pt-0">
                {/* Progress Line for Desktop */}
                <div className="hidden md:block timeline-line-bg">
                    <div className="timeline-line-fill">
                        {completed && <div className="shine-sweep" />}
                    </div>
                </div>

                {steps.map((step, i) => {
                    const stepProgress = (i) / (steps.length - 1);
                    const isActive = progress >= stepProgress - 0.1 || (i === 0 && progress >= 0);
                    const isFullyActive = (i === 0 && progress < 0.4) ||
                        (i === 1 && progress >= 0.4 && progress < 0.7) ||
                        (i === 2 && progress >= 0.7);

                    return (
                        <div key={i} className="relative z-10 flex flex-col items-center text-center">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 shadow-sm mb-6 text-lg font-bold step-circle 
                                    ${isActive ? 'active border-primary-600 text-white' : 'border-primary-100 text-primary-600'}
                                `}
                            >
                                {i === 2 && completed ? <CheckCircle2 className="h-6 w-6" /> : (i + 1)}
                            </div>
                            <div className={`step-content ${isFullyActive ? 'is-visible active' : ''}`}>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-slate-500 max-w-xs mx-auto">{step.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
