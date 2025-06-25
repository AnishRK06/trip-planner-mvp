import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Trip Form Schema
export const tripFormSchema = z.object({
  budget: z.number().min(100, "Budget must be at least $100"),
  tripLength: z.number().min(1).max(30),
  partySize: z.number().min(1).max(20),
  destination: z.string().min(1, "Destination is required"),
  transportModes: z.array(z.enum(["walking", "driving", "public", "rideshare"])),
  cuisinePreferences: z.array(z.enum(["local", "italian", "asian", "seafood", "vegetarian", "mediterranean", "mexican", "american"])),
});

// Activity Schema
export const activitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  cost: z.number(),
  duration: z.number(), // in hours
  category: z.enum(["dining", "activity", "transport", "accommodation"]),
  subcategory: z.string(),
  rating: z.number().min(0).max(5),
  imageUrl: z.string().optional(),
  location: z.string().optional(),
});

// Day Schema
export const daySchema = z.object({
  dayNumber: z.number(),
  date: z.string(),
  activities: z.object({
    morning: activitySchema,
    afternoon: activitySchema,
    evening: activitySchema,
  }),
  totalCost: z.number(),
  totalDuration: z.number(),
});

// Itinerary Schema
export const itinerarySchema = z.object({
  id: z.string(),
  days: z.array(daySchema),
  totalCost: z.number(),
  destination: z.string(),
  partySize: z.number(),
  createdAt: z.string(),
});

// Chat Message Schema
export const chatMessageSchema = z.object({
  id: z.string(),
  type: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.string(),
  context: z.object({
    itineraryModified: z.boolean().optional(),
    modificationDetails: z.string().optional(),
  }).optional(),
});

// Rating Schema
export const ratingSchema = z.object({
  id: z.string(),
  itineraryId: z.string(),
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
  timestamp: z.string(),
});

// Swap Request Schema
export const swapRequestSchema = z.object({
  activityId: z.string(),
  dayNumber: z.number(),
  timeSlot: z.enum(["morning", "afternoon", "evening"]),
  currentActivity: activitySchema,
});

// Database Tables
export const itineraries = pgTable("itineraries", {
  id: text("id").primaryKey(),
  destination: text("destination").notNull(),
  partySize: integer("party_size").notNull(),
  totalCost: integer("total_cost").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  days: jsonb("days").notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: text("id").primaryKey(),
  itineraryId: text("itinerary_id").notNull(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  context: jsonb("context"),
});

export const ratings = pgTable("ratings", {
  id: text("id").primaryKey(),
  itineraryId: text("itinerary_id").notNull(),
  rating: integer("rating").notNull(),
  feedback: text("feedback"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Relations
export const itinerariesRelations = relations(itineraries, ({ many }) => ({
  chatMessages: many(chatMessages),
  ratings: many(ratings),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  itinerary: one(itineraries, {
    fields: [chatMessages.itineraryId],
    references: [itineraries.id],
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  itinerary: one(itineraries, {
    fields: [ratings.itineraryId],
    references: [itineraries.id],
  }),
}));

// Insert schemas
export const insertItinerarySchema = createInsertSchema(itineraries);
export const insertChatMessageSchema = createInsertSchema(chatMessages);
export const insertRatingSchema = createInsertSchema(ratings);

// Export types
export type TripForm = z.infer<typeof tripFormSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type Day = z.infer<typeof daySchema>;
export type Itinerary = z.infer<typeof itinerarySchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type Rating = z.infer<typeof ratingSchema>;
export type SwapRequest = z.infer<typeof swapRequestSchema>;

// Database types
export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type InsertRating = z.infer<typeof insertRatingSchema>;
