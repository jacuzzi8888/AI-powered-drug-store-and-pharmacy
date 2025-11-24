import React from 'react';
import { MedkitIcon, DashboardIcon, ChatIcon, CogIcon, ShoppingCartIcon } from '../icons/Icons';

type View = 'dashboard' | 'prescriptions' | 'ai-assistant' | 'products';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'prescriptions', label: 'Prescriptions', icon: MedkitIcon },
    { id: 'products', label: 'Shop Products', icon: ShoppingCartIcon },
    { id: 'ai-assistant', label: 'AI Assistant', icon: ChatIcon },
  ];

  const handleSetView = (view: View) => {
    setView(view);
    setIsOpen(false); // Close sidebar on navigation
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <MedkitIcon className="h-8 w-8 text-blue-600" />
          <h1 className="ml-3 text-xl font-bold text-gray-800">Digital Rx</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSetView(item.id as View)}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                currentView === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900`}
          >
            <CogIcon className="h-5 w-5 mr-3" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;