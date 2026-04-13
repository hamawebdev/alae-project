"use client";

import { IdeaEvaluationMetric, ValidatorState } from "./types";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface EvaluationPanelProps {
    state: ValidatorState;
    onReset: () => void;
}

interface MetricsGridProps {
    metrics: IdeaEvaluationMetric[];
    className: string;
}

function MetricsGrid({ metrics, className }: MetricsGridProps) {
    if (metrics.length === 0) return null;

    return (
        <div className={className}>
            {metrics.map(metric => (
                <div key={metric.id} className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-3 gap-4">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{metric.label}</span>
                        <span
                            className={cn(
                                "font-bold text-lg",
                                metric.percentage > 70 ? "text-green-600" : metric.percentage > 40 ? "text-amber-500" : "text-red-500"
                            )}
                        >
                            {metric.percentage}%
                        </span>
                    </div>

                    <div className="w-full bg-gray-100 dark:bg-zinc-900 rounded-full h-1.5 mb-4">
                        <div
                            className={cn(
                                "h-1.5 rounded-full bg-blue-500",
                                metric.percentage > 70 ? "bg-green-500" : metric.percentage > 40 ? "bg-amber-500" : "bg-red-500"
                            )}
                            style={{ width: `${metric.percentage}%` }}
                        />
                    </div>

                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">{metric.explanation}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{metric.reasoning}</p>
                </div>
            ))}
        </div>
    );
}

export function EvaluationPanel({ state, onReset }: EvaluationPanelProps) {
    if (!state.evaluation) return null;

    const score = state.evaluation.overallScore;
    const competitorMetrics = state.evaluation.competitorMetrics ?? [];

    return (
        <div className="w-full flex flex-col space-y-8 animate-in slide-in-from-bottom flex-fade-in duration-500">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-gray-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-sm relative">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle
                            cx="60"
                            cy="60"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className={cn(
                                "transition-all duration-1000 ease-out",
                                score > 80 ? "text-green-500" : score > 60 ? "text-amber-500" : "text-red-500"
                            )}
                            strokeDasharray={`${(score / 100) * 351} 351`}
                        />
                    </svg>
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">{score}</span>
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Idea Validation Complete</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2">
                        Based on the PRD, market data, and competitor signals, here is how well this idea is positioned for an MVP launch.
                    </p>
                </div>
            </div>

            <MetricsGrid metrics={state.evaluation.metrics} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4" />

            {competitorMetrics.length > 0 && (
                <section className="space-y-4">
                    <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Competitor Success Metrics</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            A closer read on how this concept stands apart in a crowded market and how hard it will be to win users away from current tools.
                        </p>
                    </div>

                    <MetricsGrid metrics={competitorMetrics} className="grid grid-cols-1 md:grid-cols-2 gap-6" />
                </section>
            )}

            <div className="flex justify-center pt-8 border-t border-gray-100 dark:border-zinc-800">
                <Button
                    onClick={onReset}
                    variant="outline"
                    className="gap-2"
                >
                    <RotateCcw className="h-4 w-4" /> Start Over with New Idea
                </Button>
            </div>
        </div>
    );
}
