import React from 'react';
import { Order } from '../types';
import { View } from '../App';
import { CheckCircleIcon, ShoppingCartIcon } from './icons/Icons';

interface OrderConfirmationProps {
  order: Order | null;
  setView: (view: View) => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, setView }) => {
  if (!order) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold font-lora text-red-600">Order Not Found</h1>
        <p className="mt-2 text-[#344F1F]/80">We couldn't find the details of your order. Please check your order history.</p>
        <button onClick={() => setView('dashboard')} className="mt-6 px-6 py-2 bg-[#F4991A] text-white font-semibold rounded-full shadow-sm hover:bg-opacity-90">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="bg-[#EAF6E6] p-8 rounded-lg shadow-lg border border-[#3A7D44]/20 text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-[#344F1F] font-lora">Thank you for your order!</h1>
        <p className="mt-2 text-lg text-[#344F1F]/80">Your order has been placed successfully.</p>
        <p className="mt-1 text-sm text-[#344F1F]/70">Order ID: <span className="font-mono">{order.id}</span></p>

        <div className="my-8 text-left border-t border-b border-[#3A7D44]/20 py-6">
            <h2 className="text-xl font-lora font-semibold text-[#344F1F] mb-4">Order Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                    <h3 className="font-semibold text-base mb-2">Shipping to:</h3>
                    <address className="not-italic text-[#344F1F]/90">
                        {order.shippingAddress.fullName}<br/>
                        {order.shippingAddress.addressLine1}<br/>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </address>
                </div>
                 <div>
                    <h3 className="font-semibold text-base mb-2">Payment Method:</h3>
                    <p className="text-[#344F1F]/90">{order.paymentMethod}</p>
                </div>
            </div>
             <ul className="mt-6 divide-y divide-[#3A7D44]/10">
                {order.items.map(item => (
                  <li key={item.id} className="flex items-center py-3">
                    <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                    <div className="ml-4 flex-1">
                      <p className="font-medium text-[#344F1F]">{item.name}</p>
                      <p className="text-sm text-[#344F1F]/70">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-[#344F1F]">${(item.quantity * item.price).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-[#3A7D44]/20 text-right">
                <p className="text-xl font-bold text-[#344F1F]">Total: ${order.total.toFixed(2)}</p>
              </div>
        </div>
        
        <button 
          onClick={() => setView('products')} 
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#F4991A] hover:bg-opacity-90"
        >
          <ShoppingCartIcon className="-ml-1 mr-2 h-5 w-5" />
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;