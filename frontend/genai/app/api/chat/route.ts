import { ollama } from "ollama-ai-provider";
import { streamText } from "ai";
import { NextResponse } from "next/server";
 
export const maxDuration = 30;
 
export async function POST(req: Request) {
    const { messages } = await req.json();
    const result = streamText({
        model: ollama("llama3"),
        messages,
    });

    const response = NextResponse.json(await result.toDataStreamResponse());
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
}