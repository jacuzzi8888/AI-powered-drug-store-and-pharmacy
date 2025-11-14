import React from 'react';
import { TwitterIcon, FacebookIcon, InstagramIcon, MedkitIcon } from '../icons/Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <a href="#" className="flex items-center">
            <MedkitIcon className="h-8 w-8 text-teal-600" />
            <span className="ml-3 text-xl font-bold text-gray-800">Digital Rx</span>
          </a>
        </div>
        <nav className="flex flex-wrap justify-center -mx-5 -my-2 mb-8" aria-label="Footer">
            {['About', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map(item => (
                 <div key={item} className="px-5 py-2">
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">{item}</a>
                </div>
            ))}
        </nav>
        <div className="flex justify-center space-x-6">
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
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} Digital Pharmacy Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;