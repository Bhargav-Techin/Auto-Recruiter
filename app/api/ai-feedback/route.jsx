import { FEEDBACK_PROMPT } from "@/services/Constants";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { conversation } = await req.json();

        const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
            "{{conversation}}",
            conversation
        );

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            model: "deepseek/deepseek-chat-v3-0324:free",
            messages: [{ role: "user", content: FINAL_PROMPT }],
        });

        let rawContent = completion.choices?.[0]?.message?.content?.trim();

        if (!rawContent) {
            throw new Error("No response content from AI model");
        }


        return NextResponse.json(
            { message: rawContent },
            { status: 200 }
        );

    } catch (error) {
        console.error("AI Model API Error:", error);
        return NextResponse.json(
            {
                error: error.message || "Error generating feedback",
                details: error.stack,
            },
            { status: 500 }
        );
    }
}
