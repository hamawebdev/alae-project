"use server";

import { GoogleGenAI } from '@google/genai';
import { Question, CompetitorProfile, PRDSection, IdeaEvaluation, FeatureCandidate } from '@/components/idea-validator/types';

// Let the module fail gracefully if no API key is set so the UI can handle it.
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }
  return new GoogleGenAI({ apiKey });
};

export async function generateIntakeQuestions(ideaContext: string): Promise<Question[]> {
  const ai = getGenAI();
  const prompt = `
You are an expert product manager.
Based on the following new product idea, generate 3 to 4 critical questions to ask the founder to better distill their concept. 
Good topics include target audience, pain points, willingness to pay, core features, or direct competitors.

Make the questions multiple-choice but allowing free text. 
The output MUST be valid JSON, following this exact structure:
[
  {
    "id": "string (e.g. 'audience')",
    "title": "string (The question to ask)",
    "description": "string (A short subtext)",
    "options": [
      { "id": "string", "label": "string" }
    ],
    "allowFreeText": true
  }
]

Product Idea:
${ideaContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional product manager AI. Always return JSON only.",
        responseMimeType: "application/json",
      }
    });

    const output = response.text;
    if (!output) return [];

    const rawData = output.replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate intake questions with AI.");
  }
}

export async function analyzeMissingPrdFields(prdText: string): Promise<Question[]> {
  const ai = getGenAI();
  const prompt = `
You are an expert product manager.
Analyze the following PRD text and detect if any of these critical fields are missing or not adequately explained:
1. Target Audience
2. Customer Needs / Pain Points
3. Core Problem
4. Value Proposition

If all are present, return an empty array.
If any are missing, generate exactly one Question object per missing field to ask the user.
The output MUST be valid JSON, following this structure:
[
  {
    "id": "string (e.g. 'value_prop')",
    "title": "string (The question to ask)",
    "description": "string (A short subtext)",
    "options": [
      { "id": "string", "label": "string" }
    ],
    "allowFreeText": true
  }
]

PRD Text:
${prdText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional product manager AI. Always return JSON only.",
        responseMimeType: "application/json",
      }
    });

    const output = response.text;
    if (!output) return [];

    // Attempt to parse JSON. Sometimes it's wrapped in markdown code blocks.
    const rawData = output.replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to analyze PRD with AI.");
  }
}

export async function researchCompetitors(ideaContext: string, answers: Record<string, string>): Promise<CompetitorProfile[]> {
  const ai = getGenAI();
  const prompt = `
You are an expert market analyst.
Based on the following product idea and context gathered:
Idea Context: ${ideaContext}
Answers: ${JSON.stringify(answers)}

Find or simulate 2 real or highly realistic competitors in this exact space.
For each competitor, provide:
- id (unique string)
- name (string)
- positioning (string)
- audience (string)
- pricingBadge (string)
- saturationSignal (string: "low" | "medium" | "high")
- features (array of feature objects to extract, each feature needs: id (unique), title, description, and status strictly as "pending")

Return valid JSON adhering to this structure:
[
  {
    "id": "string",
    "name": "string",
    "positioning": "string",
    "audience": "string",
    "pricingBadge": "string",
    "saturationSignal": "low" | "medium" | "high",
    "features": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "status": "pending"
      }
    ]
  }
]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const output = response.text;
    if (!output) return [];

    const rawData = output.replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to research competitors with AI.");
  }
}

export async function generatePrd(ideaContext: string, answers: Record<string, string>, approvedFeatures: FeatureCandidate[]): Promise<PRDSection[]> {
  const ai = getGenAI();
  const prompt = `
You are an expert product manager generating a final PRD.
Based on the following inputs, generate a professional structured PRD broken down into specific sections.
Idea Context: ${ideaContext}
Answers: ${JSON.stringify(answers)}
Approved Features to Include: ${JSON.stringify(approvedFeatures.map(f => f.title))}

Return valid JSON adhering to this structure:
[
  {
    "id": "string (e.g. 'overview', 'features', etc.)",
    "title": "string (Section Title)",
    "content": "string (Markdown formatted text)"
  }
]
Include sections like "Overview", "Target Audience", "Core Problem & Value Prop", and "Functional Requirements".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const output = response.text;
    if (!output) return [];

    const rawData = output.replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate PRD with AI.");
  }
}

export async function evaluateIdea(prd: PRDSection[], competitors: CompetitorProfile[]): Promise<IdeaEvaluation> {
  const ai = getGenAI();
  const prompt = `
You are a startup investor and product analyst.
Evaluate the likelihood of success for the following MVP based on its PRD and identified competitors.

PRD: ${JSON.stringify(prd)}
Competitors: ${JSON.stringify(competitors.map(c => ({ name: c.name, saturation: c.saturationSignal })))}

Score the idea from 0 to 100 overall.
Then provide exactly three metrics evaluating: "Market Saturation", "Willingness to Pay", and "Execution Clarity".

Return valid JSON adhering to this structure:
{
  "overallScore": number,
  "metrics": [
    {
      "id": "string",
      "label": "string",
      "percentage": number (0-100),
      "explanation": "string (short 4-5 word summary)",
      "reasoning": "string (1-2 sentence detailed reasoning)"
    }
  ]
}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const output = response.text;
    if (!output) throw new Error("No output generated");

    const rawData = output.replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to evaluate idea with AI.");
  }
}
