import React, { useState } from 'react';
import { CartItem, ShippingAddress } from '../types';
import { View } from '../App';
import { LockClosedIcon } from './icons/Icons';

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
    country: 'Nigeria',
};

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-teal focus:border-primary-teal" />
    </div>
);

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onPlaceOrder, setView }) => {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(initialShippingAddress);
  const [paymentGateway, setPaymentGateway] = useState('paystack');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 2500; // Example delivery fee in Naira
  const total = subtotal + shippingCost;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
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
    const paymentMethod = paymentGateway === 'paystack' ? 'Paystack' : 'Flutterwave';
    onPlaceOrder(shippingAddress, paymentMethod);
  };

  const renderStepContent = () => {
    switch(step) {
      case 'shipping':
        return (
          <form onSubmit={handleShippingSubmit} className="space-y-4">
            <h2 className="text-2xl font-lora font-semibold text-text-dark">Delivery Information</h2>
            <FormInput label="Full Name" type="text" name="fullName" value={shippingAddress.fullName} onChange={handleShippingChange} required />
            <FormInput label="Street Address" type="text" name="addressLine1" value={shippingAddress.addressLine1} onChange={handleShippingChange} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="City" type="text" name="city" value={shippingAddress.city} onChange={handleShippingChange} required />
                <FormInput label="State" type="text" name="state" value={shippingAddress.state} onChange={handleShippingChange} required />
            </div>
            <button type="submit" className="w-full mt-4 px-6 py-3 bg-primary-teal text-white font-semibold rounded-full shadow-sm hover:bg-opacity-90">Continue to Payment</button>
          </form>
        );
      case 'payment':
        return (
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <h2 className="text-2xl font-lora font-semibold text-text-dark">Payment Method</h2>
            <p className="text-sm text-gray-600">Please select your preferred secure payment method. You will be redirected to complete your payment.</p>
            <div className="space-y-3">
                <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${paymentGateway === 'paystack' ? 'bg-white border-primary-teal ring-2 ring-primary-teal' : 'border-gray-300'}`}>
                    <input type="radio" name="paymentGateway" value="paystack" checked={paymentGateway === 'paystack'} onChange={() => setPaymentGateway('paystack')} className="sr-only" />
                    <img src="https://assets.paystack.com/assets/img/logos/merchants/header-logo.svg" alt="Paystack" className="h-6" />
                    <span className="ml-4 font-medium text-gray-800]">Pay with Paystack</span>
                    <span className="text-xs text-gray-500 ml-auto hidden sm:block">(Card, Bank, USSD)</span>
                </label>
                <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${paymentGateway === 'flutterwave' ? 'bg-white border-primary-teal ring-2 ring-primary-teal' : 'border-gray-300'}`}>
                    <input type="radio" name="paymentGateway" value="flutterwave" checked={paymentGateway === 'flutterwave'} onChange={() => setPaymentGateway('flutterwave')} className="sr-only" />
                    <img src="https://flutterwave.com/images/logo/full-logo-color.svg" alt="Flutterwave" className="h-6" />
                    <span className="ml-4 font-medium text-gray-800">Pay with Flutterwave</span>
                     <span className="text-xs text-gray-500 ml-auto hidden sm:block">(Card, Bank, USSD)</span>
                </label>
            </div>
             <div className="flex items-center text-sm text-gray-500 pt-2">
                <LockClosedIcon className="h-4 w-4 mr-2"/>
                Your payment information is secure.
            </div>
             <div className="flex justify-between items-center mt-4">
                <button type="button" onClick={() => setStep('shipping')} className="text-sm font-medium text-primary-teal hover:text-opacity-80">&larr; Back to Delivery</button>
                <button type="submit" className="px-6 py-3 bg-primary-teal text-white font-semibold rounded-full shadow-sm hover:bg-opacity-90">Continue to Review</button>
            </div>
          </form>
        );
      case 'review':
        return (
            <div>
                 <h2 className="text-2xl font-lora font-semibold text-text-dark mb-4">Review Your Order</h2>
                 <div className="space-y-4 text-sm text-gray-700">
                    <div>
                        <h3 className="font-semibold text-base mb-1">Delivering to:</h3>
                        <p>{shippingAddress.fullName}</p>
                        <p>{shippingAddress.addressLine1}</p>
                        <p>{shippingAddress.city}, {shippingAddress.state}, {shippingAddress.country}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-base mb-1">Payment Method:</h3>
                        <p className="capitalize">{paymentGateway}</p>
                    </div>
                 </div>
                 <div className="flex justify-between items-center mt-6">
                    <button type="button" onClick={() => setStep('payment')} className="text-sm font-medium text-primary-teal hover:text-opacity-80">&larr; Back to Payment</button>
                    <button onClick={handlePlaceOrderClick} className="px-8 py-4 bg-secondary-blue text-white text-lg font-bold rounded-full shadow-lg hover:bg-opacity-90 transition-colors">Place Order</button>
                </div>
            </div>
        )
    }
  };

  const steps = [
      { id: 'shipping', name: 'Delivery' },
      { id: 'payment', name: 'Payment' },
      { id: 'review', name: 'Review' }
  ]
  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-dark font-lora">Checkout</h1>
        </header>
        
        <div className="mb-8">
            <nav aria-label="Progress">
                <ol role="list" className="flex items-center justify-center">
                    {steps.map((s, index) => (
                        <li key={s.id} className="relative flex-1">
                            <div className="flex items-center">
                                <div className="absolute inset-0 h-0.5 top-1/2 -translate-y-1/2" aria-hidden="true">
                                    <div className={`h-full w-full ${index <= currentStepIndex ? 'bg-primary-teal' : 'bg-gray-200'}`}></div>
                                </div>
                                <div className={`relative w-8 h-8 flex items-center justify-center rounded-full ${index <= currentStepIndex ? 'bg-primary-teal' : 'bg-gray-200'}`}>
                                    {index < currentStepIndex ? <span className="text-white">✓</span> : <span className="text-white font-semibold">{index + 1}</span>}
                                </div>
                                <span className={`ml-3 hidden md:block text-sm font-medium ${index <= currentStepIndex ? 'text-gray-800' : 'text-gray-500'}`}>{s.name}</span>
                            </div>
                        </li>
                    ))}
                </ol>
            </nav>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                {renderStepContent()}
            </div>

            <aside className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-xl font-lora font-semibold text-text-dark mb-4">Order Summary</h3>
                    <ul className="divide-y divide-gray-200 text-sm">
                        {cartItems.map(item => (
                            <li key={item.id} className="flex justify-between py-3">
                                <span className="text-gray-800">{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                                <span className="font-medium text-gray-800">₦{(item.price * item.quantity).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t border-gray-200 pt-4 mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium text-gray-800">₦{subtotal.toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-600">Delivery</span>
                            <span className="font-medium text-gray-800">₦{shippingCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-gray-900 pt-2">
                            <span>Total</span>
                            <span>₦{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
  );
};

export default Checkout;