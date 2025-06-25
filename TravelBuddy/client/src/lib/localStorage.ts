import { TripForm, Itinerary, ChatMessage, Rating } from "@shared/schema";
import { UserAction } from "./types";

export class LocalStorageManager {
  private static instance: LocalStorageManager;
  
  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  saveFormData(formData: TripForm): void {
    try {
      window.localStorage.setItem('tripPlannerForm', JSON.stringify(formData));
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  }

  loadFormData(): TripForm | null {
    try {
      const data = window.localStorage.getItem('tripPlannerForm');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load form data:', error);
      return null;
    }
  }

  saveItinerary(itinerary: Itinerary): void {
    try {
      window.localStorage.setItem('tripPlannerItinerary', JSON.stringify(itinerary));
      window.localStorage.setItem('currentItineraryId', itinerary.id);
    } catch (error) {
      console.error('Failed to save itinerary:', error);
    }
  }

  loadItinerary(): Itinerary | null {
    try {
      const data = window.localStorage.getItem('tripPlannerItinerary');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load itinerary:', error);
      return null;
    }
  }

  saveChatHistory(messages: ChatMessage[]): void {
    try {
      window.localStorage.setItem('tripPlannerChat', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  loadChatHistory(): ChatMessage[] {
    try {
      const data = window.localStorage.getItem('tripPlannerChat');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load chat history:', error);
      return [];
    }
  }

  saveRating(rating: Rating): void {
    try {
      const existing = this.loadRatings();
      existing.push(rating);
      window.localStorage.setItem('tripPlannerRatings', JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to save rating:', error);
    }
  }

  loadRatings(): Rating[] {
    try {
      const data = window.localStorage.getItem('tripPlannerRatings');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load ratings:', error);
      return [];
    }
  }

  logUserAction(action: Omit<UserAction, 'id' | 'timestamp'>): void {
    try {
      const userAction: UserAction = {
        id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...action
      };
      
      const existing = this.loadUserActions();
      existing.push(userAction);
      
      // Keep only last 100 actions
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100);
      }
      
      window.localStorage.setItem('tripPlannerActions', JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to log user action:', error);
    }
  }

  loadUserActions(): UserAction[] {
    try {
      const data = window.localStorage.getItem('tripPlannerActions');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load user actions:', error);
      return [];
    }
  }

  clearAllData(): void {
    const keys = [
      'tripPlannerForm',
      'tripPlannerItinerary', 
      'tripPlannerChat',
      'tripPlannerRatings',
      'tripPlannerActions',
      'currentItineraryId'
    ];
    
    keys.forEach(key => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to clear ${key}:`, error);
      }
    });
  }
}

export const localStorage = LocalStorageManager.getInstance();
