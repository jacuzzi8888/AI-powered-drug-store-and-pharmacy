import React from 'react';
import { MenuIcon } from '../icons/Icons';

type View = 'dashboard' | 'prescriptions' | 'ai-assistant' | 'products';

interface MobileHeaderProps {
  currentView: View;
  onMenuClick: () => void;
}

const viewTitles: Record<View, string> = {
  dashboard: 'Dashboard',
  prescriptions: 'My Prescriptions',
  'ai-assistant': 'AI Assistant',
  products: 'Shop Products',
};

const MobileHeader: React.FC<MobileHeaderProps> = ({ currentView, onMenuClick }) => {
  return (
    <header className="md:hidden bg-white shadow-sm sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200">
      <button onClick={onMenuClick} className="text-gray-600 hover:text-gray-900" aria-label="Open menu">
        <MenuIcon className="h-6 w-6" />
      </button>
      <h1 className="text-lg font-semibold text-gray-800">{viewTitles[currentView]}</h1>
      <div className="w-6"></div> {/* Spacer to balance the title */}
    </header>
  );
};

export default MobileHeader;