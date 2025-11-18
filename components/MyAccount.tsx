
import React, { useState } from 'react';
import { User, UserProfile } from '../types';
import { UserCircleIcon, HomeIcon, CreditCardIcon, ShieldCheckIcon, IdentificationIcon, BuildingOfficeIcon, PlusIcon } from './icons/Icons';

interface MyAccountProps {
    user: User;
    onUpdateProfile: (profile: UserProfile) => void;
}

type AccountView = 'profile' | 'addresses' | 'payment' | 'insurance';

const MyAccount: React.FC<MyAccountProps> = ({ user, onUpdateProfile }) => {
    const [currentView, setCurrentView] = useState<AccountView>('profile');
    const [profile, setProfile] = useState<UserProfile>(user.profile);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile(profile);
    };

    const renderContent = () => {
        switch (currentView) {
            case 'profile':
                return (
                    <form onSubmit={handleProfileSubmit}>
                        <h2 className="text-2xl font-bold font-lora text-text-dark">Personal Information</h2>
                        <p className="mt-1 text-sm text-text-medium">Update your personal details here.</p>
                        <div className="mt-6 space-y-4">
                            <div><label className="text-sm font-medium">Full Name</label><input type="text" name="fullName" value={profile.fullName} onChange={handleProfileChange} className="mt-1 w-full p-2 border rounded-md"/></div>
                            <div><label className="text-sm font-medium">Date of Birth</label><input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleProfileChange} className="mt-1 w-full p-2 border rounded-md"/></div>
                            <div><label className="text-sm font-medium">Phone Number</label><input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} className="mt-1 w-full p-2 border rounded-md"/></div>
                        </div>
                        <div className="mt-6"><button type="submit" className="px-5 py-2.5 bg-primary-teal text-white font-semibold rounded-full shadow-sm hover:bg-opacity-90">Save Changes</button></div>
                    </form>
                );
            case 'addresses':
                return (
                    <div>
                        <h2 className="text-2xl font-bold font-lora text-text-dark">Manage Addresses</h2>
                        <p className="mt-1 text-sm text-text-medium">Add or remove your shipping addresses.</p>
                        <div className="mt-6 space-y-4">
                            {user.addresses.length > 0 ? user.addresses.map(addr => (
                                <div key={addr.id} className="p-4 border rounded-md flex justify-between items-center">
                                    <div className="flex items-center">
                                        {addr.type === 'Home' ? <HomeIcon className="h-6 w-6 text-gray-500 mr-4"/> : <BuildingOfficeIcon className="h-6 w-6 text-gray-500 mr-4"/>}
                                        <div><p>{addr.addressLine1}</p><p className="text-sm text-gray-500">{addr.city}, {addr.state}</p></div>
                                    </div>
                                    {addr.isDefault && <span className="text-xs font-bold text-primary-teal bg-primary-teal/10 px-2 py-1 rounded-full">DEFAULT</span>}
                                </div>
                            )) : <p>No addresses saved.</p>}
                        </div>
                         <div className="mt-6"><button className="inline-flex items-center px-5 py-2.5 bg-secondary-blue text-white font-semibold rounded-full shadow-sm hover:bg-opacity-90"><PlusIcon className="h-5 w-5 mr-2"/> Add New Address</button></div>
                    </div>
                );
            case 'payment':
                 return (
                    <div>
                        <h2 className="text-2xl font-bold font-lora text-text-dark">Payment Methods</h2>
                        <p className="mt-1 text-sm text-text-medium">Your saved payment methods.</p>
                        <div className="mt-6"><p>Feature coming soon.</p></div>
                    </div>
                );
            case 'insurance':
                 return (
                    <div>
                        <h2 className="text-2xl font-bold font-lora text-text-dark">Insurance Details</h2>
                        <p className="mt-1 text-sm text-text-medium">Manage your insurance information for prescriptions.</p>
                        <div className="mt-6"><p>Feature coming soon.</p></div>
                    </div>
                );
        }
    };

    const navItems = [
        { id: 'profile', label: 'Profile', icon: IdentificationIcon },
        { id: 'addresses', label: 'Addresses', icon: HomeIcon },
        { id: 'payment', label: 'Payment', icon: CreditCardIcon },
        { id: 'insurance', label: 'Insurance', icon: ShieldCheckIcon },
    ];

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-bold font-lora text-text-dark">My Account</h1>
                <p className="mt-2 text-lg text-text-medium">Manage your personal information and preferences.</p>
            </header>
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-1/4">
                    <nav className="space-y-2">
                        {navItems.map(item => (
                            <button key={item.id} onClick={() => setCurrentView(item.id as AccountView)} className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${currentView === item.id ? 'bg-secondary-blue/20 text-primary-teal font-semibold' : 'hover:bg-gray-100'}`}>
                                <item.icon className="h-5 w-5 mr-3" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default MyAccount;
