import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Star, RefreshCw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Activity } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface SwapModalProps {
  isOpen: boolean;
  currentActivity: Activity | null;
  onClose: () => void;
  onSwap: (newActivity: Activity) => void;
}

interface AlternativeCardProps {
  activity: Activity;
  currentActivity: Activity;
  onSelect: (activity: Activity) => void;
  isSelected: boolean;
}

function AlternativeCard({ activity, currentActivity, onSelect, isSelected }: AlternativeCardProps) {
  const costDifference = activity.cost - currentActivity.cost;
  const isMore = costDifference > 0;
  const costColor = isMore ? 'text-orange-600' : costDifference < 0 ? 'text-green-600' : 'text-slate-600';

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
        isSelected 
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
          : 'border-slate-200 hover:border-primary/30 hover:bg-primary/5'
      }`}
      onClick={() => onSelect(activity)}
    >
      <div className="flex items-start space-x-4">
        {activity.imageUrl && (
          <img 
            src={`${activity.imageUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100`}
            alt={activity.name}
            className="w-16 h-16 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800">{activity.name}</h4>
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{activity.description}</p>
          
          <div className="flex items-center mt-2 text-sm space-x-4">
            <span className="text-slate-500 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {activity.duration} hours
            </span>
            
            <span className={`font-medium ${costColor}`}>
              ${activity.cost}
            </span>
            
            <span className="text-slate-500 flex items-center">
              <Star className="w-4 h-4 mr-1 text-amber-400 fill-current" />
              {activity.rating}
            </span>
            
            {activity.location && (
              <span className="text-slate-500 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {activity.location}
              </span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-slate-500">Cost difference</div>
          <div className={`text-sm font-medium ${costColor}`}>
            {costDifference === 0 ? 'Same' : `${isMore ? '+' : ''}$${Math.abs(costDifference)}`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SwapModal({ isOpen, currentActivity, onClose, onSwap }: SwapModalProps) {
  const { toast } = useToast();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [alternatives, setAlternatives] = useState<Activity[]>([]);

  const getAlternativesMutation = useMutation({
    mutationFn: async () => {
      if (!currentActivity) throw new Error("No current activity");
      
      const response = await apiRequest("POST", "/api/trip/swap-alternatives", {
        activityId: currentActivity.id,
        dayNumber: 1, // This would come from props in a real app
        timeSlot: "morning", // This would come from props in a real app
        currentActivity,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setAlternatives(data.alternatives || []);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to load alternative activities",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (isOpen && currentActivity) {
      setSelectedActivity(null);
      getAlternativesMutation.mutate();
    }
  }, [isOpen, currentActivity]);

  const handleSwap = () => {
    if (selectedActivity) {
      onSwap(selectedActivity);
      onClose();
      
      toast({
        title: "Activity Swapped!",
        description: `Replaced "${currentActivity?.name}" with "${selectedActivity.name}"`,
      });
    }
  };

  if (!currentActivity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Swap Activity
          </DialogTitle>
          <p className="text-sm text-slate-600">
            Choose an alternative to "{currentActivity.name}" within your budget and time constraints
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {getAlternativesMutation.isPending ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
              <span className="text-slate-600">Finding alternatives...</span>
            </div>
          ) : alternatives.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">No suitable alternatives found within your constraints.</p>
              <p className="text-sm text-slate-500 mt-2">Try adjusting your budget or preferences.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alternatives.map((activity) => (
                <AlternativeCard
                  key={activity.id}
                  activity={activity}
                  currentActivity={currentActivity}
                  onSelect={setSelectedActivity}
                  isSelected={selectedActivity?.id === activity.id}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSwap} 
            disabled={!selectedActivity}
            className="min-w-[120px]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Swap Activity
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
