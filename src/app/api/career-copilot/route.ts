import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { executeWorkflow } from "@/lib/langgraph/executor";
import PDFParser from "pdf2json";

export const maxDuration = 60; // Max allowed for hobby tier is 60s

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfParser = new PDFParser(null, true);

    const extractedText = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => {
        resolve(pdfParser.getRawTextContent());
      });
      pdfParser.parseBuffer(buffer);
    });

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }

    const encoder = new TextEncoder();
    
    // We create a ReadableStream to stream Server-Sent Events (SSE)
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await executeWorkflow(
            session.user?.id || "user",
            session.user?.name || "Candidate",
            extractedText,
            (state) => {
              // Send the updated state to the client
              const data = JSON.stringify(state);
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          );
          // Signal completion
          controller.enqueue(encoder.encode("event: done\ndata: {}\n\n"));
          controller.close();
        } catch (error: any) {
          console.error("Workflow Error:", error);
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Copilot Init Error:", error);
    return NextResponse.json({ error: "Failed to initialize copilot" }, { status: 500 });
  }
}
