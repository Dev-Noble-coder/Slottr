import { MapPin, Home, Warehouse, Monitor, Camera } from 'lucide-react';

interface ListingCardProps {
  imageSrc: string;
  type: 'Room' | 'Cabin' | 'Coworking' | 'Studio' | string;
  title: string;
  location: string;
  price: number;
  unit: string;
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'room': return <Home className="w-3 h-3 mr-1.5" />;
    case 'cabin': return <Warehouse className="w-3 h-3 mr-1.5" />;
    case 'coworking': return <Monitor className="w-3 h-3 mr-1.5" />;
    case 'studio': return <Camera className="w-3 h-3 mr-1.5" />;
    default: return <Home className="w-3 h-3 mr-1.5" />;
  }
};

const ListingCard: React.FC<ListingCardProps> = ({
  imageSrc,
  type,
  title,
  location,
  price,
  unit,
}) => {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer">
      {/* Image Container */}
      <div className="relative h-48 w-full bg-slate-200">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {/* Type Tag */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue text-xs font-semibold px-2.5 py-1.5 rounded-full flex items-center border border-slate-200">
          {getTypeIcon(type)}
          {type}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-blue mb-1">{title}</h3>
        
        <div className="flex items-center text-slate-500 mb-4">
          <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span className="text-sm">{location}</span>
        </div>
        
        <div className="mt-auto pt-2">
          <span className="text-lg font-bold text-blue">${price}</span>
          <span className="text-sm text-slate-500 font-medium"> / {unit}</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
