import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openaiService } from "./services/openai";
import { getActivitiesForDestination, getSwapAlternatives } from "./data/mockTravelData";
import { 
  tripFormSchema, 
  chatMessageSchema, 
  ratingSchema, 
  swapRequestSchema,
  type TripForm,
  type ChatMessage,
  type Itinerary,
  type Activity
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate itinerary endpoint
  app.post("/api/trip/create", async (req, res) => {
    try {
      const formData = tripFormSchema.parse(req.body);
      const itinerary = await generateItinerary(formData);
      res.json(itinerary);
    } catch (error) {
      console.error("Error creating trip:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to create trip" 
      });
    }
  });

  // Get swap alternatives
  app.post("/api/trip/swap-alternatives", async (req, res) => {
    try {
      const swapRequest = swapRequestSchema.parse(req.body);
      const alternatives = getSwapAlternatives(
        swapRequest.currentActivity, 
        "Hawaii" // In a real app, this would come from the itinerary
      );
      res.json({ alternatives });
    } catch (error) {
      console.error("Error getting swap alternatives:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to get alternatives" 
      });
    }
  });

  // Swap activity
  app.post("/api/trip/swap", async (req, res) => {
    try {
      const { itineraryId, dayNumber, timeSlot, newActivity } = req.body;
      
      const itinerary = await storage.getItinerary(itineraryId);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }

      // Update the specific activity
      const day = itinerary.days.find(d => d.dayNumber === dayNumber);
      if (!day) {
        return res.status(404).json({ message: "Day not found" });
      }

      const oldActivity = day.activities[timeSlot as keyof typeof day.activities];
      day.activities[timeSlot as keyof typeof day.activities] = newActivity;
      
      // Recalculate day cost
      day.totalCost = day.activities.morning.cost + day.activities.afternoon.cost + day.activities.evening.cost;
      
      // Recalculate total cost
      itinerary.totalCost = itinerary.days.reduce((sum, d) => sum + d.totalCost, 0);
      
      const updatedItinerary = await storage.updateItinerary(itineraryId, itinerary);
      
      res.json({ 
        success: true, 
        itinerary: updatedItinerary,
        swapDetails: {
          oldActivity: oldActivity.name,
          newActivity: newActivity.name,
          costDifference: newActivity.cost - oldActivity.cost
        }
      });
    } catch (error) {
      console.error("Error swapping activity:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to swap activity" 
      });
    }
  });

  // Chat endpoint
  app.post("/api/chat/message", async (req, res) => {
    try {
      const { message, itineraryId } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get current itinerary and chat history
      const itinerary = itineraryId ? await storage.getItinerary(itineraryId) : null;
      const chatHistory = await storage.getChatHistory(itineraryId || "current");

      // Process message with OpenAI
      const aiResponse = await openaiService.processUserMessage(message, itinerary, chatHistory);

      // Save user message
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        type: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };
      await storage.saveChatMessage(userMessage);

      // Save assistant response
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        type: "assistant",
        content: aiResponse.response,
        timestamp: new Date().toISOString(),
        context: {
          itineraryModified: aiResponse.itineraryModified,
          modificationDetails: aiResponse.modificationDetails,
        },
      };
      await storage.saveChatMessage(assistantMessage);

      res.json({ 
        message: assistantMessage,
        itineraryModified: aiResponse.itineraryModified 
      });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ 
        message: "Failed to process message" 
      });
    }
  });

  // Get chat history
  app.get("/api/chat/history/:itineraryId?", async (req, res) => {
    try {
      const itineraryId = req.params.itineraryId || "current";
      const history = await storage.getChatHistory(itineraryId);
      res.json({ messages: history });
    } catch (error) {
      console.error("Error getting chat history:", error);
      res.status(500).json({ message: "Failed to get chat history" });
    }
  });

  // Submit rating
  app.post("/api/rating", async (req, res) => {
    try {
      const ratingData = ratingSchema.parse(req.body);
      const savedRating = await storage.saveRating(ratingData);
      res.json(savedRating);
    } catch (error) {
      console.error("Error saving rating:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to save rating" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Itinerary generation logic
async function generateItinerary(formData: TripForm): Promise<Itinerary> {
  const activities = getActivitiesForDestination(formData.destination);
  
  // This check is no longer needed since getActivitiesForDestination now always returns activities
  // (either specific ones or generic fallbacks)
  
  const itinerary = await storage.createItinerary(formData);
  
  // Generate days based on trip length
  const days = [];
  const dailyBudget = formData.budget / formData.tripLength;
  
  for (let dayNum = 1; dayNum <= formData.tripLength; dayNum++) {
    const morningActivities = activities.filter(a => 
      (a.subcategory === "beach" || a.subcategory === "hiking" || a.subcategory === "tours") &&
      a.cost <= dailyBudget * 0.4
    );
    
    const afternoonActivities = activities.filter(a => 
      (a.subcategory === "cultural" || a.subcategory === "water_sports" || a.subcategory === "historical") &&
      a.cost <= dailyBudget * 0.4
    );
    
    const eveningActivities = activities.filter(a => 
      (a.category === "dining" || a.subcategory === "nightlife" || a.subcategory === "cruise") &&
      a.cost <= dailyBudget * 0.6
    );

    // Select random activities for each time slot
    const morning = morningActivities[Math.floor(Math.random() * morningActivities.length)] || activities[0];
    const afternoon = afternoonActivities[Math.floor(Math.random() * afternoonActivities.length)] || activities[1];
    const evening = eveningActivities[Math.floor(Math.random() * eveningActivities.length)] || activities[2];

    const dayTotalCost = morning.cost + afternoon.cost + evening.cost;
    const dayTotalDuration = morning.duration + afternoon.duration + evening.duration;

    days.push({
      dayNumber: dayNum,
      date: new Date(Date.now() + (dayNum - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      activities: {
        morning,
        afternoon,
        evening,
      },
      totalCost: dayTotalCost,
      totalDuration: dayTotalDuration,
    });
  }

  const totalCost = days.reduce((sum, day) => sum + day.totalCost, 0);
  
  // Ensure total cost is within ±5% of budget
  const budgetVariance = Math.abs(totalCost - formData.budget) / formData.budget;
  if (budgetVariance > 0.05) {
    // Adjust costs by scaling activities
    const scaleFactor = formData.budget / totalCost;
    days.forEach(day => {
      day.totalCost = Math.round(day.totalCost * scaleFactor);
    });
  }

  itinerary.days = days;
  itinerary.totalCost = days.reduce((sum, day) => sum + day.totalCost, 0);
  
  return await storage.updateItinerary(itinerary.id, itinerary);
}
