import {
    CompetitorProfile,
    FeatureCandidate,
    IdeaEvaluation,
    PRDSection,
    Question,
} from "./types";

export const MOCK_QUESTIONS_SIMPLE: Question[] = [
    {
        id: "audience",
        title: "Who is the primary target audience?",
        description: "Select the group that will use this product most frequently.",
        options: [
            { id: "smb", label: "Small Businesses (SMB)" },
            { id: "enterprise", label: "Enterprise Corporations" },
            { id: "creators", label: "Individual Creators / Freelancers" },
            { id: "consumers", label: "General Consumers (B2C)" },
        ],
        allowFreeText: true,
    },
    {
        id: "pain_points",
        title: "What is their biggest pain point right now?",
        description: "What drives them crazy about their current process?",
        options: [
            { id: "time", label: "It takes too much time" },
            { id: "cost", label: "Existing tools are too expensive" },
            { id: "complexity", label: "Current solutions are too complex" },
            { id: "fragmentation", label: "Data is scattered across too many apps" },
        ],
        allowFreeText: true,
    },
    {
        id: "willingness_to_pay",
        title: "What is their willingness to pay?",
        description: "Roughly, how would this be priced?",
        options: [
            { id: "freemium", label: "Freemium ($0 - $10/mo)" },
            { id: "pro", label: "Pro ($20 - $50/mo)" },
            { id: "team", label: "Team ($100 - $300/mo)" },
            { id: "enterprise", label: "Enterprise ($1,000+/mo)" },
        ],
        allowFreeText: true,
    },
];

export const MOCK_QUESTIONS_DETAILED_MISSING: Question[] = [
    {
        id: "value_prop",
        title: "We noticed your PRD is missing a central Value Proposition.",
        description: "In one sentence, why should a user switch to your product?",
        options: [
            { id: "speed", label: "Faster execution of daily tasks." },
            { id: "roi", label: "Higher ROI with lower overhead." },
            { id: "design", label: "Better user experience and design." },
        ],
        allowFreeText: true,
    },
];

export const MOCK_COMPETITORS: CompetitorProfile[] = [
    {
        id: "comp_1",
        name: "Acme Metrics",
        positioning: "All-in-one analytics for SMBs",
        audience: "E-commerce owners",
        pricingBadge: "$49/mo",
        saturationSignal: "high",
        features: [
            {
                id: "feat_1_1",
                title: "Real-time Dashboard",
                description: "Live view of key metrics with custom filters.",
                status: "pending",
            },
            {
                id: "feat_1_2",
                title: "Automated Email Reports",
                description: "Sends weekly summaries to stakeholders automatically.",
                status: "pending",
            },
        ],
    },
    {
        id: "comp_2",
        name: "DataFlow",
        positioning: "Enterprise data sync",
        audience: "Data Engineers",
        pricingBadge: "$499/mo",
        saturationSignal: "medium",
        features: [
            {
                id: "feat_2_1",
                title: "Visual Pipeline Builder",
                description: "Drag-and-drop interface for data transformations.",
                status: "pending",
            },
            {
                id: "feat_2_2",
                title: "Anomaly Detection Alerts",
                description: "AI alerts when metrics drop significantly.",
                status: "pending",
            },
        ],
    },
];

// Helper to flatten features from competitors initially
export const extractMockFeatures = (): FeatureCandidate[] => {
    return MOCK_COMPETITORS.flatMap((c) => c.features);
};

export const MOCK_PRD_SECTIONS = (answers: Record<string, string>, approvedFeatures: FeatureCandidate[], rejectedFeatures: FeatureCandidate[]): PRDSection[] => [
    {
        id: "overview",
        title: "Overview",
        content: `This product aims to solve the problem where **${answers.pain_points || "the process"}**. Designed primarily for **${answers.audience || "target users"}**, it provides a streamlined experience. Pricing hypothesis revolves around a **${answers.willingness_to_pay || "competitive"}** model.`
    },
    {
        id: "features",
        title: "Functional Requirements",
        content: approvedFeatures.length > 0
            ? approvedFeatures.map(f => `- **${f.title}**: ${f.description}`).join("\n")
            : "No features were approved."
    },
    {
        id: "excluded",
        title: "Out of Scope / Not Now",
        content: rejectedFeatures.length > 0
            ? rejectedFeatures.map(f => `- **${f.title}**: ${f.description}`).join("\n")
            : "No features were explicitly rejected."
    }
];

export const MOCK_EVALUATION: IdeaEvaluation = {
    overallScore: 82,
    metrics: [
        {
            id: "market",
            label: "Market Saturation",
            percentage: 65,
            explanation: "Moderate competition",
            reasoning: "There are established players, but clear gaps exist in user experience and workflow automation.",
        },
        {
            id: "audience",
            label: "Willingness to Pay",
            percentage: 78,
            explanation: "Strong B2B intent",
            reasoning: "Businesses currently pay high fees for disjointed tools, creating a clear budget avenue.",
        },
        {
            id: "execution",
            label: "Execution Clarity",
            percentage: 90,
            explanation: "Well-defined PRD",
            reasoning: "The feature scope is tightly aligned with the target audience's core problems.",
        },
    ],
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
