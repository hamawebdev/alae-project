"use client";

import { useState } from "react";
import { ArrowRight, Paperclip, X } from "lucide-react";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ValidatorAction, ValidatorState } from "./types";

interface ValidatorComposerProps {
    state: ValidatorState;
    dispatch: React.Dispatch<ValidatorAction>;
    onSubmit: (text: string, files: File[]) => void;
}

export function ValidatorComposer({ state, dispatch, onSubmit }: ValidatorComposerProps) {
    const [value, setValue] = useState(state.prdWipText);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 120,
        maxHeight: 400,
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            // In a real app we'd upload this. For now we just add it to state.
            dispatch({
                type: "ADD_FILE",
                payload: { id: Date.now().toString(), name: file.name, size: file.size }
            });
        }
    };

    const handleSubmit = () => {
        onSubmit(value, []); // Add actual files if tracking natively
    };

    return (
        <div className="w-full flex flex-col space-y-4">
            {/* Mode Selector */}
            <div className="flex p-1 bg-gray-100 dark:bg-zinc-900 rounded-lg w-fit">
                <button
                    onClick={() => dispatch({ type: "SET_MODE", payload: "simple" })}
                    className={cn(
                        "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                        state.mode === "simple"
                            ? "bg-white dark:bg-zinc-800 shadow-sm text-gray-900 dark:text-gray-100"
                            : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                    )}
                >
                    Simple Input
                </button>
                <button
                    onClick={() => dispatch({ type: "SET_MODE", payload: "detailed" })}
                    className={cn(
                        "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                        state.mode === "detailed"
                            ? "bg-white dark:bg-zinc-800 shadow-sm text-gray-900 dark:text-gray-100"
                            : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                    )}
                >
                    Detailed PRD
                </button>
            </div>

            <div className="rounded-2xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-sm p-2 pt-4">
                <div className="mx-3 mb-2 flex items-center gap-2">
                    {state.mode === "simple" ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Describe your idea simply, and AI will guide you through the rest.
                        </p>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Paste or upload your raw PRD. We&apos;ll analyze it for missing gaps.
                        </p>
                    )}
                </div>

                <div className="relative flex flex-col">
                    <div className="overflow-y-auto">
                        <Textarea
                            className="w-full resize-none rounded-xl border-none bg-transparent px-4 py-3 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white"
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={state.mode === "simple" ? "e.g. A marketplace for local artisanal foods..." : "Paste your PRD text here..."}
                            ref={textareaRef}
                        />
                    </div>

                    {/* File Chips */}
                    {state.uploadedFiles.length > 0 && (
                        <div className="px-4 py-2 flex flex-wrap gap-2">
                            {state.uploadedFiles.map((file) => (
                                <div key={file.id} className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-md text-xs">
                                    <Paperclip className="h-3 w-3" />
                                    <span className="truncate max-w-[150px]">{file.name}</span>
                                    <button onClick={() => dispatch({ type: "REMOVE_FILE", payload: file.id })} className="p-0.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex h-14 items-center rounded-b-xl px-3 border-t border-gray-100 dark:border-zinc-800/50 mt-2">
                        <div className="flex w-full items-center justify-between">
                            <label className="cursor-pointer flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-500 transition-colors">
                                <input className="hidden" type="file" onChange={handleFileChange} />
                                <Paperclip className="h-4 w-4" />
                                <span className="text-sm font-medium">Upload File</span>
                            </label>

                            <Button
                                onClick={handleSubmit}
                                disabled={state.mode === "simple" ? !value.trim() : (!value.trim() && state.uploadedFiles.length === 0)}
                                className="rounded-xl px-6 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                            >
                                Start Validator
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
