import { GoogleGenAI, Modality } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getUserUuid } from "@/services/user";
import { getUserCredits, decreaseCredits, CreditsTransType, CreditsAmount } from "@/services/credit";
import { respErr } from "@/lib/resp";

// Rate limiting - simple in-memory counter
const DAILY_LIMIT = 10;
const requestCounts = new Map<string, { count: number; date: string }>();

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return ip;
}

function checkRateLimit(key: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  const existing = requestCounts.get(key);
  
  if (!existing || existing.date !== today) {
    requestCounts.set(key, { count: 1, date: today });
    return true;
  }
  
  if (existing.count >= DAILY_LIMIT) {
    return false;
  }
  
  existing.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // User authentication
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    // Check user credits
    const userCredits = await getUserCredits(user_uuid);
    if (userCredits.left_credits < CreditsAmount.GenerateCost) {
      return NextResponse.json(
        { success: false, error: "Insufficient credits" },
        { status: 402 }
      );
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(req);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { success: false, error: "Daily limit exceeded" },
        { status: 429 }
      );
    }

    const { imageUrl, theme, elements } = await req.json();

    if (!imageUrl || !theme) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: imageUrl and theme" },
        { status: 400 }
      );
    }

    // Verify API key exists (support both environment variable names)
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY or GOOGLE_API_KEY environment variable is not set');
    }

    // Initialize Google GenAI
    const ai = new GoogleGenAI({ apiKey });

    // Convert image URL to base64 if it's a URL
    let imageData: string;
    let mimeType = "image/jpeg";

    if (imageUrl.startsWith("data:")) {
      // Extract base64 data from data URL
      const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        throw new Error("Invalid data URL format");
      }
      mimeType = matches[1];
      imageData = matches[2];
    } else {
      // Fetch image from URL and convert to base64
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (contentType) {
        mimeType = contentType;
      }
      
      const buffer = await response.arrayBuffer();
      imageData = Buffer.from(buffer).toString("base64");
    }

    // Generate prompt based on style and elements for garden design
    const prompt = `Transform this garden/outdoor space into ${theme} style. Keep the main landscape structure and layout, but redesign it with ${theme} garden aesthetics. ${elements ? `Incorporate these special elements: ${elements}.` : ''} Make it look natural, harmonious and realistic. Focus on plants, hardscape features, lighting, water elements, and garden structures that match the ${theme} garden style. The result should be photorealistic and professionally landscaped with proper plant placement, seasonal considerations, and garden design principles.`;

    const contents = [
      { text: prompt },
      { inlineData: { mimeType, data: imageData } },
    ];

    // Call Gemini image-to-image model
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents,
      config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
    });

    // Extract generated image
    const candidates = response.candidates;

    if (!candidates || candidates.length === 0) {
      throw new Error("No image generated");
    }

    const firstCandidate = candidates[0];
    if (!firstCandidate?.content?.parts) {
      throw new Error("Invalid response structure");
    }

    const parts = firstCandidate.content.parts;
    const imagePart = parts.find((part: any) => part.inlineData);

    if (!imagePart || !imagePart.inlineData) {
      throw new Error("No image found in response");
    }

    const generatedImageData = imagePart.inlineData.data;
    const generatedImageMimeType = imagePart.inlineData.mimeType;

    // Return the generated image as base64 data URL
    const imageDataUrl = `data:${generatedImageMimeType};base64,${generatedImageData}`;

    // Deduct credits only after successful generation
    await decreaseCredits({
      user_uuid,
      trans_type: CreditsTransType.Generate,
      credits: CreditsAmount.GenerateCost,
    });

    return NextResponse.json({
      success: true,
      image: imageDataUrl,
    });

  } catch (error) {
    console.error("Error generating image:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}