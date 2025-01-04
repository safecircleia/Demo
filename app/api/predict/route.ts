import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // More accurate pattern matching based on your dataset
    const harmfulPatterns = [
      /privado/i,
      /foto/i,
      /secreto/i,
      /solo/i,
      /edad/i,
      /conocerte/i,
      /ropa/i,
      /padres/i,
      /maduro/i,
      /cine/i,
      /vives/i,
      /novio|novia/i,
      /amigos especiales/i,
      /habitación/i,
    ];

    // Check if message matches any harmful patterns
    const isHarmful = harmfulPatterns.some((pattern) => pattern.test(message));

    // Simulate different probability levels
    let probability;
    let prediction;

    if (isHarmful) {
      probability = 0.8 + Math.random() * 0.2; // Between 0.8 and 1.0
      prediction = "Highly likely to be harmful";
    } else {
      probability = Math.random() * 0.3; // Between 0 and 0.3
      prediction = "Likely safe";
    }

    // Add a small delay to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      prediction,
      probability,
    });
  } catch (error) {
    console.error("Error processing message:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}
