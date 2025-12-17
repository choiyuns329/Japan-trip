export interface Flight {
  id: string;
  type: 'outbound' | 'inbound';
  airline: string;
  flightNumber: string;
  departureTime: string; // ISO string or simple time string
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  price: number;
}

export interface Accommodation {
  id: string;
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  price: number;
  notes: string;
}

export interface Activity {
  id: string;
  day: number;
  time: string;
  title: string;
  location: string;
  description: string;
  cost: number;
}

export interface Transportation {
  id: string;
  type: 'rental' | 'train' | 'bus' | 'taxi' | 'other';
  details: string; // e.g., "JR Pass" or "Toyota Rental"
  pickupLocation: string;
  cost: number;
}

export interface TripData {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  flights: Flight[];
  accommodations: Accommodation[];
  activities: Activity[];
  transportation: Transportation[];
}

export const initialTripData: TripData = {
  title: "즐거운 여행 계획",
  destination: "",
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  budget: 1000000,
  flights: [],
  accommodations: [],
  activities: [],
  transportation: []
};