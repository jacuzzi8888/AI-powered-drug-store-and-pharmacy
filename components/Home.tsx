import React, { useMemo } from 'react';
import { UploadIcon, ChatIcon, ShoppingCartIcon, CheckCircleIcon, ClockIcon, ArrowPathIcon } from './icons/Icons';
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
    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex items-center">
        <div className={`p-4 rounded-xl ${color}`}>
            <Icon className="h-7 w-7 text-white" />
        </div>
        <div className="ml-5">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{title}</p>
        </div>
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
    {/* Hero Section */}
    <div className="bg-teal-50">
        <div className="p-4 md:p-8 max-w-7xl mx-auto text-center py-16 sm:py-24">
            <h1 className="text-4xl md:text-5xl font-extrabold text-teal-900 tracking-tight">Your Health, Delivered.</h1>
            <p className="mt-4 text-lg text-teal-800 max-w-2xl mx-auto">
                Welcome to Digital Rx. Manage prescriptions, shop for wellness products, and get trusted health information, all from one place.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                 <button
                    onClick={() => setView('products')}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-teal-600 hover:bg-teal-700"
                >
                    Shop Now
                </button>
                 <button
                    onClick={() => setView('prescriptions')}
                    className="inline-flex items-center justify-center px-6 py-3 border border-teal-600 text-base font-medium rounded-full text-teal-700 bg-white hover:bg-teal-100"
                >
                    Upload Prescription
                </button>
            </div>
        </div>
    </div>

    <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* At a Glance Section */}
        <section className="my-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Approved Prescriptions" value={String(prescriptionStats.approved)} icon={CheckCircleIcon} color="bg-green-500" />
                <StatCard title="Prescriptions in Review" value={String(prescriptionStats.pending)} icon={ClockIcon} color="bg-amber-500" />
                <StatCard title="Ready for Refill" value={String(prescriptionStats.approved)} icon={ArrowPathIcon} color="bg-sky-500" />
            </div>
        </section>

        {/* Core Features Section */}
         <section className="my-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Your Pharmacy, Simplified</h2>
            <p className="mt-2 text-lg text-gray-600">Everything you need for your health, right at your fingertips.</p>
             <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-teal-100 text-teal-600">
                        <UploadIcon className="h-10 w-10"/>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-gray-900">Easy Prescription Uploads</h3>
                    <p className="mt-2 text-gray-600">Snap a photo or upload a file. We'll handle the rest with secure, digital verification.</p>
                     <button onClick={() => setView('prescriptions')} className="mt-4 font-semibold text-teal-600 hover:text-teal-500">Manage Prescriptions &rarr;</button>
                </div>
                 <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-teal-100 text-teal-600">
                        <ShoppingCartIcon className="h-10 w-10"/>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-gray-900">Wide Product Selection</h3>
                    <p className="mt-2 text-gray-600">From pain relief to vitamins, find all your favorite over-the-counter products in our store.</p>
                    <button onClick={() => setView('products')} className="mt-4 font-semibold text-teal-600 hover:text-teal-500">Shop Products &rarr;</button>
                </div>
                 <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-teal-100 text-teal-600">
                        <ChatIcon className="h-10 w-10"/>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-gray-900">AI Health Assistant</h3>
                    <p className="mt-2 text-gray-600">Have a question? Get general information and support from our friendly AI assistant, 24/7.</p>
                    <button onClick={() => setView('ai-assistant')} className="mt-4 font-semibold text-teal-600 hover:text-teal-500">Ask a Question &rarr;</button>
                </div>
            </div>
        </section>
        

        {/* Featured Products Section */}
        <section className="my-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center">Top Picks For You</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onQuickView={onQuickView} />
                ))}
            </div>
        </section>
      </div>
      </>
  );
};

export default Home;