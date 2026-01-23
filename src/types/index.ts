export interface LocalizedString {
  id: string;
  en: string;
}

export interface EventSchedule {
  time: string;
  activity: string;
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
  priceChild?: number;
  organizer?: string;
  ticketCount?: number;
  quota?: number; // Total available slots
  bookedCount?: number; // Currently booked slots
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
  facilities: string[];
  quota?: number; // Total available slots
  bookedCount?: number; // Currently booked slots
  priceChild?: number;
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Customer';
  joinDate: string;
  avatar: string;
  totalSpent: number;
  status: 'Active' | 'Inactive';
}

export interface TravelerDetail {
  type: 'Adult' | 'Child';
  title: 'Mr' | 'Mrs' | 'Ms' | 'Dr';
  fullName: string;
  idType?: 'KTP' | 'Passport';
  idNumber?: string;
  nationality?: string;
  age?: number;
}

export interface Booking {
  id: string;
  userId: string;
  productId: string;
  productType: 'Package' | 'Event';
  productName: string; // Denormalized for ease
  date: string;
  amount: number;
  adultCount: number;
  childCount: number;
  totalPax: number;
  travelers: TravelerDetail[]; // Detailed info for each pax
  status: 'Pending' | 'Paid' | 'Cancelled' | 'Completed';
  paymentMethod: 'Credit Card' | 'Bank Transfer' | 'E-Wallet';
  customerName: string; // Denormalized
  productImage?: string; // Denormalized
  location?: string; // Denormalized
}
