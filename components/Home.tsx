import React, { useMemo } from 'react';
import { UploadIcon, ChatIcon, ShoppingCartIcon, UserCircleIcon, CheckCircleIcon, ClockIcon, ArrowPathIcon } from './icons/Icons';
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

const ActionCard: React.FC<{ title: string; description: string; icon: React.ElementType; onClick: () => void; }> = ({ title, description, icon: Icon, onClick }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow text-left w-full border border-gray-200 hover:border-blue-500 h-full flex flex-col">
        <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
                <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="mt-2 text-sm text-gray-600 flex-grow">{description}</p>
        <div className="mt-4 text-right text-sm font-medium text-blue-600">
            Go &rarr;
        </div>
    </button>
);

const StatCard: React.FC<{ title: string, value: number, icon: React.ElementType, color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <header className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, User!</h1>
                    <p className="mt-1 text-sm md:text-base text-gray-600">Here's your pharmacy dashboard overview.</p>
                </div>
                <UserCircleIcon className="h-12 w-12 text-gray-400 self-end sm:self-center"/>
            </div>
        </header>

        {/* At a Glance Section */}
        <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">At a Glance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Approved Prescriptions" value={prescriptionStats.approved} icon={CheckCircleIcon} color="bg-green-500" />
                <StatCard title="Pending Review" value={prescriptionStats.pending} icon={ClockIcon} color="bg-yellow-500" />
                <StatCard title="Refills Available" value={prescriptionStats.approved} icon={ArrowPathIcon} color="bg-blue-500" />
            </div>
        </section>

        {/* Action Cards Section */}
        <section className="mb-12">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard 
                    title="Manage Prescriptions"
                    description="Securely upload and check the status of your prescriptions with digital verification."
                    icon={UploadIcon}
                    onClick={() => setView('prescriptions')}
                />
                <ActionCard 
                    title="Shop Products"
                    description="Browse our curated selection of over-the-counter health and wellness products."
                    icon={ShoppingCartIcon}
                    onClick={() => setView('products')}
                />
                <ActionCard 
                    title="Ask AI Assistant"
                    description="Get instant answers to your general questions about medications and pharmacy services."
                    icon={ChatIcon}
                    onClick={() => setView('ai-assistant')}
                />
            </div>
        </section>

        {/* Featured Products Section */}
        <section className="my-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Featured For You</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onQuickView={onQuickView} />
                ))}
            </div>
        </section>
      </div>
  );
};

export default Home;