import React from 'react';
import { CartItem } from '../types';
import { XMarkIcon, TrashIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from './icons/Icons';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'bg-opacity-50 z-40' : 'bg-opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#C6EBC5] shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        <header className="flex items-center justify-between p-5 border-b border-[#3A7D44]/20 flex-shrink-0 bg-[#EAF6E6]">
          <h2 id="cart-heading" className="text-xl font-lora font-bold text-[#344F1F]">Your Cart</h2>
          <button onClick={onClose} className="p-1 text-[#344F1F]/70 hover:text-[#344F1F] transition-colors rounded-full hover:bg-stone-100" aria-label="Close cart">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingCartIcon className="h-16 w-16 text-gray-300" />
            <p className="mt-4 text-xl font-semibold text-[#344F1F]">Your cart is empty</p>
            <p className="mt-1 text-[#344F1F]/70">Looks like you haven't added anything yet.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-[#F4991A] text-white font-semibold rounded-full shadow-sm hover:bg-opacity-90 transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <ul className="divide-y divide-[#3A7D44]/20">
              {items.map(item => (
                <li key={item.id} className="flex py-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-[#3A7D44]/20">
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-center" />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-[#344F1F]">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-[#344F1F]/70">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-[#3A7D44]/30 rounded-full">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-[#344F1F]/70 hover:text-[#344F1F] disabled:opacity-50" disabled={item.quantity <= 1}><MinusIcon className="h-4 w-4"/></button>
                        <span className="px-3 text-[#344F1F] font-medium">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-[#344F1F]/70 hover:text-[#344F1F] disabled:opacity-50" disabled={item.quantity >= item.stock}><PlusIcon className="h-4 w-4"/></button>
                      </div>
                      <button onClick={() => onRemove(item.id)} type="button" className="font-medium text-[#F4991A] hover:text-opacity-80 flex items-center">
                        <TrashIcon className="h-4 w-4 mr-1"/> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {items.length > 0 && (
          <footer className="border-t border-[#3A7D44]/20 p-5 flex-shrink-0 bg-[#EAF6E6]">
            <div className="flex justify-between text-base font-semibold text-[#344F1F]">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-[#344F1F]/70">Shipping and taxes calculated at checkout.</p>
            <div className="mt-6">
              <button
                onClick={onCheckout}
                className="w-full flex items-center justify-center rounded-full border border-transparent bg-[#F4991A] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-90"
              >
                Proceed to Checkout
              </button>
            </div>
          </footer>
        )}
      </div>
    </>
  );
};

export default Cart;