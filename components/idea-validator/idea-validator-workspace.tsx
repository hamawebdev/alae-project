"use client";

import { useReducer } from "react";
import {
    ValidatorState,
    ValidatorAction,
} from "./types";
import { ValidatorComposer } from "./validator-composer";
import { SummaryRail } from "./summary-rail";
import { QuestionnairePanel } from "./questionnaire-panel";
import { ResearchResultsPanel } from "./research-results-panel";
import { FeatureReviewPanel } from "./feature-review-panel";
import { PrdPanel } from "./prd-panel";
import { EvaluationPanel } from "./evaluation-panel";

// Loading component from kokonutui
import AILoadingState from "@/components/kokonutui/ai-loading";
import { Button } from "@/components/ui/button";

import { generateIntakeQuestions, analyzeMissingPrdFields, researchCompetitors, generatePrd, evaluateIdea } from "@/app/actions/validator";

const initialState: ValidatorState = {
    stage: "idle",
    mode: "simple",
    error: null,
    uploadedFiles: [],
    prdWipText: "",
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    competitors: [],
    features: [],
    prd: [],
    evaluation: null,
};

function validatorReducer(state: ValidatorState, action: ValidatorAction): ValidatorState {
    switch (action.type) {
        case "RESET":
            return initialState;
        case "SET_MODE":
            return { ...state, mode: action.payload };
        case "SET_STAGE":
            return { ...state, stage: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        case "ADD_FILE":
            return { ...state, uploadedFiles: [...state.uploadedFiles, action.payload] };
        case "REMOVE_FILE":
            return { ...state, uploadedFiles: state.uploadedFiles.filter(f => f.id !== action.payload) };
        case "START_INTAKE":
            return {
                ...state,
                mode: action.payload.mode,
                questions: action.payload.initialQuestions,
                currentQuestionIndex: 0,
                stage: "intake",
            };
        case "SET_CURRENT_QUESTION":
            return { ...state, currentQuestionIndex: action.payload };
        case "ANSWER_QUESTION":
            return {
                ...state,
                answers: { ...state.answers, [action.payload.questionId]: action.payload.answer },
            };
        case "UPDATE_PRD_TEXT":
            return { ...state, prdWipText: action.payload };
        case "SET_COMPETITORS":
            return { ...state, competitors: action.payload };
        case "SET_FEATURES":
            return { ...state, features: action.payload };
        case "APPROVE_FEATURE":
            return {
                ...state,
                features: state.features.map(f =>
                    f.id === action.payload ? { ...f, status: "approved" } : f
                ),
            };
        case "REJECT_FEATURE":
            return {
                ...state,
                features: state.features.map(f =>
                    f.id === action.payload ? { ...f, status: "rejected" } : f
                ),
            };
        case "SET_PRD":
            return { ...state, prd: action.payload };
        case "SET_EVALUATION":
            return { ...state, evaluation: action.payload };
        default:
            return state;
    }
}

export function IdeaValidatorWorkspace() {
    const [state, dispatch] = useReducer(validatorReducer, initialState);

    const handleComposerSubmit = async (text: string) => {
        dispatch({ type: "UPDATE_PRD_TEXT", payload: text });
        dispatch({ type: "SET_ERROR", payload: null });

        if (state.mode === "simple") {
            dispatch({ type: "SET_STAGE", payload: "research_loading" });
            try {
                const questions = await generateIntakeQuestions(text);
                if (questions.length > 0) {
                    dispatch({ type: "START_INTAKE", payload: { mode: "simple", initialQuestions: questions } });
                } else {
                    const competitors = await researchCompetitors(text, {});
                    dispatch({ type: "SET_COMPETITORS", payload: competitors });
                    dispatch({ type: "SET_FEATURES", payload: competitors.flatMap(c => c.features) });
                    dispatch({ type: "SET_STAGE", payload: "research_results" });
                }
            } catch (err: unknown) {
                dispatch({ type: "SET_ERROR", payload: new Error((err as Error).message || "Failed to generate intake questions") });
                dispatch({ type: "SET_STAGE", payload: "idle" });
            }
        } else {
            // detailed flow
            if (!text.trim() && state.uploadedFiles.length === 0) {
                dispatch({ type: "SET_ERROR", payload: new Error("Please provide PRD text or upload a file for Detailed Mode.") });
                return;
            }

            dispatch({ type: "SET_STAGE", payload: "research_loading" });
            try {
                const missingQuestions = await analyzeMissingPrdFields(text);
                if (missingQuestions.length > 0) {
                    dispatch({ type: "START_INTAKE", payload: { mode: "detailed", initialQuestions: missingQuestions } });
                } else {
                    // If no questions missing, just go straight to research.
                    const competitors = await researchCompetitors(text, {});
                    dispatch({ type: "SET_COMPETITORS", payload: competitors });
                    dispatch({ type: "SET_FEATURES", payload: competitors.flatMap(c => c.features) });
                    dispatch({ type: "SET_STAGE", payload: "research_results" });
                }
            } catch (err: unknown) {
                dispatch({ type: "SET_ERROR", payload: new Error((err as Error).message || "Failed to analyze PRD") });
                dispatch({ type: "SET_STAGE", payload: "idle" });
            }
        }
    };

    const handleIntakeComplete = async () => {
        dispatch({ type: "SET_STAGE", payload: "research_loading" });
        try {
            const competitors = await researchCompetitors(state.prdWipText, state.answers);
            dispatch({ type: "SET_COMPETITORS", payload: competitors });
            dispatch({ type: "SET_FEATURES", payload: competitors.flatMap(c => c.features) });
            dispatch({ type: "SET_STAGE", payload: "research_results" });
        } catch (err: unknown) {
            dispatch({ type: "SET_ERROR", payload: new Error((err as Error).message || "Failed to research competitors") });
            dispatch({ type: "SET_STAGE", payload: "intake" });
        }
    };

    const handleContinueToFeatures = () => {
        dispatch({ type: "SET_STAGE", payload: "feature_review" });
    };

    const handleGeneratePRD = async () => {
        const approved = state.features.filter(f => f.status === "approved");
        dispatch({ type: "SET_STAGE", payload: "research_loading" });
        try {
            const prd = await generatePrd(state.prdWipText, state.answers, approved);
            dispatch({ type: "SET_PRD", payload: prd });
            dispatch({ type: "SET_STAGE", payload: "prd_ready" });
        } catch (err: unknown) {
            dispatch({ type: "SET_ERROR", payload: new Error((err as Error).message || "Failed to generate PRD") });
            dispatch({ type: "SET_STAGE", payload: "feature_review" });
        }
    };

    const handleValidateIdea = async () => {
        dispatch({ type: "SET_STAGE", payload: "research_loading" });
        try {
            const evaluation = await evaluateIdea(state.prd, state.competitors);
            dispatch({ type: "SET_EVALUATION", payload: evaluation });
            dispatch({ type: "SET_STAGE", payload: "evaluation_ready" });
        } catch (err: unknown) {
            dispatch({ type: "SET_ERROR", payload: new Error((err as Error).message || "Failed to evaluate idea") });
            dispatch({ type: "SET_STAGE", payload: "prd_ready" });
        }
    };

    return (
        <div className="flex w-full h-full min-h-[calc(100vh-4rem)] bg-gray-50/50 dark:bg-black/50">
            <div className="flex-1 flex flex-col items-center py-10 px-4 sm:px-6">
                <div className="w-full max-w-4xl space-y-8">

                    {/* Header */}
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">SaaS Idea Validator</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Transform your raw concept into a structured, validated PRD.</p>
                        </div>
                        {state.stage !== "idle" && (
                            <Button variant="outline" size="sm" onClick={() => dispatch({ type: "RESET" })}>
                                Reset
                            </Button>
                        )}
                    </div>

                    {/* Main Content Area */}
                    {state.error && (
                        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg w-full flex items-center justify-between">
                            <span>{state.error.message}</span>
                            <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "SET_ERROR", payload: null })}>Dismiss</Button>
                        </div>
                    )}

                    {state.stage === "idle" && (
                        <ValidatorComposer state={state} dispatch={dispatch} onSubmit={handleComposerSubmit} />
                    )}

                    {state.stage === "intake" && (
                        <QuestionnairePanel state={state} dispatch={dispatch} onComplete={handleIntakeComplete} />
                    )}

                    {state.stage === "research_loading" && (
                        <div className="p-12 w-full flex items-center justify-center bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                            <AILoadingState />
                        </div>
                    )}

                    {state.stage === "research_results" && (
                        <ResearchResultsPanel state={state} dispatch={dispatch} onContinue={handleContinueToFeatures} />
                    )}

                    {state.stage === "feature_review" && (
                        <FeatureReviewPanel state={state} dispatch={dispatch} onGeneratePRD={handleGeneratePRD} />
                    )}

                    {state.stage === "prd_ready" && (
                        <PrdPanel state={state} onValidate={handleValidateIdea} />
                    )}

                    {state.stage === "evaluation_ready" && (
                        <EvaluationPanel state={state} onReset={() => dispatch({ type: "RESET" })} />
                    )}

                </div>
            </div>

            {/* Sticky Right Rail for Desktop */}
            {state.stage !== "idle" && (
                <div className="hidden lg:block w-64 xl:w-72 border-l border-gray-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-950/50 p-6 sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto">
                    <SummaryRail stage={state.stage} mode={state.mode} />
                </div>
            )}
        </div>
    );
}
