import { 
  TripForm, 
  Itinerary, 
  ChatMessage, 
  Rating, 
  Activity,
  SwapRequest,
  itineraries,
  chatMessages,
  ratings
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { getActivitiesForDestination, getSwapAlternatives } from "./data/mockTravelData";

export interface IStorage {
  // Itinerary operations
  createItinerary(formData: TripForm): Promise<Itinerary>;
  getItinerary(id: string): Promise<Itinerary | undefined>;
  updateItinerary(id: string, itinerary: Partial<Itinerary>): Promise<Itinerary>;
  
  // Chat operations
  saveChatMessage(message: ChatMessage): Promise<ChatMessage>;
  getChatHistory(itineraryId: string): Promise<ChatMessage[]>;
  
  // Rating operations
  saveRating(rating: Rating): Promise<Rating>;
  getRatings(itineraryId: string): Promise<Rating[]>;
  
  // Activity operations
  getSwapAlternatives(request: SwapRequest): Promise<Activity[]>;
  getAllActivities(destination: string): Promise<Activity[]>;
}

export class DatabaseStorage implements IStorage {
  async createItinerary(formData: TripForm): Promise<Itinerary> {
    const id = `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create initial itinerary structure
    const itinerary: Itinerary = {
      id,
      days: [], // Will be populated by the generation logic
      totalCost: 0,
      destination: formData.destination,
      partySize: formData.partySize,
      createdAt: new Date().toISOString(),
    };
    
    return itinerary;
  }

  async getItinerary(id: string): Promise<Itinerary | undefined> {
    const [result] = await db.select().from(itineraries).where(eq(itineraries.id, id));
    
    if (!result) return undefined;
    
    return {
      id: result.id,
      destination: result.destination,
      partySize: result.partySize,
      totalCost: result.totalCost,
      createdAt: result.createdAt.toISOString(),
      days: result.days as any, // JSON data
    };
  }

  async updateItinerary(id: string, updates: Partial<Itinerary>): Promise<Itinerary> {
    // For new itineraries, insert them
    const existing = await this.getItinerary(id);
    
    if (!existing) {
      // Insert new itinerary
      await db.insert(itineraries).values({
        id: updates.id!,
        destination: updates.destination!,
        partySize: updates.partySize!,
        totalCost: updates.totalCost!,
        days: updates.days as any,
      });
      
      return updates as Itinerary;
    }
    
    // Update existing itinerary
    const updated = { ...existing, ...updates };
    
    await db.update(itineraries)
      .set({
        destination: updated.destination,
        partySize: updated.partySize,
        totalCost: updated.totalCost,
        days: updated.days as any,
      })
      .where(eq(itineraries.id, id));
    
    return updated;
  }

  async saveChatMessage(message: ChatMessage): Promise<ChatMessage> {
    await db.insert(chatMessages).values({
      id: message.id,
      itineraryId: "current", // Default for now
      type: message.type,
      content: message.content,
      context: message.context as any,
    });
    
    return message;
  }

  async getChatHistory(itineraryId: string = "current"): Promise<ChatMessage[]> {
    const results = await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.itineraryId, itineraryId))
      .orderBy(chatMessages.timestamp);
    
    return results.map(row => ({
      id: row.id,
      type: row.type as "user" | "assistant",
      content: row.content,
      timestamp: row.timestamp.toISOString(),
      context: row.context as any,
    }));
  }

  async saveRating(rating: Rating): Promise<Rating> {
    await db.insert(ratings).values({
      id: rating.id,
      itineraryId: rating.itineraryId,
      rating: rating.rating,
      feedback: rating.feedback,
    });
    
    return rating;
  }

  async getRatings(itineraryId: string): Promise<Rating[]> {
    const results = await db.select()
      .from(ratings)
      .where(eq(ratings.itineraryId, itineraryId));
    
    return results.map(row => ({
      id: row.id,
      itineraryId: row.itineraryId,
      rating: row.rating,
      feedback: row.feedback || undefined,
      timestamp: row.timestamp.toISOString(),
    }));
  }

  async getSwapAlternatives(request: SwapRequest): Promise<Activity[]> {
    return getSwapAlternatives(request.currentActivity, "Hawaii"); // Use mock data for now
  }

  async getAllActivities(destination: string): Promise<Activity[]> {
    return getActivitiesForDestination(destination);
  }
}

export const storage = new DatabaseStorage();
