"use client";

import { ValidatorState, ValidatorAction } from "./types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureReviewPanelProps {
    state: ValidatorState;
    dispatch: React.Dispatch<ValidatorAction>;
    onGeneratePRD: () => void;
}

export function FeatureReviewPanel({ state, dispatch, onGeneratePRD }: FeatureReviewPanelProps) {
    const pendingCount = state.features.filter(f => f.status === "pending").length;

    return (
        <div className="w-full flex flex-col space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Review PRD Features</h2>
                <p className="text-gray-500 dark:text-gray-400">
                    We extracted these core capabilities from competitors and your inputs. Approve the ones you want to include in your MVP.
                </p>
            </div>

            <div className="space-y-4">
                {state.features.map((feature) => (
                    <div
                        key={feature.id}
                        className={cn(
                            "flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-zinc-950 border rounded-xl shadow-sm transition-all",
                            feature.status === "pending" ? "border-gray-200 dark:border-zinc-800" :
                                feature.status === "approved" ? "border-green-500 bg-green-50/50 dark:bg-green-900/10" :
                                    "border-red-200 bg-red-50/50 dark:bg-red-900/10 opacity-75"
                        )}
                    >
                        <div className="mb-4 sm:mb-0 max-w-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{feature.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{feature.description}</p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant={feature.status === "rejected" ? "destructive" : "outline"}
                                size="sm"
                                onClick={() => dispatch({ type: "REJECT_FEATURE", payload: feature.id })}
                                className={cn("gap-2", feature.status === "rejected" && "bg-red-100 text-red-700 hover:bg-red-200 border-red-200 dark:bg-red-900/50 dark:text-red-200")}
                            >
                                <XCircle className="h-4 w-4" /> Reject
                            </Button>
                            <Button
                                variant={feature.status === "approved" ? "default" : "outline"}
                                size="sm"
                                onClick={() => dispatch({ type: "APPROVE_FEATURE", payload: feature.id })}
                                className={cn("gap-2", feature.status === "approved" && "bg-green-600 text-white hover:bg-green-700")}
                            >
                                <CheckCircle2 className="h-4 w-4" /> Approve
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-zinc-800 mt-4">
                <Button
                    onClick={onGeneratePRD}
                    disabled={pendingCount > 0}
                    className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                    {pendingCount > 0 ? `${pendingCount} Left to Review` : "Generate PRD"}
                </Button>
            </div>
        </div>
    );
}
