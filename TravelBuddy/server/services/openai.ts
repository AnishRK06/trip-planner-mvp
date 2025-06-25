import OpenAI from "openai";
import { ChatMessage, Itinerary, Activity } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "your-api-key-here"
});

export class OpenAIService {
  async processUserMessage(
    message: string, 
    itinerary: Itinerary | null,
    chatHistory: ChatMessage[]
  ): Promise<{ response: string; itineraryModified: boolean; modificationDetails?: string }> {
    try {
      const context = this.buildContext(itinerary, chatHistory);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a helpful trip planning assistant. You can help users modify their itineraries, suggest alternatives, and answer questions about their trip.

Current itinerary context: ${context}

When responding:
1. Be helpful and enthusiastic about travel
2. If the user asks to modify the itinerary, explain what changes you would make
3. For commands like "add nightlife", "find cheaper restaurants", etc., suggest specific modifications
4. Keep responses concise but informative
5. If you suggest modifications, be specific about what would change

Respond with a JSON object in this format:
{
  "response": "your response text",
  "modifiesItinerary": boolean,
  "modification": "description of specific changes if any"
}`
          },
          ...chatHistory.slice(-5).map(msg => ({
            role: msg.type === "user" ? "user" as const : "assistant" as const,
            content: msg.content
          })),
          {
            role: "user",
            content: message
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        response: result.response || "I'm here to help with your trip planning!",
        itineraryModified: result.modifiesItinerary || false,
        modificationDetails: result.modification
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      return {
        response: "I'm experiencing some technical difficulties right now. Please try again in a moment.",
        itineraryModified: false
      };
    }
  }

  private buildContext(itinerary: Itinerary | null, chatHistory: ChatMessage[]): string {
    if (!itinerary) {
      return "No itinerary has been created yet.";
    }

    const daysSummary = itinerary.days.map(day => 
      `Day ${day.dayNumber}: ${day.activities.morning.name}, ${day.activities.afternoon.name}, ${day.activities.evening.name} (Total: $${day.totalCost})`
    ).join("; ");

    return `Destination: ${itinerary.destination}, ${itinerary.days.length} days, ${itinerary.partySize} travelers, Total budget: $${itinerary.totalCost}. Activities: ${daysSummary}`;
  }

  async generateItinerarySuggestions(
    destination: string,
    budget: number,
    days: number,
    preferences: string[]
  ): Promise<string[]> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Generate travel activity suggestions for ${destination} with a budget of $${budget} for ${days} days. Consider these preferences: ${preferences.join(", ")}. 

Respond with a JSON object containing an array of activity suggestions:
{
  "suggestions": ["activity 1", "activity 2", ...]
}`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.suggestions || [];
    } catch (error) {
      console.error("OpenAI suggestion error:", error);
      return [];
    }
  }
}

export const openaiService = new OpenAIService();
