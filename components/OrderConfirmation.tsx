import React from 'react';
import { Order, OrderStatus } from '../types';
import { View } from '../App';
import { CheckCircleIcon, ShoppingCartIcon, ArchiveBoxIcon, TruckIcon, CurrencyDollarIcon } from './icons/Icons';

interface OrderConfirmationProps {
  order: Order | null;
  setView: (view: View) => void;
}

const NextStep: React.FC<{ icon: React.ElementType, title: string, description: string, isLast?: boolean, status: 'complete' | 'current' | 'upcoming' }> = ({ icon: Icon, title, description, isLast = false, status }) => {
    const statusClasses = {
        complete: {
            line: 'bg-primary-teal',
            iconBg: 'bg-primary-teal',
            iconEl: CheckCircleIcon,
            iconColor: 'text-white'
        },
        current: {
            line: 'bg-gray-300',
            iconBg: 'bg-secondary-blue ring-4 ring-secondary-blue/30',
            iconEl: Icon,
            iconColor: 'text-white'
        },
        upcoming: {
            line: 'bg-gray-300',
            iconBg: 'bg-gray-300',
            iconEl: Icon,
            iconColor: 'text-white'
        }
    };
    
    const { line, iconBg, iconEl: StatusIcon, iconColor } = statusClasses[status];

    return (
        <div className="relative flex items-start">
            {!isLast && <div className={`absolute top-5 left-5 -ml-px mt-0.5 h-full w-0.5 ${line}`} aria-hidden="true"></div>}
            <div className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${iconBg} transition-all duration-300`}>
                <StatusIcon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
            </div>
            <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="mt-0.5 text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );
};

const OrderStatusTracker: React.FC<{ order: Order }> = ({ order }) => {
  const steps = [
    { id: OrderStatus.Processing, title: 'Order Processing', description: 'We are confirming your payment details.', icon: ArchiveBoxIcon },
    { id: OrderStatus.Paid, title: 'Payment Confirmed', description: 'Your payment was successful. Our pharmacists are now preparing your items.', icon: CurrencyDollarIcon },
    { id: OrderStatus.Shipped, title: 'Shipped', description: 'Your order is on its way.', icon: TruckIcon },
    { id: OrderStatus.Delivered, title: 'Delivered', description: 'Your order has been delivered.', icon: CheckCircleIcon }
  ];
  const currentStepIndex = steps.findIndex(step => step.id === order.status);

  return (
    <div>
      <h2 className="text-xl font-lora font-semibold text-text-dark mb-6 text-center">Order Status</h2>
      <div className="space-y-6">
        {steps.map((step, index) => {
          let stepStatus: 'complete' | 'current' | 'upcoming' = 'upcoming';
          if (index < currentStepIndex) {
            stepStatus = 'complete';
          } else if (index === currentStepIndex) {
            stepStatus = 'current';
          }
          
          return (
            <div key={step.id}>
                <NextStep 
                    icon={step.icon}
                    title={step.title}
                    description={step.description}
                    status={stepStatus}
                    isLast={index === steps.length - 1}
                />
                {step.id === OrderStatus.Shipped && order.trackingLink && (index <= currentStepIndex) && (
                     <div className="ml-14 mt-2 pl-4">
                        <a href={order.trackingLink} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-secondary-blue text-white text-sm font-semibold rounded-full hover:bg-opacity-90 transition-colors">
                            Track Shipment
                        </a>
                    </div>
                )}
            </div>
          )
        })}
      </div>
    </div>
  );
};


const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, setView }) => {
  if (!order) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold font-lora text-red-600">Order Not Found</h1>
        <p className="mt-2 text-gray-600">We couldn't find the details of your order. Please check your order history.</p>
        <button onClick={() => setView('dashboard')} className="mt-6 px-6 py-2 bg-primary-teal text-white font-semibold rounded-full shadow-sm hover:bg-opacity-90">
          Back to My Health Hub
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-text-dark font-lora">Thank you for your order!</h1>
            <p className="mt-2 text-lg text-text-medium">Your order has been placed successfully and is now being processed.</p>
            <p className="mt-1 text-sm text-gray-500">Order ID: <span className="font-mono">{order.id}</span></p>
        </div>

        <div className="my-8 text-left border-t border-b border-gray-200 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h3 className="font-semibold text-lg mb-2 font-lora text-text-dark">Delivering to:</h3>
                    <address className="not-italic text-gray-700">
                        {order.shippingAddress.fullName}<br/>
                        {order.shippingAddress.addressLine1}<br/>
                        {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}
                    </address>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg mb-2 font-lora text-text-dark">Order Summary:</h3>
                     <ul className="text-gray-700 space-y-1">
                        {order.items.map(item => (
                          <li key={item.id} className="flex justify-between">
                            <span>{item.name} x{item.quantity}</span>
                            <span>₦{(item.quantity * item.price).toLocaleString()}</span>
                          </li>
                        ))}
                        <li className="flex justify-between font-semibold pt-2 border-t border-dashed">
                            <span>Total</span>
                            <span>₦{order.total.toLocaleString()}</span>
                        </li>
                      </ul>
                </div>
            </div>
        </div>
        
        <OrderStatusTracker order={order} />

        <div className="mt-10 text-center">
            <button 
              onClick={() => setView('products')} 
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-teal hover:bg-opacity-90"
            >
              <ShoppingCartIcon className="-ml-1 mr-2 h-5 w-5" />
              Continue Shopping
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;