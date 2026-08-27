import { CalendarDays, DoorOpen, Car, Package, Wrench, Boxes, Building2, Bus, Home, Grid3x3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CategoryMeta {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const CATEGORY_META: CategoryMeta[] = [
  { value: 'EVENT', label: 'Events & Experiences', description: 'Party spaces, venues, and experience bookings for any occasion.', icon: CalendarDays },
  { value: 'ROOM', label: 'Rooms & Apartments', description: 'Private rooms, suites, and short-stay apartments.', icon: DoorOpen },
  { value: 'RIDE', label: 'Rides', description: 'Cars and vehicles available by the hour or day.', icon: Car },
  { value: 'ITEM', label: 'Items & Gear', description: 'Cameras, tools, and equipment ready to rent.', icon: Package },
  { value: 'SERVICE', label: 'Services', description: 'Book skilled professionals for on-demand services.', icon: Wrench },
  { value: 'ITEMS', label: 'Item Bundles', description: 'Curated packages and multi-item rentals.', icon: Boxes },
  { value: 'VENUE', label: 'Venues', description: 'Halls, studios, and function spaces for hire.', icon: Building2 },
  { value: 'RIDES', label: 'Transport & Fleets', description: 'Vans, buses, and group transport options.', icon: Bus },
  { value: 'PROPERTY', label: 'Property', description: 'Longer-term spaces and property rentals.', icon: Home },
  { value: 'OTHERS', label: 'Everything Else', description: "Anything that doesn't fit in a box — literally.", icon: Grid3x3 },
];
