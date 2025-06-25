import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, RefreshCw, Star, Download, Save } from "lucide-react";
import { Itinerary, Activity } from "@shared/schema";
import { localStorage } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";

interface ItineraryDisplayProps {
  itinerary: Itinerary | null;
  onSwapActivity: (activityId: string, dayNumber: number, timeSlot: string, currentActivity: Activity) => void;
  isGenerating: boolean;
}

interface ActivityCardProps {
  timeSlot: string;
  time: string;
  activity: Activity;
  dayNumber: number;
  onSwap: (activityId: string, dayNumber: number, timeSlot: string, currentActivity: Activity) => void;
}

function ActivityCard({ timeSlot, time, activity, dayNumber, onSwap }: ActivityCardProps) {
  return (
    <div className="flex items-start space-x-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
      <div className="text-sm font-medium text-primary min-w-0 w-20">
        <div className="capitalize">{timeSlot}</div>
        <div className="text-xs text-slate-500">{time}</div>
      </div>
      
      {activity.imageUrl && (
        <img 
          src={`${activity.imageUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100`}
          alt={activity.name}
          className="w-12 h-12 rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-slate-800">{activity.name}</h4>
        <p className="text-sm text-slate-600 line-clamp-2">{activity.description}</p>
        <div className="flex items-center mt-1 text-xs text-slate-500">
          <Clock className="w-3 h-3 mr-1" />
          <span>{activity.duration} hours</span>
          <span className="mx-2">•</span>
          <span>${activity.cost}</span>
          {activity.location && (
            <>
              <span className="mx-2">•</span>
              <MapPin className="w-3 h-3 mr-1" />
              <span>{activity.location}</span>
            </>
          )}
        </div>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSwap(activity.id, dayNumber, timeSlot, activity)}
        className="text-slate-600 hover:bg-slate-50"
      >
        <RefreshCw className="w-3 h-3 mr-1" />
        Swap
      </Button>
    </div>
  );
}

function StarRating({ rating, onRate }: { rating: number; onRate: (rating: number) => void }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-lg transition-colors ${
            star <= (hoverRating || rating)
              ? 'text-amber-400 hover:text-amber-500'
              : 'text-slate-300 hover:text-amber-500'
          }`}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <Star className="w-4 h-4 fill-current" />
        </button>
      ))}
    </div>
  );
}

export default function ItineraryDisplay({ itinerary, onSwapActivity, isGenerating }: ItineraryDisplayProps) {
  const { toast } = useToast();
  const [currentRating, setCurrentRating] = useState(0);

  if (isGenerating) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Generating Your Itinerary</h3>
              <p className="text-sm text-slate-600">Finding the perfect activities for your trip...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!itinerary) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <CalendarDays className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Itinerary Yet</h3>
            <p className="text-sm text-slate-600">Fill out the form to generate your personalized trip itinerary.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleRating = (rating: number) => {
    setCurrentRating(rating);
    
    const ratingData = {
      id: `rating_${Date.now()}`,
      itineraryId: itinerary.id,
      rating,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.saveRating(ratingData);
    localStorage.logUserAction({
      type: 'rating',
      details: { rating, itineraryId: itinerary.id },
    });
    
    toast({
      title: "Rating Saved",
      description: `You rated this itinerary ${rating} star${rating === 1 ? '' : 's'}`,
    });
  };

  const handleExport = () => {
    const exportData = {
      itinerary,
      exportedAt: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `trip-itinerary-${itinerary.destination.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Itinerary Exported",
      description: "Your trip details have been downloaded as a JSON file.",
    });
  };

  const timeSlots = {
    morning: "9:00 AM",
    afternoon: "1:00 PM", 
    evening: "7:00 PM",
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center">
            <CalendarDays className="mr-2 text-primary" />
            Your Itinerary
          </h2>
          <Badge variant="secondary" className="text-sm">
            ${itinerary.totalCost} total
          </Badge>
        </div>

        <div className="space-y-6 custom-scrollbar max-h-96 overflow-y-auto">
          {itinerary.days.map((day) => (
            <div key={day.dayNumber} className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                  {day.dayNumber}
                </span>
                Day {day.dayNumber}
                <span className="ml-auto text-sm text-slate-600">${day.totalCost}</span>
              </h3>
              
              <div className="space-y-3">
                <ActivityCard
                  timeSlot="morning"
                  time={timeSlots.morning}
                  activity={day.activities.morning}
                  dayNumber={day.dayNumber}
                  onSwap={onSwapActivity}
                />
                <ActivityCard
                  timeSlot="afternoon"
                  time={timeSlots.afternoon}
                  activity={day.activities.afternoon}
                  dayNumber={day.dayNumber}
                  onSwap={onSwapActivity}
                />
                <ActivityCard
                  timeSlot="evening"
                  time={timeSlots.evening}
                  activity={day.activities.evening}
                  dayNumber={day.dayNumber}
                  onSwap={onSwapActivity}
                />
              </div>
            </div>
          ))}
          
          {itinerary.days.length > 2 && (
            <div className="text-center py-4 text-slate-500">
              <p className="text-sm">
                Showing {Math.min(itinerary.days.length, 2)} of {itinerary.days.length} days
              </p>
            </div>
          )}
        </div>

        {/* Rating and Actions */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-2">Rate this itinerary</p>
              <StarRating rating={currentRating} onRate={handleRating} />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Trip
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
