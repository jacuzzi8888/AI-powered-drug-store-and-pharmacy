import React from 'react';
import { TwitterIcon, FacebookIcon, InstagramIcon, MedkitIcon } from '../icons/Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#EAF6E6] border-t border-[#3A7D44]/20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <a href="#" className="flex items-center">
            <MedkitIcon className="h-8 w-8 text-[#3A7D44]" />
            <span className="ml-3 text-2xl font-lora font-bold text-[#344F1F]">Digital Rx</span>
          </a>
        </div>
        <nav className="flex flex-wrap justify-center -mx-5 -my-2 mb-8" aria-label="Footer">
            {['About', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map(item => (
                 <div key={item} className="px-5 py-2">
                    <a href="#" className="text-base text-[#344F1F]/80 hover:text-[#F4991A]">{item}</a>
                </div>
            ))}
        </nav>
        <div className="flex justify-center space-x-6">
            <a href="#" className="text-[#3A7D44] hover:text-[#F4991A]">
              <span className="sr-only">Facebook</span>
              <FacebookIcon className="h-6 w-6" />
            </a>
            <a href="#" className="text-[#3A7D44] hover:text-[#F4991A]">
              <span className="sr-only">Instagram</span>
              <InstagramIcon className="h-6 w-6" />
            </a>
            <a href="#" className="text-[#3A7D44] hover:text-[#F4991A]">
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="h-6 w-6" />
            </a>
        </div>
        <p className="mt-8 text-center text-base text-[#344F1F]/70">
          &copy; {new Date().getFullYear()} Digital Pharmacy Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;