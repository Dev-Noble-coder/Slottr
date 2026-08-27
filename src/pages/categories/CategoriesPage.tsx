import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import { CATEGORY_META } from './categoryMeta';

const CategoriesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-grow">
        <div className="w-full max-w-[1440px] mx-auto px-4 mt-8 mb-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue tracking-tight mb-4">
            Browse by category
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Every kind of space, ride, item, and service — organized so you can find exactly what you need.
          </p>
        </div>

        <div className="w-full max-w-[1440px] mx-auto px-4 mt-12 mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORY_META.map(({ value, label, description, icon: Icon }) => (
              <button
                key={value}
                onClick={() => navigate(`/?category=${value}`)}
                className="group flex flex-col items-start text-left bg-white rounded-2xl border border-slate-200 p-6 hover:border-accent hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-blue mb-1.5">{label}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5">{description}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-blue group-hover:text-accent transition-colors">
                  Explore
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoriesPage;
