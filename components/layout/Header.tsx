import React, { useState, useEffect } from 'react';
import { MedkitIcon, UserCircleIcon, MenuIcon, XMarkIcon, ShoppingCartIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from '../icons/Icons';
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
      ${isMobile ? 'block w-full text-left px-4 py-3 text-base' : 'px-4 py-2 text-sm font-medium relative'}
      rounded-md transition-colors duration-200 
      ${currentView === view
        ? 'text-[#F4991A]'
        : 'text-[#344F1F] hover:text-[#F4991A]'}
    `}
  >
    {children}
     {currentView === view && !isMobile && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-[#F4991A] rounded-full"></span>
    )}
  </button>
);

const Header: React.FC<HeaderProps> = ({ currentView, setView, cartItemCount, onCartClick, user, onLogout }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentView]);

  const navItems = [
    { id: 'prescriptions', label: 'Prescriptions' },
    { id: 'products', label: 'Shop Products' },
    { id: 'ai-assistant', label: 'AI Assistant' },
    { id: 'order-history', label: 'Order History' },
  ];

  const handleLogoClick = () => {
    if (user?.role === 'admin') {
      setView('admin-dashboard');
    } else {
      setView('dashboard');
    }
  };

  return (
    <header className="bg-[#C6EBC5]/80 backdrop-blur-lg sticky top-0 z-40 border-b border-[#3A7D44]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <button onClick={handleLogoClick} className="flex items-center">
              <MedkitIcon className="h-8 w-8 text-[#3A7D44]" />
              <span className="ml-3 text-2xl font-lora font-bold text-[#344F1F] tracking-tight">Digital Rx</span>
            </button>
          </div>

          <nav className="hidden md:flex md:space-x-2">
            {navItems.map((item) => (
              <NavLink key={item.id} view={item.id as View} currentView={currentView} setView={setView}>
                {item.label}
              </NavLink>
            ))}
             {user?.role === 'admin' && (
                <>
                    <NavLink view="admin-dashboard" currentView={currentView} setView={setView}>
                        Admin
                    </NavLink>
                    <NavLink view="inventory" currentView={currentView} setView={setView}>
                        Inventory
                    </NavLink>
                </>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            <button onClick={onCartClick} className="relative text-[#344F1F] hover:text-[#F4991A] transition-colors" aria-label="Open cart">
                <ShoppingCartIcon className="h-6 w-6"/>
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-[#F4991A] text-white text-xs font-bold rounded-full">
                        {cartItemCount}
                    </span>
                )}
            </button>

            <div className="hidden md:flex items-center">
                {user ? (
                    <>
                        <span className="text-sm text-[#344F1F] mr-4 hidden lg:block">{user.email}</span>
                        <button onClick={onLogout} className="text-[#344F1F] hover:text-[#F4991A]" title="Logout">
                            <ArrowRightOnRectangleIcon className="h-6 w-6"/>
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={() => setView('login')}
                        className="flex items-center px-4 py-2 text-sm font-medium text-[#3A7D44] bg-transparent border-2 border-[#3A7D44] rounded-full hover:bg-[#3A7D44] hover:text-white transition-colors"
                    >
                        Sign In
                    </button>
                )}
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-[#344F1F] hover:text-[#3A7D44] focus:outline-none"
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
      
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-[#C6EBC5] shadow-lg z-50 border-b border-[#3A7D44]/20" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink view="dashboard" currentView={currentView} setView={setView} isMobile>Dashboard</NavLink>
            {navItems.map((item) => (
               <NavLink key={item.id} view={item.id as View} currentView={currentView} setView={setView} isMobile>
                {item.label}
              </NavLink>
            ))}
             {user?.role === 'admin' && (
                <>
                    <NavLink view="admin-dashboard" currentView={currentView} setView={setView} isMobile>
                        Admin
                    </NavLink>
                    <NavLink view="inventory" currentView={currentView} setView={setView} isMobile>
                        Inventory
                    </NavLink>
                </>
            )}
          </div>
           <div className="pt-4 pb-3 border-t border-[#3A7D44]/20">
                {user ? (
                    <>
                        <div className="flex items-center px-5">
                            <UserCircleIcon className="h-10 w-10 text-gray-400"/>
                            <div className="ml-3">
                                <div className="text-base font-medium text-[#344F1F]">{user.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            <button
                                onClick={onLogout}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#344F1F] hover:bg-green-200/50"
                            >
                                Sign out
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="px-2">
                        <button
                            onClick={() => setView('login')}
                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#344F1F] hover:bg-green-200/50"
                        >
                           Sign In
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;