import { GoogleGenAI } from "@google/genai";
import type { Restaurant, GroundingChunk, StreamResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function* findRestaurants(
  location: string | GeolocationCoordinates,
  radius: number,
  openNow: boolean,
  cuisine: string,
): AsyncGenerator<StreamResult> {
  const locationString = typeof location === 'string' 
    ? location 
    : `latitude: ${location.latitude}, longitude: ${location.longitude}`;

  const prompt = `
    You are an expert local food guide. Your task is to find locally-owned, independent restaurants and takeout places, specifically excluding large national or international chain restaurants.

    Find restaurants based on the following criteria:
    - Location: around ${locationString}
    - Search Radius: within ${radius} miles
    ${cuisine ? `- Cuisine: Only show restaurants serving or related to "${cuisine}" food.` : ''}
    - Filter by "Open Now": ${openNow ? 'Yes, only show currently open restaurants' : 'No, show all restaurants regardless of status'}

    Stream your response by providing one restaurant at a time. Each restaurant must be a single, complete JSON object on its own line. Do not use markdown, code blocks, or any other formatting. Just stream the raw JSON objects line by line.

    Each restaurant JSON object must have the following properties:
    - "name": (string) The full business name.
    - "price": (string) A price estimate using one to four dollar signs (e.g., "$", "$$", "$$$", "$$$$").
    - "distance": (string) The approximate distance from the search point in miles.
    - "address": (string) The full street address.
    - "phone": (string) The contact telephone number.
    - "website": (string) The restaurant's website URL. If not available, use an empty string.
    - "hours": (object) An object with keys for each day of the week (e.g., "Monday", "Tuesday") and string values showing the hours of operation for that day (e.g., "11:00 AM - 10:00 PM", "Closed").
    - "rating": (object) An object containing "stars" (number, out of 5) and "count" (number, total reviews).
    - "cuisine": (string) A brief description of the cuisine type.
    - "status": (string) The current operational status (e.g., "Open now", "Closed").

    Filter out all major chains like McDonald's, Starbucks, Subway, Burger King, Pizza Hut, Domino's, KFC, Taco Bell, etc. Focus on unique, local dining experiences.
  `;

  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    let buffer = '';
    let sourcesSent = false;
    
    for await (const chunk of stream) {
        if (!sourcesSent) {
            const sources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[];
            if (sources && sources.length > 0) {
                yield { type: 'sources', data: sources };
                sourcesSent = true;
            }
        }
        
        buffer += chunk.text;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (line.trim()) {
                try {
                    const restaurant = JSON.parse(line.trim());
                    yield { type: 'restaurant', data: restaurant as Restaurant };
                } catch (e) {
                    console.warn("Failed to parse a line of the stream as JSON:", line, e);
                }
            }
        }
    }

    // Process any remaining content in the buffer
    if (buffer.trim()) {
        try {
            const restaurant = JSON.parse(buffer.trim());
            yield { type: 'restaurant', data: restaurant as Restaurant };
        } catch (e) {
            console.warn("Failed to parse the final buffer content as JSON:", buffer, e);
        }
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Could not fetch data from Gemini API.");
  }
};