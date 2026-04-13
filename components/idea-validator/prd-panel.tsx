"use client";

import { ValidatorState } from "./types";
import { Button } from "@/components/ui/button";
import { FileText, Copy, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PrdPanelProps {
    state: ValidatorState;
    onValidate: () => void;
}

export function PrdPanel({ state, onValidate }: PrdPanelProps) {
    const [activeTab, setActiveTab] = useState(state.prd[0]?.id);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const text = state.prd.map(s => `## ${s.title}\n${s.content}\n`).join("\n");
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full flex flex-col space-y-6">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <FileText className="h-6 w-6 text-blue-600" />
                        Generated Product Requirements Document
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Based on your approved features and core problem definition.
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? "Copied!" : <><Copy className="h-4 w-4 mr-2" /> Copy All</>}
                </Button>
            </div>

            <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[400px]">
                {/* Navigation Sidebar */}
                <div className="w-full md:w-64 bg-gray-50 dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-800 p-4">
                    <ul className="space-y-1">
                        {state.prd.map((section) => (
                            <li key={section.id}>
                                <button
                                    onClick={() => setActiveTab(section.id)}
                                    className={cn(
                                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        activeTab === section.id
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800"
                                    )}
                                >
                                    {section.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 prose dark:prose-invert max-w-none">
                    {state.prd.map((section) => (
                        section.id === activeTab && (
                            <div key={section.id} className="animate-in fade-in zoom-in-95 duration-200">
                                <h3 className="text-xl font-bold mt-0 mb-4">{section.title}</h3>
                                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words border border-gray-100 dark:border-zinc-800/50 p-4 rounded-xl bg-slate-50/50 dark:bg-zinc-900/30">
                                    {section.content}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <Button
                    onClick={onValidate}
                    className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                    Evaluate Idea Success Rate
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
