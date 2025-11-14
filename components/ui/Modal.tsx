import React, { ReactNode } from 'react';
import { XMarkIcon } from '../icons/Icons';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl transform transition-all w-full sm:max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex justify-between items-center border-b">
          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;