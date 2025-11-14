import React from 'react';
import { CartItem } from '../types';
import { XMarkIcon, TrashIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from './icons/Icons';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'bg-opacity-50 z-40' : 'bg-opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 id="cart-heading" className="text-lg font-semibold text-gray-900">Your Cart</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100" aria-label="Close cart">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Cart Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingCartIcon className="h-16 w-16 text-gray-300" />
            <p className="mt-4 text-xl font-semibold text-gray-700">Your cart is empty</p>
            <p className="mt-1 text-gray-500">Looks like you haven't added anything yet.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <ul className="divide-y divide-gray-200">
              {items.map(item => (
                <li key={item.id} className="flex py-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-center" />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-gray-500 hover:text-gray-800 disabled:opacity-50" disabled={item.quantity <= 1}><MinusIcon className="h-4 w-4"/></button>
                        <span className="px-3 text-gray-700 font-medium">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-gray-500 hover:text-gray-800"><PlusIcon className="h-4 w-4"/></button>
                      </div>
                      <button onClick={() => onRemove(item.id)} type="button" className="font-medium text-red-600 hover:text-red-800 flex items-center">
                        <TrashIcon className="h-4 w-4 mr-1"/> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <footer className="border-t border-gray-200 p-4 flex-shrink-0 bg-gray-50">
            <div className="flex justify-between text-base font-semibold text-gray-900">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
            <div className="mt-6">
              <a href="#" className="flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-teal-700">
                Proceed to Checkout
              </a>
            </div>
          </footer>
        )}
      </div>
    </>
  );
};

export default Cart;