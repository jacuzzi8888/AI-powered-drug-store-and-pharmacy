import React from 'react';
import { TwitterIcon, FacebookIcon, InstagramIcon, MedkitIcon } from '../icons/Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <FacebookIcon className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <InstagramIcon className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="h-6 w-6" />
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
             <div className="flex items-center justify-center">
                <MedkitIcon className="h-6 w-6 text-blue-600" />
                <span className="ml-2 text-base font-bold text-gray-800">Digital Rx</span>
             </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              &copy; {new Date().getFullYear()} Digital Pharmacy Platform. All rights reserved.
            </p>
          </div>
        </div>
        <nav className="mt-8 flex flex-wrap justify-center -mx-5 -my-2" aria-label="Footer">
            <div className="px-5 py-2">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">About</a>
            </div>
            <div className="px-5 py-2">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Contact Us</a>
            </div>
            <div className="px-5 py-2">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
            </div>
             <div className="px-5 py-2">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a>
            </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;