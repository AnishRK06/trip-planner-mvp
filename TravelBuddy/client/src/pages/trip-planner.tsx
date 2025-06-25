import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Route, MapPin, Clock, Bookmark, History } from "lucide-react";
import TripForm from "@/components/TripForm";
import ItineraryDisplay from "@/components/ItineraryDisplay";
import ChatWidget from "@/components/ChatWidget";
import SwapModal from "@/components/SwapModal";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Itinerary, Activity } from "@shared/schema";
import { localStorage } from "@/lib/localStorage";

export default function TripPlanner() {
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [swapModal, setSwapModal] = useState<{
    isOpen: boolean;
    activityId: string | null;
    dayNumber: number | null;
    timeSlot: string | null;
    currentActivity: Activity | null;
  }>({
    isOpen: false,
    activityId: null,
    dayNumber: null,
    timeSlot: null,
    currentActivity: null,
  });
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const savedItinerary = localStorage.loadItinerary();
    if (savedItinerary) {
      setCurrentItinerary(savedItinerary);
    }
  }, []);

  const handleItineraryGenerated = (itinerary: Itinerary) => {
    setCurrentItinerary(itinerary);
    localStorage.saveItinerary(itinerary);
    setIsGenerating(false);
  };

  const handleSwapActivity = (
    activityId: string, 
    dayNumber: number, 
    timeSlot: string, 
    currentActivity: Activity
  ) => {
    setSwapModal({
      isOpen: true,
      activityId,
      dayNumber,
      timeSlot,
      currentActivity,
    });
  };

  const handleSwapConfirmed = (newActivity: Activity) => {
    if (!currentItinerary || !swapModal.dayNumber || !swapModal.timeSlot) return;

    const updatedItinerary = { ...currentItinerary };
    const day = updatedItinerary.days.find(d => d.dayNumber === swapModal.dayNumber);
    
    if (day) {
      const oldActivity = day.activities[swapModal.timeSlot as keyof typeof day.activities];
      day.activities[swapModal.timeSlot as keyof typeof day.activities] = newActivity;
      
      // Recalculate costs
      day.totalCost = day.activities.morning.cost + day.activities.afternoon.cost + day.activities.evening.cost;
      updatedItinerary.totalCost = updatedItinerary.days.reduce((sum, d) => sum + d.totalCost, 0);
      
      setCurrentItinerary(updatedItinerary);
      localStorage.saveItinerary(updatedItinerary);
      
      // Log the swap action
      localStorage.logUserAction({
        type: 'swap',
        details: {
          dayNumber: swapModal.dayNumber,
          timeSlot: swapModal.timeSlot,
          oldActivity: oldActivity.name,
          newActivity: newActivity.name,
          costDifference: newActivity.cost - oldActivity.cost,
        },
      });
    }

    setSwapModal({
      isOpen: false,
      activityId: null,
      dayNumber: null,
      timeSlot: null,
      currentActivity: null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Route className="text-primary text-2xl" />
              <h1 className="text-2xl font-bold text-slate-800">TripPlanner</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                <History className="w-4 h-4 mr-2" />
                Trip History
              </Button>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                <Bookmark className="w-4 h-4 mr-2" />
                Saved
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mobile-stack lg:desktop-grid lg:grid">
          
          {/* Trip Planning Form */}
          <div className="lg:col-span-4 mb-8 lg:mb-0">
            <TripForm 
              onItineraryGenerated={handleItineraryGenerated}
              onGeneratingChange={setIsGenerating}
            />
          </div>

          {/* Generated Itinerary */}
          <div className="lg:col-span-5 mb-8 lg:mb-0">
            <ItineraryDisplay 
              itinerary={currentItinerary}
              onSwapActivity={handleSwapActivity}
              isGenerating={isGenerating}
            />
          </div>

          {/* AI Chat Assistant */}
          <div className="lg:col-span-3">
            <div className={`lg:block ${isMobileChatOpen ? 'block' : 'hidden'}`}>
              <ChatWidget 
                itinerary={currentItinerary}
                onClose={() => setIsMobileChatOpen(false)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Swap Modal */}
      <SwapModal
        isOpen={swapModal.isOpen}
        currentActivity={swapModal.currentActivity}
        onClose={() => setSwapModal({ 
          isOpen: false, 
          activityId: null, 
          dayNumber: null, 
          timeSlot: null, 
          currentActivity: null 
        })}
        onSwap={handleSwapConfirmed}
      />

      {/* Loading Overlay */}
      <LoadingOverlay 
        isVisible={isGenerating}
        title="Planning Your Trip"
        message="Finding the best activities and optimizing your itinerary..."
      />

      {/* Mobile Chat Toggle */}
      <Button
        className="lg:hidden fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg z-40"
        onClick={() => setIsMobileChatOpen(!isMobileChatOpen)}
      >
        <MapPin className="w-6 h-6" />
      </Button>
    </div>
  );
}
