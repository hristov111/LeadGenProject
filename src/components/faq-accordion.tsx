"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQAccordionProps {
    items: Array<{ q: string; a: string }>;
}

export function FAQAccordion({ items }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="overflow-hidden bg-white border border-slate-200 rounded-xl transition-all duration-200 hover:border-primary-200"
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full flex items-center justify-between p-6 text-left group transition-colors hover:bg-slate-50/50"
                        aria-expanded={openIndex === i}
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 text-primary-600 transition-transform duration-200 group-hover:scale-110">
                                <HelpCircle className="h-5 w-5" strokeWidth={1.5} />
                            </div>
                            <span className="font-bold text-slate-900 leading-snug group-hover:text-primary-700">
                                {item.q}
                            </span>
                        </div>
                        <ChevronDown
                            className={`h-5 w-5 text-slate-400 transition-transform duration-300 ease-out flex-shrink-0 
                                ${openIndex === i ? "rotate-180 text-primary-600" : ""}
                            `}
                        />
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-out 
                            ${openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                        `}
                    >
                        <div className="px-6 pb-6 pt-0 ml-9">
                            <p className="text-slate-600 text-[15px] leading-relaxed border-l-2 border-primary-100 pl-4 py-1">
                                {item.a}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
