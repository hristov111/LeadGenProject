"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface MobileMenuProps {
    dict: any;
    lang: string;
}

export function MobileMenu({ dict, lang }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-600 focus:outline-none"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-lg p-4 flex flex-col gap-4 z-50 animate-in slide-in-from-top-2">
                    <Link
                        href={`/${lang}/internet`}
                        className="text-lg font-medium text-slate-800 py-2 border-b border-slate-50"
                        onClick={() => setIsOpen(false)}
                    >
                        {dict.navigation.internet}
                    </Link>
                    <Link
                        href={`/${lang}#how-it-works`}
                        className="text-lg font-medium text-slate-800 py-2 border-b border-slate-50"
                        onClick={() => setIsOpen(false)}
                    >
                        {dict.navigation.howItWorks}
                    </Link>
                    <Link
                        href={`/${lang}#faq`}
                        className="text-lg font-medium text-slate-800 py-2 border-b border-slate-50"
                        onClick={() => setIsOpen(false)}
                    >
                        {dict.navigation.faq}
                    </Link>
                </div>
            )}
        </div>
    );
}
