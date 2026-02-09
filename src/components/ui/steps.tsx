import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface StepsProps {
    steps: { id: number; label: string }[]
    currentStep: number
}

export function Steps({ steps, currentStep }: StepsProps) {
    return (
        <div className="w-full pb-12">
            <div className="relative flex justify-between">
                {/* Connecting line */}
                <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-slate-100 z-0" />
                <div
                    className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-primary-600 transition-all duration-500 z-0"
                    style={{
                        width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                    }}
                />

                {steps.map((step) => {
                    const isCompleted = currentStep > step.id
                    const isCurrent = currentStep === step.id

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <div
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                                    isCompleted
                                        ? "border-primary-600 bg-primary-600 text-white"
                                        : isCurrent
                                            ? "border-primary-600 bg-white text-primary-600 ring-4 ring-primary-50"
                                            : "border-slate-300 bg-white text-slate-300"
                                )}
                            >
                                {isCompleted ? <Check className="h-4 w-4" /> : <span>{step.id}</span>}
                            </div>
                            <span
                                className={cn(
                                    "absolute -bottom-8 text-xs font-medium whitespace-nowrap transition-colors duration-300",
                                    isCurrent ? "text-primary-700" : "text-slate-400"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
