"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { ValidatorStage, ValidatorMode } from "./types";
import { cn } from "@/lib/utils";

interface SummaryRailProps {
    stage: ValidatorStage;
    mode: ValidatorMode;
}

const steps = [
    { id: "intake", label: "Intake & Context" },
    { id: "research_loading", label: "Market Research", group: ["research_loading", "research_results"] },
    { id: "feature_review", label: "Feature Review" },
    { id: "prd_ready", label: "PRD Generation" },
    { id: "evaluation_ready", label: "Validation Score" },
];

export function SummaryRail({ stage, mode }: SummaryRailProps) {

    const getStepStatus = (stepId: string) => {
        const stageIndex = steps.findIndex(s => s.id === stage || s.group?.includes(stage));
        const thisStepIndex = steps.findIndex(s => s.id === stepId);

        if (thisStepIndex < stageIndex) return "complete";
        if (thisStepIndex === stageIndex) return "current";
        return "pending";
    };

    return (
        <div className="flex flex-col space-y-6 pt-4">
            <div className="space-y-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Flow Progress</h3>
                <p className="text-xs text-gray-500 capitalize">{mode} Mode</p>
            </div>

            <div className="relative">
                <div className="absolute top-0 bottom-0 left-[11px] w-[2px] bg-gray-100 dark:bg-zinc-800 -z-10" />

                <div className="space-y-6">
                    {steps.map((step) => {
                        const status = getStepStatus(step.id);
                        return (
                            <div key={step.id} className="flex items-start gap-4">
                                <div className={cn(
                                    "bg-white dark:bg-zinc-950 mt-0.5",
                                    status === "complete" ? "text-blue-600 dark:text-blue-500" :
                                        status === "current" ? "text-blue-600 dark:text-blue-500" :
                                            "text-gray-300 dark:text-zinc-600"
                                )}>
                                    {status === "complete" ? (
                                        <CheckCircle2 className="h-6 w-6" />
                                    ) : status === "current" ? (
                                        <Circle className="h-6 w-6 fill-current opacity-20" strokeWidth={3} />
                                    ) : (
                                        <Circle className="h-6 w-6" strokeWidth={2} />
                                    )}
                                </div>
                                <div>
                                    <p className={cn(
                                        "text-sm font-medium",
                                        status === "current" ? "text-gray-900 dark:text-gray-100" :
                                            status === "complete" ? "text-gray-700 dark:text-gray-300" :
                                                "text-gray-400 dark:text-zinc-500"
                                    )}>
                                        {step.label}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
