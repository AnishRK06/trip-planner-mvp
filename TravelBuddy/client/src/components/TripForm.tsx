import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ClipboardList, Dice1 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { tripFormSchema, type TripForm, type Itinerary } from "@shared/schema";
import { localStorage } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";

interface TripFormProps {
  onItineraryGenerated: (itinerary: Itinerary) => void;
  onGeneratingChange: (isGenerating: boolean) => void;
}

const transportOptions = [
  { id: "walking", label: "Walking", icon: "🚶" },
  { id: "driving", label: "Driving", icon: "🚗" },
  { id: "public", label: "Public", icon: "🚌" },
  { id: "rideshare", label: "Rideshare", icon: "🚕" },
];

const cuisineOptions = [
  { id: "local", label: "Local" },
  { id: "italian", label: "Italian" },
  { id: "asian", label: "Asian" },
  { id: "seafood", label: "Seafood" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "mediterranean", label: "Mediterranean" },
  { id: "mexican", label: "Mexican" },
  { id: "american", label: "American" },
];

const surpriseDestinations = [
  "Hawaii", "Paris", "Tokyo", "New York", "London", "Barcelona", 
  "Amsterdam", "Rome", "Sydney", "Bali", "Iceland", "Morocco"
];

export default function TripForm({ onItineraryGenerated, onGeneratingChange }: TripFormProps) {
  const { toast } = useToast();
  const [selectedTransport, setSelectedTransport] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string[]>([]);

  const form = useForm<TripForm>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      budget: 2000,
      tripLength: 7,
      partySize: 2,
      destination: "",
      transportModes: [],
      cuisinePreferences: [],
    },
  });

  // Load saved form data on mount
  useEffect(() => {
    const savedFormData = localStorage.loadFormData();
    if (savedFormData) {
      form.reset(savedFormData);
      setSelectedTransport(savedFormData.transportModes);
      setSelectedCuisine(savedFormData.cuisinePreferences);
    }
  }, [form]);

  const createTripMutation = useMutation({
    mutationFn: async (formData: TripForm) => {
      const response = await apiRequest("POST", "/api/trip/create", formData);
      return response.json();
    },
    onMutate: () => {
      onGeneratingChange(true);
    },
    onSuccess: (itinerary: Itinerary) => {
      onItineraryGenerated(itinerary);
      toast({
        title: "Trip Generated!",
        description: `Created a ${itinerary.days.length}-day itinerary for ${itinerary.destination}`,
      });
      
      // Log form submission action
      localStorage.logUserAction({
        type: 'form_submit',
        details: {
          destination: itinerary.destination,
          budget: itinerary.totalCost,
          days: itinerary.days.length,
        },
      });
    },
    onError: (error) => {
      onGeneratingChange(false);
      toast({
        title: "Error",
        description: error.message || "Failed to generate trip",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TripForm) => {
    const formData: TripForm = {
      ...data,
      transportModes: selectedTransport as ("walking" | "driving" | "public" | "rideshare")[],
      cuisinePreferences: selectedCuisine as ("local" | "italian" | "asian" | "seafood" | "vegetarian" | "mediterranean" | "mexican" | "american")[],
    };
    
    // Save form data to localStorage
    localStorage.saveFormData(formData);
    
    createTripMutation.mutate(formData);
  };

  const handleSurpriseMe = () => {
    const randomDestination = surpriseDestinations[Math.floor(Math.random() * surpriseDestinations.length)];
    form.setValue("destination", randomDestination);
  };

  const handleTransportToggle = (transportId: string) => {
    const updated = selectedTransport.includes(transportId)
      ? selectedTransport.filter(id => id !== transportId)
      : [...selectedTransport, transportId];
    setSelectedTransport(updated);
  };

  const handleCuisineToggle = (cuisineId: string) => {
    const updated = selectedCuisine.includes(cuisineId)
      ? selectedCuisine.filter(id => id !== cuisineId)
      : [...selectedCuisine, cuisineId];
    setSelectedCuisine(updated);
  };

  return (
    <Card className="shadow-lg sticky top-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
          <ClipboardList className="mr-2 text-primary" />
          Plan Your Trip
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Budget Field */}
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (USD)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                      <Input
                        type="number"
                        placeholder="2000"
                        className="pl-8"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trip Length */}
            <FormField
              control={form.control}
              name="tripLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trip Length (Days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="7"
                      min="1"
                      max="30"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Party Size */}
            <FormField
              control={form.control}
              name="partySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Travelers</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2"
                      min="1"
                      max="20"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Destination */}
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter destination or 'Surprise Me'"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-600"
                        onClick={handleSurpriseMe}
                      >
                        <Dice1 className="w-4 h-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transport Modes */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">Preferred Transport</Label>
              <div className="grid grid-cols-2 gap-3">
                {transportOptions.map((transport) => (
                  <label 
                    key={transport.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTransport.includes(transport.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Checkbox
                      checked={selectedTransport.includes(transport.id)}
                      onCheckedChange={() => handleTransportToggle(transport.id)}
                      className="mr-3"
                    />
                    <span className="mr-2">{transport.icon}</span>
                    <span className="text-sm">{transport.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cuisine Preferences */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">Cuisine Preferences</Label>
              <div className="flex flex-wrap gap-2">
                {cuisineOptions.map((cuisine) => (
                  <button
                    key={cuisine.id}
                    type="button"
                    onClick={() => handleCuisineToggle(cuisine.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCuisine.includes(cuisine.id)
                        ? 'bg-primary/20 text-primary-700 hover:bg-primary/30'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {cuisine.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={createTripMutation.isPending}
            >
              {createTripMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Planning...
                </div>
              ) : (
                <>
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Plan My Trip
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
