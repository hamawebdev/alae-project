export type ValidatorMode = "simple" | "detailed";

export type ValidatorStage =
    | "idle"
    | "intake"
    | "research_loading"
    | "research_results"
    | "feature_review"
    | "prd_ready"
    | "evaluation_ready"
    | "error";

export interface QuestionOption {
    id: string;
    label: string;
}

export interface Question {
    id: string;
    title: string;
    description?: string;
    options: QuestionOption[];
    allowFreeText?: boolean;
}

export interface UploadedAsset {
    id: string;
    name: string;
    size: number;
}

export interface FeatureCandidate {
    id: string;
    title: string;
    description: string;
    status: "pending" | "approved" | "rejected";
}

export interface CompetitorProfile {
    id: string;
    name: string;
    positioning: string;
    audience: string;
    pricingBadge: string;
    saturationSignal: "low" | "medium" | "high";
    features: FeatureCandidate[];
}

export interface PRDSection {
    id: string;
    title: string;
    content: string;
}

export interface IdeaEvaluationMetric {
    id: string;
    label: string;
    percentage: number;
    explanation: string;
    reasoning: string;
}

export interface IdeaEvaluation {
    overallScore: number;
    metrics: IdeaEvaluationMetric[];
}

export interface ValidatorState {
    stage: ValidatorStage;
    mode: ValidatorMode;
    error: Error | null;
    uploadedFiles: UploadedAsset[];
    prdWipText: string; // The initial text user types in the textarea
    questions: Question[];
    currentQuestionIndex: number;
    answers: Record<string, string>; // Maps questionId -> answer text or option label
    competitors: CompetitorProfile[];
    features: FeatureCandidate[];
    prd: PRDSection[];
    evaluation: IdeaEvaluation | null;
}

export type ValidatorAction =
    | { type: "RESET" }
    | { type: "SET_MODE"; payload: ValidatorMode }
    | { type: "SET_STAGE"; payload: ValidatorStage }
    | { type: "SET_ERROR"; payload: Error | null }
    | { type: "ADD_FILE"; payload: UploadedAsset }
    | { type: "REMOVE_FILE"; payload: string }
    | { type: "START_INTAKE"; payload: { mode: ValidatorMode; initialQuestions: Question[] } }
    | { type: "SET_CURRENT_QUESTION"; payload: number }
    | { type: "ANSWER_QUESTION"; payload: { questionId: string; answer: string } }
    | { type: "UPDATE_PRD_TEXT"; payload: string }
    | { type: "SET_COMPETITORS"; payload: CompetitorProfile[] }
    | { type: "SET_FEATURES"; payload: FeatureCandidate[] }
    | { type: "APPROVE_FEATURE"; payload: string }
    | { type: "REJECT_FEATURE"; payload: string }
    | { type: "SET_PRD"; payload: PRDSection[] }
    | { type: "SET_EVALUATION"; payload: IdeaEvaluation };
