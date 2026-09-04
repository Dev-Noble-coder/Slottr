import { CalendarDays, Building, Car, Package, Wrench, Grid3x3, Home } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CategoryMeta {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const CATEGORY_META: CategoryMeta[] = [
  { value: 'EVENT', label: 'Events & Experiences', description: 'Party spaces, tournaments, and experience bookings for any occasion.', icon: CalendarDays },
  { value: 'ITEMS', label: 'Items & Equipment', description: 'Cameras, tools, electronics, and gear ready to rent.', icon: Package },
  { value: 'VENUE', label: 'Venues & Event Spaces', description: 'Halls, conference centers, and outdoor spaces.', icon: Building },
  { value: 'RIDES', label: 'Rides & Transport', description: 'Vehicles, bikes, and rides available on demand.', icon: Car },
  { value: 'PROPERTY', label: 'Property & Spaces', description: 'Short stays, apartments, and creative studios.', icon: Home },
  { value: 'SERVICE', label: 'Services', description: 'Book skilled professionals for on-demand services.', icon: Wrench },
  { value: 'OTHERS', label: 'Others', description: "Anything that doesn't fit in a traditional box.", icon: Grid3x3 },
];
