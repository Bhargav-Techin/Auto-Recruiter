import OpenAI from "openai"
import { NextResponse } from "next/server"
import { QUESTION_PROMPT } from "@/services/Constants"


export async function POST(req) {
    try {
        console.log('Received request:', req);
        if (!process.env.OPENROUTER_API_KEY) {
            throw new Error('OPENROUTER_API_KEY is not defined');
        }

        const { jobPosition, jobDescription, interviewDuration, interviewType } = await req.json();
        
        if (!jobPosition || !jobDescription || !interviewDuration || !interviewType) {
            return NextResponse.json({ 
                error: 'Missing required fields',
                received: { jobPosition, jobDescription, interviewDuration, interviewType }
            }, { status: 400 });
        }

        const prompt = QUESTION_PROMPT
            .replace('{{jobPosition}}', jobPosition)
            .replace('{{jobDescription}}', jobDescription)
            .replace('{{interviewDuration}}', interviewDuration)
            .replace('{{interviewType}}', interviewType);

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        })

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
                { role: "user", content: prompt }
            ],
        })

        if (!completion.choices?.[0]?.message?.content) {
            throw new Error('No response content from AI model');
        }

        return NextResponse.json({ 
            message: completion.choices[0].message.content 
        }, { status: 200 });

    } catch (error) {
        console.error('AI Model API Error:', error);
        return NextResponse.json({ 
            error: error.message || 'Error generating questions',
            details: error.response?.data || error.stack
        }, { status: 500 });
    }
}
