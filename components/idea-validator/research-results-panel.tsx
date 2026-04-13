"use client";

import { ValidatorState, ValidatorAction } from "./types";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResearchResultsPanelProps {
    state: ValidatorState;
    dispatch: React.Dispatch<ValidatorAction>;
    onContinue: () => void;
}

export function ResearchResultsPanel({ state, onContinue }: ResearchResultsPanelProps) {
    return (
        <div className="w-full flex flex-col space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Market Research Results</h2>
                <p className="text-gray-500 dark:text-gray-400">
                    We found {state.competitors.length} established players in this space. Here are their profiles and key features.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {state.competitors.map((comp) => (
                    <div key={comp.id} className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{comp.name}</h3>
                                <p className="text-sm text-gray-500">{comp.positioning}</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 text-xs font-semibold px-2 py-1 rounded-md">
                                {comp.pricingBadge}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Globe className="h-4 w-4" />
                                <span>Audience: <b>{comp.audience}</b></span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <TrendingUp className="h-4 w-4" />
                                <span>Saturation:
                                    <span className={cn(
                                        "ml-1 font-medium capitalize",
                                        comp.saturationSignal === "high" ? "text-red-500" :
                                            comp.saturationSignal === "medium" ? "text-amber-500" :
                                                "text-green-500"
                                    )}>
                                        {comp.saturationSignal}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Extracted Features</p>
                            <div className="flex flex-wrap gap-2">
                                {comp.features.map(f => (
                                    <span key={f.id} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800/50">
                                        {f.title}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-6">
                <Button
                    onClick={onContinue}
                    className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                    Review All Features
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
