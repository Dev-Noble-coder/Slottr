import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import HeroSection from './components/HeroSection';
import CategoryTabs, { LISTING_TYPES } from './components/CategoryTabs';
import FeaturedListings from './components/FeaturedListings';

const LandingPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const initialCategory = categoryParam && LISTING_TYPES.includes(categoryParam) ? categoryParam : 'EVENT';
  const [activeCategory, setActiveCategory] = useState(initialCategory);

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