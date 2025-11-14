import React, { useState, useEffect } from 'react';
import { MedkitIcon, UserCircleIcon, MenuIcon, XMarkIcon, ShoppingCartIcon } from '../icons/Icons';
import { View } from '../../App';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  cartItemCount: number;
  onCartClick: () => void;
}

const NavLink: React.FC<{
  view: View;
  currentView: View;
  setView: (view: View) => void;
  children: React.ReactNode;
  isMobile?: boolean;
}> = ({ view, currentView, setView, children, isMobile = false }) => (
  <button
    onClick={() => setView(view)}
    className={`
      ${isMobile ? 'block w-full text-left px-4 py-3 text-base' : 'px-3 py-2 text-sm font-medium relative'}
      rounded-md transition-colors duration-200 
      ${currentView === view
        ? 'text-teal-600'
        : 'text-gray-700 hover:text-teal-600'}
    `}
  >
    {children}
     {currentView === view && !isMobile && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-teal-600 rounded-full"></span>
    )}
  </button>
);

const Header: React.FC<HeaderProps> = ({ currentView, setView, cartItemCount, onCartClick }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Close mobile menu on view change
    setMobileMenuOpen(false);
  }, [currentView]);

  const navItems = [
    { id: 'prescriptions', label: 'Prescriptions' },
    { id: 'products', label: 'Shop Products' },
    { id: 'ai-assistant', label: 'AI Assistant' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Home link */}
          <div className="flex-shrink-0">
            <button onClick={() => setView('dashboard')} className="flex items-center">
              <MedkitIcon className="h-8 w-8 text-teal-600" />
              <span className="ml-3 text-xl font-bold text-gray-800 tracking-tight">Digital Rx</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-4">
            {navItems.map((item) => (
              <NavLink key={item.id} view={item.id as View} currentView={currentView} setView={setView}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <button onClick={onCartClick} className="relative text-gray-500 hover:text-teal-600 transition-colors" aria-label="Open cart">
                <ShoppingCartIcon className="h-6 w-6"/>
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full">
                        {cartItemCount}
                    </span>
                )}
            </button>

             {/* Profile Icon */}
            <div className="hidden md:block">
                <UserCircleIcon className="h-8 w-8 text-gray-400 hover:text-gray-600 cursor-pointer"/>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink view="dashboard" currentView={currentView} setView={setView} isMobile>Dashboard</NavLink>
            {navItems.map((item) => (
               <NavLink key={item.id} view={item.id as View} currentView={currentView} setView={setView} isMobile>
                {item.label}
              </NavLink>
            ))}
          </div>
           <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-5">
                    <UserCircleIcon className="h-10 w-10 text-gray-400"/>
                    <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">User</div>
                        <div className="text-sm font-medium text-gray-500">user@example.com</div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;