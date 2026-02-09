import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBannerProps {
    error: string | null;
    onDismiss?: () => void;
    title?: string;
    className?: string;
}

export function ErrorBanner({
    error,
    onDismiss,
    title = "Възникна грешка",
    className
}: ErrorBannerProps) {
    if (!error) return null;

    return (
        <div className={`mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300 ${className || ''}`}>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-red-900">{title}</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            {onDismiss && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-800 hover:bg-red-100 h-8 w-8 p-0 hover:scale-110 transition-transform"
                    onClick={onDismiss}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
