import { GoogleGenAI, Type } from "@google/genai";
import { TripData } from "../types";

// Helper to sanitize JSON string if the model returns markdown code blocks
const cleanJsonString = (str: string) => {
  return str.replace(/```json\n?|\n?```/g, "").trim();
};

export const generateTripPlan = async (
  prompt: string, 
  currentData: TripData
): Promise<Partial<TripData> | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key is missing");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
      You are a helpful travel planning assistant. 
      The user will give you a destination or a rough plan.
      You must return a JSON object that matches the structure of the TripData interface provided below.
      
      Generate realistic mock data for flights, hotels, activities, and transportation based on the destination.
      Dates should be relative to today if not specified.
      Currency values (cost/price) should be in KRW (Korean Won).
      
      TripData Interface Structure:
      {
        title: string,
        destination: string,
        startDate: string (YYYY-MM-DD),
        endDate: string (YYYY-MM-DD),
        budget: number,
        flights: [
          { id: string, type: 'outbound'|'inbound', airline: string, flightNumber: string, departureTime: string, arrivalTime: string, departureAirport: string, arrivalAirport: string, price: number }
        ],
        accommodations: [
           { id: string, name: string, address: string, checkIn: string, checkOut: string, price: number, notes: string }
        ],
        activities: [
           { id: string, day: number (1-based index), time: string, title: string, location: string, description: string, cost: number }
        ],
        transportation: [
           { id: string, type: 'rental'|'train'|'bus'|'taxi'|'other', details: string, pickupLocation: string, cost: number }
        ]
      }

      Only return the JSON object. Do not return markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a trip plan for: ${prompt}.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) return null;

    const parsedData = JSON.parse(cleanJsonString(text));
    return parsedData;

  } catch (error) {
    console.error("Error generating trip plan:", error);
    return null;
  }
};