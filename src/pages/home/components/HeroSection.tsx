import SearchBar from './SearchBar';

const HeroSection = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 mt-8">
      {/* Container with background image and overlay */}
      <div 
        className="rounded-3xl py-24 px-4 sm:px-8 text-center border border-slate-200 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1600&h=600')" }}
      >
        <div className="absolute inset-0 bg-white/45 backdrop-blur-md"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue tracking-tight leading-tight max-w-4xl mx-auto mb-24">
            Book anything, anywhere. From spaces to services.
          </h1>
          
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
