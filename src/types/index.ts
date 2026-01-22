export interface LocalizedString {
  id: string;
  en: string;
}

export interface EventSchedule {
  time: string;
  activity: string; // Keep simple or localized? Let's keep simple for schedule
}

export interface Event {
  id: string;
  title: LocalizedString;
  location: string;
  date: string;
  description: LocalizedString;
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
  title: LocalizedString;
  duration: string;
  price: number;
  location: string;
  rating: number;
  ecoRating: 1 | 2 | 3 | 4 | 5;
  description: LocalizedString;
  imageUrl: string;
  facilities: string[]; // Could be localized, but array of strings is tricky. Let's assume ID for now or string[]
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
  role: string;
  avatarUrl: string;
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
}
