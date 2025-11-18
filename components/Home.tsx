
import React, { useMemo } from 'react';
// FIX: Import XCircleIcon to resolve a 'Cannot find name' error.
import { UploadIcon, ChatIcon, ShoppingCartIcon, CheckCircleIcon, ClockIcon, XCircleIcon, ArrowPathIcon, SparklesIcon, ShieldCheckIcon, TruckIcon, UserCircleIcon, DocumentTextIcon } from './icons/Icons';
import { View } from '../App';
import { Product, Prescription, PrescriptionStatus, User } from '../types';
import { ProductCard } from './Products';

interface HomeProps {
    setView: (view: View) => void;
    products: Product[];
    prescriptions: Prescription[];
    onAddToCart: (product: Product, quantity: number) => void;
    onQuickView: (product: Product) => void;
    user: User | null;
}

const ActionCard: React.FC<{ title: string; description: string; icon: React.ElementType; onClick: () => void; }> = ({ title, description, icon: Icon, onClick }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left w-full border border-gray-200 hover:border-primary-teal">
        <div className="flex items-center mb-3">
            <div className="p-3 bg-secondary-blue/20 rounded-full">
                <Icon className="h-6 w-6 text-primary-teal" />
            </div>
        </div>
        <h3 className="text-lg font-semibold text-text-dark">{title}</h3>
        <p className="mt-1 text-sm text-text-medium">{description}</p>
    </button>
);

const PrescriptionStatusCard: React.FC<{ p: Prescription, setView: (v: View) => void }> = ({ p, setView }) => {
    const statusInfo = useMemo(() => {
        switch(p.status) {
            case PrescriptionStatus.Approved: return { icon: CheckCircleIcon, color: 'text-primary-teal', text: 'Approved' };
            case PrescriptionStatus.Pending: return { icon: ClockIcon, color: 'text-amber-500', text: 'In Review' };
            case PrescriptionStatus.Rejected: return { icon: XCircleIcon, color: 'text-red-500', text: 'Rejected' };
            case PrescriptionStatus.RefillRequested: return { icon: ArrowPathIcon, color: 'text-indigo-500', text: 'Refill Requested' };
            default: return { icon: DocumentTextIcon, color: 'text-gray-500', text: p.status };
        }
    }, [p.status]);

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
            <div>
                <p className="font-medium text-gray-800 truncate max-w-[150px]">{p.fileName}</p>
                <div className={`flex items-center text-sm font-semibold ${statusInfo.color}`}>
                    <statusInfo.icon className="h-4 w-4 mr-1.5" />
                    {statusInfo.text}
                </div>
            </div>
            <button onClick={() => setView('prescriptions')} className="text-sm font-medium text-primary-teal hover:underline">View</button>
        </div>
    );
};


const Home: React.FC<HomeProps> = ({ setView, products, prescriptions, onAddToCart, onQuickView, user }) => {
    const recentPrescriptions = useMemo(() => {
        return [...prescriptions].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()).slice(0, 3);
    }, [prescriptions]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <header className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-text-dark font-lora">My Health Hub</h1>
                    <p className="mt-1 text-base md:text-lg text-text-medium">Welcome back, {user?.profile?.fullName || user?.email || 'User'}!</p>
                </div>
                <button onClick={() => setView('my-account')}><UserCircleIcon className="h-12 w-12 text-gray-300 self-end sm:self-center"/></button>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard title="Manage Prescriptions" description="Upload, track, and request refills for your prescriptions." icon={UploadIcon} onClick={() => setView('prescriptions')} />
            <ActionCard title="Wellness Shop" description="Browse over-the-counter health products." icon={ShoppingCartIcon} onClick={() => setView('products')} />
            <ActionCard title="Chat with a Pharmacist" description="Get professional advice on non-emergency questions." icon={ChatIcon} onClick={() => setView('pharmacist-messaging')} />
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                 <h2 className="text-xl font-semibold text-text-dark mb-4 font-lora">Recent Prescriptions</h2>
                 {recentPrescriptions.length > 0 ? (
                    <div className="space-y-3">
                        {recentPrescriptions.map(p => <PrescriptionStatusCard key={p.id} p={p} setView={setView} />)}
                    </div>
                 ) : (
                    <div className="text-center py-10"><p className="text-gray-500">No recent prescription activity.</p></div>
                 )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-text-dark mb-4 font-lora">Explore our Health Hub</h2>
                <div className="text-center py-6">
                     <p className="text-gray-600">Find articles and tips for a healthier lifestyle.</p>
                     <button onClick={() => setView('health-hub')} className="mt-4 px-5 py-2.5 bg-secondary-blue text-white text-sm font-semibold rounded-full shadow-sm hover:bg-opacity-90">Explore Now</button>
                </div>
            </div>
        </div>
        
        <section className="my-16">
              <h2 className="text-3xl font-bold text-text-dark text-center font-lora">Pharmacist-Recommended Products</h2>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {products.map(product => (
                      <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onQuickView={onQuickView} />
                  ))}
              </div>
        </section>
    </div>
  );
};

export default Home;
