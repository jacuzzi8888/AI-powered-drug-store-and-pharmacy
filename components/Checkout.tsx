import React, { useState } from 'react';
import { CartItem, ShippingAddress } from '../types';
import { View } from '../App';
import { CreditCardIcon, LockClosedIcon } from './icons/Icons';

interface CheckoutProps {
  cartItems: CartItem[];
  onPlaceOrder: (shippingAddress: ShippingAddress, paymentMethod: string) => void;
  setView: (view: View) => void;
}

type CheckoutStep = 'shipping' | 'payment' | 'review';

const initialShippingAddress: ShippingAddress = {
    fullName: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
};

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-[#344F1F]">{label}</label>
        <input {...props} className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4991A] focus:border-[#F4991A]" />
    </div>
);

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onPlaceOrder, setView }) => {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(initialShippingAddress);
  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: '', expiryDate: '', cvv: '' });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 5.00; // Example fixed shipping
  const total = subtotal + shippingCost;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };
  
   const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };
  
  const handlePlaceOrderClick = () => {
    const paymentMethod = `Visa ending in ${paymentDetails.cardNumber.slice(-4)}`;
    onPlaceOrder(shippingAddress, paymentMethod);
  };

  const renderStepContent = () => {
    switch(step) {
      case 'shipping':
        return (
          <form onSubmit={handleShippingSubmit} className="space-y-4">
            <h2 className="text-2xl font-lora font-semibold text-[#344F1F]">Shipping Information</h2>
            <FormInput label="Full Name" type="text" name="fullName" value={shippingAddress.fullName} onChange={handleShippingChange} required />
            <FormInput label="Address Line 1" type="text" name="addressLine1" value={shippingAddress.addressLine1} onChange={handleShippingChange} required />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput label="City" type="text" name="city" value={shippingAddress.city} onChange={handleShippingChange} required />
                <FormInput label="State" type="text" name="state" value={shippingAddress.state} onChange={handleShippingChange} required />
                <FormInput label="ZIP Code" type="text" name="zipCode" value={shippingAddress.zipCode} onChange={handleShippingChange} required />
            </div>
            <button type="submit" className="w-full mt-4 px-6 py-3 bg-[#F4991A] text-white font-semibold rounded-full shadow-sm hover:bg-opacity-90">Continue to Payment</button>
          </form>
        );
      case 'payment':
        return (
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <h2 className="text-2xl font-lora font-semibold text-[#344F1F]">Payment Details</h2>
            <FormInput label="Card Number" type="text" name="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentChange} required placeholder="XXXX XXXX XXXX XXXX" />
            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Expiry Date" type="text" name="expiryDate" value={paymentDetails.expiryDate} onChange={handlePaymentChange} required placeholder="MM/YY" />
                <FormInput label="CVV" type="text" name="cvv" value={paymentDetails.cvv} onChange={handlePaymentChange} required placeholder="123" />
            </div>
            <div className="flex items-center text-sm text-gray-500">
                <LockClosedIcon className="h-4 w-4 mr-2"/>
                Your payment information is secure.
            </div>
             <div className="flex justify-between items-center mt-4">
                <button type="button" onClick={() => setStep('shipping')} className="text-sm font-medium text-[#3A7D44] hover:text-opacity-80">&larr; Back to Shipping</button>
                <button type="submit" className="px-6 py-3 bg-[#F4991A] text-white font-semibold rounded-full shadow-sm hover:bg-opacity-90">Continue to Review</button>
            </div>
          </form>
        );
      case 'review':
        return (
            <div>
                 <h2 className="text-2xl font-lora font-semibold text-[#344F1F] mb-4">Review Your Order</h2>
                 <div className="space-y-4 text-sm text-[#344F1F]/90">
                    <div>
                        <h3 className="font-semibold text-base mb-1">Shipping to:</h3>
                        <p>{shippingAddress.fullName}</p>
                        <p>{shippingAddress.addressLine1}</p>
                        <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-base mb-1">Payment Method:</h3>
                        <p>Visa ending in {paymentDetails.cardNumber.slice(-4)}</p>
                    </div>
                 </div>
                 <div className="flex justify-between items-center mt-6">
                    <button type="button" onClick={() => setStep('payment')} className="text-sm font-medium text-[#3A7D44] hover:text-opacity-80">&larr; Back to Payment</button>
                    <button onClick={handlePlaceOrderClick} className="px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-green-700 transition-colors">Place Order</button>
                </div>
            </div>
        )
    }
  };

  const steps = [
      { id: 'shipping', name: 'Shipping' },
      { id: 'payment', name: 'Payment' },
      { id: 'review', name: 'Review' }
  ]
  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#344F1F] font-lora">Checkout</h1>
        </header>
        
        <div className="mb-8">
            <nav aria-label="Progress">
                <ol role="list" className="flex items-center justify-center">
                    {steps.map((s, index) => (
                        <li key={s.id} className="relative flex-1">
                            <div className="flex items-center">
                                <div className="absolute inset-0 h-0.5 top-1/2 -translate-y-1/2" aria-hidden="true">
                                    <div className={`h-full w-full ${index <= currentStepIndex ? 'bg-[#3A7D44]' : 'bg-gray-200'}`}></div>
                                </div>
                                <div className={`relative w-8 h-8 flex items-center justify-center rounded-full ${index <= currentStepIndex ? 'bg-[#3A7D44]' : 'bg-gray-200'}`}>
                                    {index < currentStepIndex ? <span className="text-white">✓</span> : <span className="text-[#344F1F]">{index + 1}</span>}
                                </div>
                                <span className={`ml-3 hidden md:block text-sm font-medium ${index <= currentStepIndex ? 'text-[#344F1F]' : 'text-gray-500'}`}>{s.name}</span>
                            </div>
                        </li>
                    ))}
                </ol>
            </nav>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 bg-[#EAF6E6] p-8 rounded-lg shadow-sm border border-[#3A7D44]/20">
                {renderStepContent()}
            </div>

            <aside className="lg:col-span-1">
                <div className="bg-[#EAF6E6] p-6 rounded-lg shadow-sm border border-[#3A7D44]/20">
                    <h3 className="text-xl font-lora font-semibold text-[#344F1F] mb-4">Order Summary</h3>
                    <ul className="divide-y divide-[#3A7D44]/20 text-sm">
                        {cartItems.map(item => (
                            <li key={item.id} className="flex justify-between py-3">
                                <span className="text-[#344F1F]">{item.name} <span className="text-[#344F1F]/70">x{item.quantity}</span></span>
                                <span className="font-medium text-[#344F1F]">${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t border-[#3A7D44]/20 pt-4 mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[#344F1F]/80">Subtotal</span>
                            <span className="font-medium text-[#344F1F]">${subtotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-[#344F1F]/80">Shipping</span>
                            <span className="font-medium text-[#344F1F]">${shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-[#344F1F] pt-2">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
  );
};

export default Checkout;