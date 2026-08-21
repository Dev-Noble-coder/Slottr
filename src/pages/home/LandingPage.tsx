import { useState } from 'react';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import HeroSection from './components/HeroSection';
import CategoryTabs from './components/CategoryTabs';
import FeaturedListings from './components/FeaturedListings';

const LandingPage = () => {
  const [activeCategory, setActiveCategory] = useState('EVENT');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <FeaturedListings activeCategory={activeCategory} />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;