export interface EventSchedule {
  time: string;
  activity: string;
}

export interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  imageUrl: string;
  category: 'Culture' | 'Nature' | 'Sustainability' | 'Culinary';
  tags: string[];
  price?: string;
  organizer?: string;
  ticketCount?: number;
  schedule?: EventSchedule[];
  gallery?: string[];
}

export interface TourPackage {
  id: string;
  title: string;
  duration: string; // e.g., "3D2N"
  price: number;
  location: string;
  rating: number; // General user rating 1-5
  ecoRating: 1 | 2 | 3 | 4 | 5; // 5 is highest
  description: string;
  imageUrl: string;
  facilities: string[];
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  type: 'Transport' | 'Activity' | 'Meal' | 'Rest';
}

export interface DailyItinerary {
  day: number;
  title: string;
  activities: Activity[];
}

export interface ItineraryDetail {
  id: string;
  packageId: string;
  title: string;
  badges: ('Eco-Friendly' | 'Support Local' | 'Nature' | 'Marine Life' | 'Adventure' | 'Snorkeling' | 'Culture' | 'History' | 'City Tour' | 'Conservation' | 'Wildlife' | 'Exclusive' | 'Luxury' | 'Diving' | 'Honeymoon')[];
  days: DailyItinerary[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // e.g., "Traveler from Jakarta"
  avatarUrl: string;
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
}
