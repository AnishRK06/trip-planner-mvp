import { Activity } from "@shared/schema";

export const mockActivitiesData: Record<string, Activity[]> = {
  "Hawaii": [
    // Morning Activities
    {
      id: "hawaii_beach_waikiki",
      name: "Beach Day at Waikiki",
      description: "Relax and swim at Hawaii's most famous beach",
      cost: 0,
      duration: 3,
      category: "activity",
      subcategory: "beach",
      rating: 4.7,
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      location: "Waikiki Beach"
    },
    {
      id: "hawaii_hike_diamond",
      name: "Diamond Head Hike",
      description: "Iconic crater hike with panoramic views",
      cost: 5,
      duration: 2.5,
      category: "activity",
      subcategory: "hiking",
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306",
      location: "Diamond Head State Monument"
    },
    {
      id: "hawaii_snorkel_hanauma",
      name: "Snorkeling at Hanauma Bay",
      description: "Swim with tropical fish in pristine waters",
      cost: 25,
      duration: 4,
      category: "activity",
      subcategory: "water_sports",
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
      location: "Hanauma Bay Nature Preserve"
    },
    {
      id: "hawaii_kayak_adventure",
      name: "Kayaking Adventure",
      description: "Paddle through calm waters and explore hidden coves",
      cost: 75,
      duration: 2.5,
      category: "activity",
      subcategory: "water_sports",
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c",
      location: "Kailua Bay"
    },
    {
      id: "hawaii_cultural_center",
      name: "Polynesian Cultural Center",
      description: "Immersive cultural experience with traditional villages",
      cost: 95,
      duration: 4,
      category: "activity",
      subcategory: "cultural",
      rating: 4.6,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
      location: "Laie"
    },
    {
      id: "hawaii_submarine_tour",
      name: "Atlantis Submarine Adventure",
      description: "Underwater adventure to see coral reefs and marine life",
      cost: 109,
      duration: 1.5,
      category: "activity",
      subcategory: "tours",
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
      location: "Waikiki"
    },
    {
      id: "hawaii_helicopter_tour",
      name: "Helicopter Island Tour",
      description: "Aerial views of volcanoes, waterfalls, and coastlines",
      cost: 200,
      duration: 1,
      category: "activity",
      subcategory: "tours",
      rating: 4.9,
      location: "Honolulu"
    },
    {
      id: "hawaii_surfing_lesson",
      name: "Surfing Lesson",
      description: "Learn to surf with professional instructors",
      cost: 85,
      duration: 2,
      category: "activity",
      subcategory: "water_sports",
      rating: 4.7,
      location: "Waikiki Beach"
    },
    // Afternoon Activities
    {
      id: "hawaii_market_chinatown",
      name: "Chinatown Market Tour",
      description: "Explore local vendors and authentic cuisine",
      cost: 40,
      duration: 2,
      category: "activity",
      subcategory: "cultural",
      rating: 4.5,
      imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9",
      location: "Chinatown"
    },
    {
      id: "hawaii_pearl_harbor",
      name: "Pearl Harbor Historic Tour",
      description: "Visit the historic World War II memorial site",
      cost: 35,
      duration: 4,
      category: "activity",
      subcategory: "historical",
      rating: 4.8,
      location: "Pearl Harbor"
    },
    {
      id: "hawaii_botanical_garden",
      name: "Lyon Arboretum Hike",
      description: "Explore tropical plants and peaceful trails",
      cost: 5,
      duration: 2.5,
      category: "activity",
      subcategory: "nature",
      rating: 4.6,
      location: "Manoa Valley"
    },
    // Evening Activities
    {
      id: "hawaii_dinner_dukes",
      name: "Duke's Waikiki Dinner",
      description: "Oceanfront dining with fresh seafood",
      cost: 120,
      duration: 2,
      category: "dining",
      subcategory: "seafood",
      rating: 4.6,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947",
      location: "Waikiki"
    },
    {
      id: "hawaii_luau_traditional",
      name: "Traditional Luau Experience",
      description: "Authentic Hawaiian cultural dinner show",
      cost: 220,
      duration: 3,
      category: "dining",
      subcategory: "cultural",
      rating: 4.7,
      location: "Ko Olina"
    },
    {
      id: "hawaii_sunset_cruise",
      name: "Sunset Dinner Cruise",
      description: "Romantic dinner cruise with ocean views",
      cost: 150,
      duration: 3,
      category: "activity",
      subcategory: "cruise",
      rating: 4.8,
      location: "Honolulu Harbor"
    },
    {
      id: "hawaii_nightlife_honolulu",
      name: "Honolulu Nightlife Tour",
      description: "Experience the best bars and live music venues",
      cost: 80,
      duration: 4,
      category: "activity",
      subcategory: "nightlife",
      rating: 4.4,
      location: "Honolulu"
    },
    {
      id: "hawaii_fine_dining_orchids",
      name: "Orchids Restaurant",
      description: "Upscale dining with Hawaiian fusion cuisine",
      cost: 180,
      duration: 2.5,
      category: "dining",
      subcategory: "fine_dining",
      rating: 4.9,
      location: "Waikiki"
    }
  ],
  "Paris": [
    {
      id: "paris_eiffel_tower",
      name: "Eiffel Tower Visit",
      description: "Iconic iron tower with city views",
      cost: 25,
      duration: 2,
      category: "activity",
      subcategory: "landmark",
      rating: 4.8,
      location: "Champ de Mars"
    },
    {
      id: "paris_louvre_museum",
      name: "Louvre Museum",
      description: "World's largest art museum",
      cost: 17,
      duration: 4,
      category: "activity",
      subcategory: "museum",
      rating: 4.7,
      location: "1st Arrondissement"
    },
    {
      id: "paris_seine_cruise",
      name: "Seine River Cruise",
      description: "Scenic boat tour through the heart of Paris",
      cost: 45,
      duration: 1.5,
      category: "activity",
      subcategory: "cruise",
      rating: 4.6,
      location: "Seine River"
    },
    {
      id: "paris_montmartre_walk",
      name: "Montmartre Walking Tour",
      description: "Explore the artistic heart of Paris",
      cost: 15,
      duration: 3,
      category: "activity",
      subcategory: "cultural",
      rating: 4.7,
      location: "Montmartre"
    },
    {
      id: "paris_cafe_dinner",
      name: "Traditional French Bistro",
      description: "Authentic French cuisine experience",
      cost: 65,
      duration: 2,
      category: "dining",
      subcategory: "local",
      rating: 4.6,
      location: "Latin Quarter"
    },
    {
      id: "paris_nightlife",
      name: "Champs-Élysées Nightlife",
      description: "Experience Parisian nightlife scene",
      cost: 80,
      duration: 4,
      category: "activity",
      subcategory: "nightlife",
      rating: 4.4,
      location: "Champs-Élysées"
    }
  ],
  "Iceland": [
    {
      id: "iceland_blue_lagoon",
      name: "Blue Lagoon Geothermal Spa",
      description: "Relax in natural geothermal waters",
      cost: 90,
      duration: 3,
      category: "activity",
      subcategory: "nature",
      rating: 4.8,
      location: "Grindavík"
    },
    {
      id: "iceland_northern_lights",
      name: "Northern Lights Tour",
      description: "Chase the aurora borealis",
      cost: 120,
      duration: 4,
      category: "activity",
      subcategory: "tours",
      rating: 4.9,
      location: "Reykjavik"
    },
    {
      id: "iceland_golden_circle",
      name: "Golden Circle Tour",
      description: "Visit geysers, waterfalls, and national parks",
      cost: 85,
      duration: 8,
      category: "activity",
      subcategory: "tours",
      rating: 4.8,
      location: "Thingvellir"
    },
    {
      id: "iceland_glacier_hike",
      name: "Glacier Hiking Adventure",
      description: "Explore pristine glacial landscapes",
      cost: 150,
      duration: 6,
      category: "activity",
      subcategory: "hiking",
      rating: 4.9,
      location: "Vatnajökull"
    },
    {
      id: "iceland_seafood_restaurant",
      name: "Reykjavik Seafood House",
      description: "Fresh Atlantic seafood dining",
      cost: 110,
      duration: 2,
      category: "dining",
      subcategory: "seafood",
      rating: 4.7,
      location: "Reykjavik"
    },
    {
      id: "iceland_viking_museum",
      name: "National Museum of Iceland",
      description: "Learn about Viking history and culture",
      cost: 20,
      duration: 3,
      category: "activity",
      subcategory: "museum",
      rating: 4.5,
      location: "Reykjavik"
    }
  ],
  "Tokyo": [
    {
      id: "tokyo_temple_visit",
      name: "Senso-ji Temple",
      description: "Ancient Buddhist temple in Asakusa",
      cost: 0,
      duration: 2,
      category: "activity",
      subcategory: "cultural",
      rating: 4.8,
      location: "Asakusa"
    },
    {
      id: "tokyo_sushi_dinner",
      name: "Traditional Sushi Experience",
      description: "Authentic sushi at a traditional restaurant",
      cost: 180,
      duration: 2,
      category: "dining",
      subcategory: "asian",
      rating: 4.9,
      location: "Ginza"
    },
    {
      id: "tokyo_shibuya_crossing",
      name: "Shibuya Crossing Experience",
      description: "Experience the world's busiest intersection",
      cost: 0,
      duration: 1,
      category: "activity",
      subcategory: "landmark",
      rating: 4.6,
      location: "Shibuya"
    },
    {
      id: "tokyo_mount_fuji_tour",
      name: "Mount Fuji Day Trip",
      description: "Visit Japan's iconic mountain",
      cost: 200,
      duration: 10,
      category: "activity",
      subcategory: "tours",
      rating: 4.8,
      location: "Mount Fuji"
    },
    {
      id: "tokyo_karaoke_night",
      name: "Karaoke Night in Shinjuku",
      description: "Sing the night away in private karaoke rooms",
      cost: 50,
      duration: 3,
      category: "activity",
      subcategory: "nightlife",
      rating: 4.7,
      location: "Shinjuku"
    },
    {
      id: "tokyo_ramen_tour",
      name: "Ramen Walking Tour",
      description: "Taste authentic ramen at local shops",
      cost: 75,
      duration: 3,
      category: "dining",
      subcategory: "asian",
      rating: 4.8,
      location: "Shibuya"
    }
  ],
  "New York": [
    {
      id: "nyc_central_park",
      name: "Central Park Stroll",
      description: "Walk through Manhattan's green oasis",
      cost: 0,
      duration: 2,
      category: "activity",
      subcategory: "nature",
      rating: 4.7,
      location: "Central Park"
    },
    {
      id: "nyc_broadway_show",
      name: "Broadway Musical",
      description: "Experience world-class theater",
      cost: 150,
      duration: 3,
      category: "activity",
      subcategory: "cultural",
      rating: 4.9,
      location: "Times Square"
    },
    {
      id: "nyc_pizza_tour",
      name: "NYC Pizza Walking Tour",
      description: "Taste authentic New York pizza slices",
      cost: 65,
      duration: 3,
      category: "dining",
      subcategory: "american",
      rating: 4.6,
      location: "Brooklyn"
    },
    {
      id: "nyc_statue_liberty",
      name: "Statue of Liberty Ferry",
      description: "Visit America's symbol of freedom",
      cost: 30,
      duration: 4,
      category: "activity",
      subcategory: "landmark",
      rating: 4.8,
      location: "Liberty Island"
    },
    {
      id: "nyc_rooftop_bar",
      name: "Manhattan Rooftop Bar",
      description: "Cocktails with skyline views",
      cost: 120,
      duration: 3,
      category: "activity",
      subcategory: "nightlife",
      rating: 4.5,
      location: "Manhattan"
    },
    {
      id: "nyc_fine_dining",
      name: "Michelin Star Restaurant",
      description: "World-class fine dining experience",
      cost: 250,
      duration: 3,
      category: "dining",
      subcategory: "fine_dining",
      rating: 4.8,
      location: "Manhattan"
    }
  ]
};

// Generic fallback activities for destinations without specific data
const genericActivities: Activity[] = [
  {
    id: "generic_city_walk",
    name: "City Walking Tour",
    description: "Explore the historic downtown area and main landmarks",
    cost: 25,
    duration: 3,
    category: "activity",
    subcategory: "cultural",
    rating: 4.5,
    location: "City Center"
  },
  {
    id: "generic_local_restaurant",
    name: "Local Restaurant Experience",
    description: "Taste authentic local cuisine at a recommended restaurant",
    cost: 60,
    duration: 2,
    category: "dining",
    subcategory: "local",
    rating: 4.4,
    location: "Downtown"
  },
  {
    id: "generic_museum",
    name: "Local History Museum",
    description: "Learn about the area's culture and history",
    cost: 15,
    duration: 2.5,
    category: "activity",
    subcategory: "museum",
    rating: 4.3,
    location: "Cultural District"
  },
  {
    id: "generic_nature_activity",
    name: "Scenic Nature Experience",
    description: "Enjoy the natural beauty of the surrounding area",
    cost: 30,
    duration: 4,
    category: "activity",
    subcategory: "nature",
    rating: 4.6,
    location: "Natural Area"
  },
  {
    id: "generic_market_visit",
    name: "Local Market Visit",
    description: "Browse local vendors and artisan shops",
    cost: 20,
    duration: 2,
    category: "activity",
    subcategory: "cultural",
    rating: 4.2,
    location: "Market District"
  },
  {
    id: "generic_nightlife",
    name: "Evening Entertainment",
    description: "Experience the local nightlife scene",
    cost: 75,
    duration: 3,
    category: "activity",
    subcategory: "nightlife",
    rating: 4.1,
    location: "Entertainment District"
  },
  {
    id: "generic_cafe_lunch",
    name: "Local Café Lunch",
    description: "Casual dining at a popular local café",
    cost: 35,
    duration: 1.5,
    category: "dining",
    subcategory: "local",
    rating: 4.3,
    location: "Café District"
  },
  {
    id: "generic_guided_tour",
    name: "Guided City Tour",
    description: "Professional guide shows you the highlights",
    cost: 50,
    duration: 3,
    category: "activity",
    subcategory: "tours",
    rating: 4.5,
    location: "Various Locations"
  },
  {
    id: "generic_fine_dining",
    name: "Upscale Dinner Experience",
    description: "High-quality dining at a recommended restaurant",
    cost: 120,
    duration: 2.5,
    category: "dining",
    subcategory: "fine_dining",
    rating: 4.7,
    location: "Fine Dining District"
  }
];

export function getActivitiesForDestination(destination: string): Activity[] {
  // First try to get specific activities for the destination
  const specificActivities = mockActivitiesData[destination];
  
  if (specificActivities && specificActivities.length > 0) {
    return specificActivities;
  }
  
  // If no specific activities found, return customized generic activities
  return genericActivities.map(activity => ({
    ...activity,
    id: `${destination.toLowerCase().replace(/\s+/g, '_')}_${activity.id}`,
    description: activity.description.replace(/the area|local/, destination),
    location: activity.location === "Various Locations" ? destination : `${destination} ${activity.location}`
  }));
}

export function getSwapAlternatives(currentActivity: Activity, destination: string): Activity[] {
  const allActivities = getActivitiesForDestination(destination);
  const alternatives = allActivities.filter(activity => {
    // Filter by category and cost/time constraints
    const costDiff = Math.abs(activity.cost - currentActivity.cost) / currentActivity.cost;
    const timeDiff = Math.abs(activity.duration - currentActivity.duration) / currentActivity.duration;
    
    return (
      activity.id !== currentActivity.id &&
      activity.category === currentActivity.category &&
      costDiff <= 0.1 && // ±10% cost
      timeDiff <= 0.15   // ±15% time
    );
  });
  
  // Return up to 5 alternatives
  return alternatives.slice(0, 5);
}
