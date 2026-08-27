import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CalendarCheck, Sparkles, ListPlus, Inbox, Wallet } from 'lucide-react';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';

type Audience = 'customer' | 'provider';

const STEPS: Record<Audience, { icon: typeof Search; title: string; description: string }[]> = {
  customer: [
    { icon: Search, title: 'Search & discover', description: 'Browse spaces, rides, items, and services by category, location, or date.' },
    { icon: CalendarCheck, title: 'Book in a click', description: 'Pick your dates, confirm details, and reserve instantly — no back-and-forth required.' },
    { icon: Sparkles, title: 'Show up & enjoy', description: 'Get your confirmation by email and show up ready. Support is here if anything changes.' },
  ],
  provider: [
    { icon: ListPlus, title: 'List your space or service', description: 'Create a listing in minutes — add photos, pricing, and availability.' },
    { icon: Inbox, title: 'Get booking requests', description: 'Receive booking requests from verified customers and manage them from one dashboard.' },
    { icon: Wallet, title: 'Get paid', description: 'Payouts are handled automatically once a booking is complete.' },
  ],
};

const HowItWorksPage = () => {
  const [audience, setAudience] = useState<Audience>('customer');
  const steps = STEPS[audience];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-grow">
        <div className="w-full max-w-[1440px] mx-auto px-4 mt-8 mb-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue tracking-tight mb-4">
            How Slottr works
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-8">
            Whether you're booking or listing, here's the whole journey in three steps.
          </p>

          <div className="inline-flex bg-white border border-slate-200 rounded-full p-1.5 gap-1">
            <button
              onClick={() => setAudience('customer')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                audience === 'customer' ? 'bg-button-dark text-white' : 'text-slate-600 hover:text-blue'
              }`}
            >
              For Customers
            </button>
            <button
              onClick={() => setAudience('provider')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                audience === 'provider' ? 'bg-button-dark text-white' : 'text-slate-600 hover:text-blue'
              }`}
            >
              For Providers
            </button>
          </div>
        </div>

        <div className="w-full max-w-[1440px] mx-auto px-4 mt-16 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="relative bg-white rounded-2xl border border-slate-200 p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-300">STEP {index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-blue mb-2">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-blue rounded-3xl px-8 py-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {audience === 'customer' ? 'Ready to book something?' : 'Ready to start earning?'}
            </h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              {audience === 'customer'
                ? 'Create a free account and find your next space, ride, or service.'
                : 'List your space or service and start receiving bookings today.'}
            </p>
            <Link
              to={audience === 'customer' ? '/signup' : '/provider-signup'}
              className="inline-block bg-white text-blue px-8 py-3.5 rounded-full font-semibold hover:bg-slate-100 transition-colors"
            >
              {audience === 'customer' ? 'Sign Up' : 'List Your Space'}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
