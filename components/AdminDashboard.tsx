import React from 'react';
import { View } from '../App';
import { ArchiveBoxIcon, ClipboardDocumentListIcon, CurrencyDollarIcon, UsersIcon, ChartBarIcon, ArrowRightIcon } from './icons/Icons';

interface AdminDashboardProps {
  setView: (view: View) => void;
}

const StatCard: React.FC<{ title: string, value: string, icon: React.ElementType, description: string }> = ({ title, value, icon: Icon, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
            <div className="p-3 bg-teal-100 rounded-full">
                <Icon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm font-medium text-gray-500">{title}</p>
            </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">{description}</p>
    </div>
);

const ActionCard: React.FC<{ title: string, description: string, icon: React.ElementType, onClick: () => void; }> = ({ title, description, icon: Icon, onClick }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow text-left w-full border border-gray-200 hover:border-teal-500 group">
        <div className="flex justify-between items-start">
            <div>
                <div className="p-3 bg-slate-100 rounded-full">
                    <Icon className="h-7 w-7 text-slate-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{description}</p>
            </div>
             <ArrowRightIcon className="h-6 w-6 text-gray-400 group-hover:text-teal-600 transition-colors" />
        </div>
    </button>
);


const AdminDashboard: React.FC<AdminDashboardProps> = ({ setView }) => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-base text-gray-600">Overview of your pharmacy's operations.</p>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard 
                title="Total Revenue"
                value="$15,890.50"
                icon={CurrencyDollarIcon}
                description="+12.5% from last month"
            />
             <StatCard 
                title="Total Orders"
                value="1,254"
                icon={ClipboardDocumentListIcon}
                description="25 new orders today"
            />
            <StatCard 
                title="Products in Stock"
                value="86"
                icon={ArchiveBoxIcon}
                description="3 products are low stock"
            />
            <StatCard 
                title="Registered Users"
                value="342"
                icon={UsersIcon}
                description="+5 new users this week"
            />
        </section>

        {/* Quick Actions */}
         <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <ActionCard 
                    title="Manage Inventory"
                    description="Add, remove, or update products."
                    icon={ArchiveBoxIcon}
                    onClick={() => setView('inventory')}
                />
                <ActionCard 
                    title="Manage Users"
                    description="View and manage user roles."
                    icon={UsersIcon}
                    onClick={() => alert('User management coming soon!')}
                />
                <ActionCard 
                    title="View Reports"
                    description="Analyze sales and user activity."
                    icon={ChartBarIcon}
                    onClick={() => alert('Reporting features coming soon!')}
                />
            </div>
         </section>
    </div>
  );
};

export default AdminDashboard;