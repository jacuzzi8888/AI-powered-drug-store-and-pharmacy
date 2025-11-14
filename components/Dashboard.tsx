import React from 'react';
import { UploadIcon, ChatIcon, UserCircleIcon, ShoppingCartIcon } from './icons/Icons';

type View = 'dashboard' | 'prescriptions' | 'ai-assistant' | 'products';

interface DashboardProps {
    setView: (view: View) => void;
}

const ActionCard: React.FC<{ title: string; description: string; icon: React.ElementType; onClick: () => void; }> = ({ title, description, icon: Icon, onClick }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow text-left w-full border border-gray-200 hover:border-blue-500">
        <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
                <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
    </button>
);


const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <header className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, User!</h1>
                    <p className="mt-1 text-sm md:text-base text-gray-600">Here's a quick overview of your pharmacy services.</p>
                </div>
                <UserCircleIcon className="h-12 w-12 text-gray-400 self-end sm:self-center"/>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard 
                title="Manage Prescriptions"
                description="Securely upload and check the status of your prescriptions."
                icon={UploadIcon}
                onClick={() => setView('prescriptions')}
            />
             <ActionCard 
                title="Shop Products"
                description="Browse our selection of over-the-counter health products."
                icon={ShoppingCartIcon}
                onClick={() => setView('products')}
            />
            <ActionCard 
                title="Ask AI Assistant"
                description="Get answers to general questions about medications and services."
                icon={ChatIcon}
                onClick={() => setView('ai-assistant')}
            />
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
             <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
             <div className="text-center py-10">
                 <p className="text-gray-500">No recent activity to show.</p>
             </div>
        </div>
    </div>
  );
};

export default Dashboard;