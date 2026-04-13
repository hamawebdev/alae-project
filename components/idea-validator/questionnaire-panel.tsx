"use client";

import { useState } from "react";
import { ValidatorState, ValidatorAction } from "./types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface QuestionnairePanelProps {
    state: ValidatorState;
    dispatch: React.Dispatch<ValidatorAction>;
    onComplete: () => void;
}

export function QuestionnairePanel({ state, dispatch, onComplete }: QuestionnairePanelProps) {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    const [freeText, setFreeText] = useState("");

    if (!currentQuestion) return null;

    const currentAnswer = state.answers[currentQuestion.id] || "";
    const isFirst = state.currentQuestionIndex === 0;
    const isLast = state.currentQuestionIndex === state.questions.length - 1;

    const handleNext = () => {
        if (isLast) {
            onComplete();
        } else {
            dispatch({ type: "SET_CURRENT_QUESTION", payload: state.currentQuestionIndex + 1 });
            setFreeText("");
        }
    };

    const handlePrev = () => {
        if (!isFirst) {
            dispatch({ type: "SET_CURRENT_QUESTION", payload: state.currentQuestionIndex - 1 });
        }
    };

    const selectOption = (label: string) => {
        dispatch({ type: "ANSWER_QUESTION", payload: { questionId: currentQuestion.id, answer: label } });
    };

    const submitFreeText = () => {
        if (freeText.trim()) {
            dispatch({ type: "ANSWER_QUESTION", payload: { questionId: currentQuestion.id, answer: freeText } });
        }
    };

    return (
        <div className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6 overflow-hidden relative">
            {/* Progress bar at top */}
            <div className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300"
                style={{ width: `${((state.currentQuestionIndex + 1) / state.questions.length) * 100}%` }}
            />

            <div className="max-w-2xl mx-auto space-y-8 mt-4">
                <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                        Question {state.currentQuestionIndex + 1} of {state.questions.length}
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {currentQuestion.title}
                    </h2>
                    {currentQuestion.description && (
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            {currentQuestion.description}
                        </p>
                    )}
                </div>

                <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => selectOption(option.label)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${currentAnswer === option.label
                                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm"
                                    : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                                }`}
                        >
                            <span className={`text-sm font-medium ${currentAnswer === option.label ? "text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-200"}`}>
                                {option.label}
                            </span>
                            {currentAnswer === option.label && <Check className="h-5 w-5 text-blue-600" />}
                        </button>
                    ))}

                    {currentQuestion.allowFreeText && (
                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                            <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Or type your own answer:</p>
                            <Textarea
                                value={freeText}
                                onChange={(e) => setFreeText(e.target.value)}
                                onBlur={submitFreeText}
                                placeholder="Give us more details..."
                                className="w-full resize-none min-h-[100px] bg-gray-50 dark:bg-zinc-900"
                            />
                        </div>
                    )}
                </div>

                <div className="pt-6 flex justify-between items-center">
                    <Button variant="outline" onClick={handlePrev} disabled={isFirst}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={!currentAnswer && !freeText.trim()}
                        className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        {isLast ? "Complete Intake" : "Next Question"}
                        {!isLast && <ArrowRight className="h-4 w-4 ml-2" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
