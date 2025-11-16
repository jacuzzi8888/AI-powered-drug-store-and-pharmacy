import React, { useMemo } from 'react';
import { UploadIcon, ChatIcon, ShoppingCartIcon, CheckCircleIcon, ClockIcon, ArrowPathIcon, SparklesIcon, ShieldCheckIcon, TruckIcon } from './icons/Icons';
import { View } from '../App';
import { Product, Prescription, PrescriptionStatus } from '../types';
import { ProductCard } from './Products';

interface HomeProps {
    setView: (view: View) => void;
    products: Product[];
    prescriptions: Prescription[];
    onAddToCart: (product: Product, quantity: number) => void;
    onQuickView: (product: Product) => void;
}

const StatCard: React.FC<{ title: string, value: string, icon: React.ElementType, color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-[#EAF6E6] p-6 rounded-2xl shadow-sm border border-stone-200/50 flex items-center">
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
            <p className="text-3xl font-bold text-[#344F1F]">{value}</p>
            <p className="text-sm text-[#344F1F]/80">{title}</p>
        </div>
    </div>
);

const TrustBadge: React.FC<{ icon: React.ElementType; text: string; }> = ({ icon: Icon, text }) => (
    <div className="flex items-center text-sm text-[#344F1F] font-medium">
        <Icon className="h-5 w-5 mr-2 text-[#3A7D44]" />
        <span>{text}</span>
    </div>
);


const Home: React.FC<HomeProps> = ({ setView, products, prescriptions, onAddToCart, onQuickView }) => {
  const prescriptionStats = useMemo(() => {
    return prescriptions.reduce((acc, p) => {
        if (p.status === PrescriptionStatus.Approved) acc.approved += 1;
        if (p.status === PrescriptionStatus.Pending) acc.pending += 1;
        return acc;
    }, { approved: 0, pending: 0 });
  }, [prescriptions]);

  return (
    <>
    <div className="bg-[#C6EBC5]">
      {/* Hero Section */}
      <div className="relative bg-[#EAF6E6] overflow-hidden">
          <div className="max-w-7xl mx-auto">
              <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                  <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                      <div className="sm:text-center lg:text-left">
                          <h1 className="text-4xl tracking-tight font-extrabold text-[#344F1F] sm:text-5xl md:text-6xl">
                              <span className="block xl:inline font-lora">Personalized care,</span>
                              <span className="block text-[#3A7D44] xl:inline font-lora">delivered to your door.</span>
                          </h1>
                          <p className="mt-3 text-base text-[#344F1F]/80 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                              Manage prescriptions, shop for wellness, and consult with our team—all with the care and confidence you deserve.
                          </p>
                          <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                              <div className="rounded-full">
                                  <button onClick={() => setView('products')} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#F4991A] hover:bg-opacity-90 md:py-4 md:text-lg md:px-10">
                                      Shop Products
                                  </button>
                              </div>
                              <div className="mt-3 sm:mt-0 sm:ml-3 rounded-full">
                                  <button onClick={() => setView('prescriptions')} className="w-full flex items-center justify-center px-8 py-3 border-2 border-[#3A7D44] text-base font-medium rounded-full text-[#3A7D44] bg-transparent hover:bg-[#C6EBC5] md:py-4 md:text-lg md:px-10">
                                      Upload Prescription
                                  </button>
                              </div>
                          </div>
                      </div>
                  </main>
              </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1584515933487-779824d27929?q=80&w=2070&auto=format&fit=crop" alt="Woman smiling" />
          </div>
      </div>
      
      {/* Trust Bar */}
      <div className="bg-[#EAF6E6] border-b border-[#3A7D44]/20">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                 <TrustBadge icon={ShieldCheckIcon} text="Pharmacist-Verified" />
                 <TrustBadge icon={TruckIcon} text="Free Shipping on Orders $50+" />
                 <TrustBadge icon={SparklesIcon} text="Secure & Private Platform" />
            </div>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* At a Glance Section */}
          <section className="my-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard title="Approved Prescriptions" value={String(prescriptionStats.approved)} icon={CheckCircleIcon} color="bg-[#3A7D44]" />
                  <StatCard title="Prescriptions in Review" value={String(prescriptionStats.pending)} icon={ClockIcon} color="bg-[#F4991A]" />
                  <StatCard title="Ready for Refill" value={String(prescriptionStats.approved)} icon={ArrowPathIcon} color="bg-[#344F1F]" />
              </div>
          </section>

          {/* Core Features Section */}
          <section className="my-16 text-center">
              <h2 className="text-3xl font-bold text-[#344F1F] font-lora">Your Pharmacy, Simplified</h2>
              <p className="mt-2 text-lg text-[#344F1F]/80">Everything you need for your health, right at your fingertips.</p>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-20 w-20 rounded-full bg-[#3A7D44]/20 text-[#3A7D44]">
                          <UploadIcon className="h-10 w-10"/>
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-[#344F1F] font-lora">Easy Prescription Uploads</h3>
                      <p className="mt-2 text-[#344F1F]/80">Snap a photo or upload a file. We'll handle the rest with secure, digital verification.</p>
                      <button onClick={() => setView('prescriptions')} className="mt-4 font-semibold text-[#3A7D44] hover:text-opacity-80">Manage Prescriptions &rarr;</button>
                  </div>
                  <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-20 w-20 rounded-full bg-[#3A7D44]/20 text-[#3A7D44]">
                          <ShoppingCartIcon className="h-10 w-10"/>
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-[#344F1F] font-lora">Wide Product Selection</h3>
                      <p className="mt-2 text-[#344F1F]/80">From pain relief to vitamins, find all your favorite over-the-counter products in our store.</p>
                      <button onClick={() => setView('products')} className="mt-4 font-semibold text-[#3A7D44] hover:text-opacity-80">Shop Products &rarr;</button>
                  </div>
                  <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-20 w-20 rounded-full bg-[#3A7D44]/20 text-[#3A7D44]">
                          <ChatIcon className="h-10 w-10"/>
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-[#344F1F] font-lora">AI Health Assistant</h3>
                      <p className="mt-2 text-[#344F1F]/80">Have a question? Get general information and support from our friendly AI assistant, 24/7.</p>
                      <button onClick={() => setView('ai-assistant')} className="mt-4 font-semibold text-[#3A7D44] hover:text-opacity-80">Ask a Question &rarr;</button>
                  </div>
              </div>
          </section>
          
          {/* Featured Products Section */}
          <section className="my-16">
              <h2 className="text-3xl font-bold text-[#344F1F] text-center font-lora">Top Picks For You</h2>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {products.map(product => (
                      <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onQuickView={onQuickView} />
                  ))}
              </div>
          </section>
        </div>
      </div>
      </>
  );
};

export default Home;