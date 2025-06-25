export interface LocalStorageKeys {
  TRIP_FORM: 'tripPlannerForm';
  ITINERARY: 'tripPlannerItinerary';
  CHAT_HISTORY: 'tripPlannerChat';
  RATINGS: 'tripPlannerRatings';
  USER_ACTIONS: 'tripPlannerActions';
}

export interface UserAction {
  id: string;
  type: 'swap' | 'chat' | 'rating' | 'form_submit';
  timestamp: string;
  details: Record<string, any>;
}

export interface AppState {
  currentItinerary: string | null;
  isGenerating: boolean;
  error: string | null;
}
