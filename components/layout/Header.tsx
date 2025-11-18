
import React, { useState, useEffect, useRef } from 'react';
import { MedkitIcon, MenuIcon, XMarkIcon, ShoppingCartIcon, ArrowRightOnRectangleIcon, UserCircleIcon, ClipboardDocumentListIcon } from '../icons/Icons';
import { View } from '../../App';
import { User } from '../../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  cartItemCount: number;
  onCartClick: () => void;
  user: User | null;
  onLogout: () => void;
}

const NavLink: React.FC<{ view: View; currentView: View; setView: (view: View) => void; children: React.ReactNode; isMobile?: boolean; }> = ({ view, currentView, setView, children, isMobile = false }) => (
  <button onClick={() => setView(view)} className={` ${isMobile ? 'block w-full text-left px-4 py-3 text-base' : 'px-4 py-2 text-sm font-medium relative'} rounded-md transition-colors duration-200 ${currentView === view ? 'text-primary-teal' : 'text-gray-600 hover:text-primary-teal'}`}>
    {children}
    {currentView === view && !isMobile && (<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary-teal rounded-full"></span>)}
  </button>
);

const UserMenu: React.FC<{ user: User; onLogout: () => void; setView: (view: View) => void }> = ({ user, onLogout, setView }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);
    
    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <UserCircleIcon className="h-8 w-8 text-gray-600"/>
                <span className="text-sm text-gray-700 hidden lg:block">{user.email}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button onClick={() => { setView('my-account'); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><UserCircleIcon className="h-5 w-5 mr-2"/> My Account</button>
                    <button onClick={() => { setView('order-history'); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><ClipboardDocumentListIcon className="h-5 w-5 mr-2"/> Order History</button>
                    <div className="border-t my-1"></div>
                    <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><ArrowRightOnRectangleIcon className="h-5 w-5 mr-2"/> Sign Out</button>
                </div>
            )}
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ currentView, setView, cartItemCount, onCartClick, user, onLogout }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { setMobileMenuOpen(false); }, [currentView]);

  const navItems = [
    { id: 'products', label: 'Wellness Shop' },
    { id: 'prescriptions', label: 'Prescriptions' },
    { id: 'pharmacist-messaging', label: 'Pharmacist Chat' },
    { id: 'health-hub', label: 'Health Hub' },
    { id: 'ai-assistant', label: 'AI Assistant' },
  ];

  const handleLogoClick = () => {
    if (user?.role === 'admin') setView('admin-dashboard');
    else if (user) setView('dashboard');
    else setView('products');
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button onClick={handleLogoClick} className="flex-shrink-0 flex items-center"><MedkitIcon className="h-8 w-8 text-primary-teal" /><span className="ml-3 text-2xl font-lora font-bold text-text-dark tracking-tight">Digital Rx</span></button>

          <nav className="hidden md:flex md:space-x-1 lg:space-x-2">
            {user && navItems.map((item) => <NavLink key={item.id} view={item.id as View} currentView={currentView} setView={setView}>{item.label}</NavLink>)}
            {user?.role === 'admin' && <NavLink view="admin-dashboard" currentView={currentView} setView={setView}>Admin</NavLink>}
            {!user && <NavLink view="products" currentView={currentView} setView={setView}>Wellness Shop</NavLink>}
          </nav>
          
          <div className="flex items-center space-x-4">
            <button onClick={onCartClick} className="relative text-gray-600 hover:text-primary-teal transition-colors" aria-label="Open cart">
                <ShoppingCartIcon className="h-6 w-6"/>
                {cartItemCount > 0 && (<span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-secondary-blue text-white text-xs font-bold rounded-full">{cartItemCount}</span>)}
            </button>

            <div className="hidden md:flex items-center">
                {user ? <UserMenu user={user} onLogout={onLogout} setView={setView} /> : <button onClick={() => setView('login')} className="flex items-center px-4 py-2 text-sm font-medium text-primary-teal bg-transparent border-2 border-primary-teal rounded-full hover:bg-primary-teal hover:text-white transition-colors">Sign In</button>}
            </div>
            
            <div className="md:hidden"><button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 focus:outline-none" aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen}><span className="sr-only">Open main menu</span>{isMobileMenuOpen ? <XMarkIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}</button></div>
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg z-50 border-b border-gray-200" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && <NavLink view="dashboard" currentView={currentView} setView={setView} isMobile>My Health Hub</NavLink>}
            {user && navItems.map((item) => <NavLink key={item.id} view={item.id as View} currentView={currentView} setView={setView} isMobile>{item.label}</NavLink>)}
            {!user && <NavLink view="products" currentView={currentView} setView={setView} isMobile>Wellness Shop</NavLink>}
            {user?.role === 'admin' && <NavLink view="admin-dashboard" currentView={currentView} setView={setView} isMobile>Admin</NavLink>}
          </div>
           <div className="pt-4 pb-3 border-t border-gray-200">
                {user ? (
                    <div className="mt-3 px-2 space-y-1">
                        <button onClick={() => {setView('my-account');}} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">My Account ({user.email})</button>
                        <button onClick={onLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Sign out</button>
                    </div>
                ) : (
                    <div className="px-2"><button onClick={() => setView('login')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Sign In</button></div>
                )}
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;
