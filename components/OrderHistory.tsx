import React from 'react';
import { Order } from '../types';
import { ClipboardDocumentListIcon } from './icons/Icons';

interface OrderHistoryProps {
  orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <p className="mt-1 text-base text-gray-600">Review your past purchases.</p>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <ClipboardDocumentListIcon className="mx-auto h-16 w-16 text-gray-300" />
          <p className="mt-4 text-xl font-semibold text-gray-700">No orders yet</p>
          <p className="mt-1 text-gray-500">Your past orders will appear here after you check out.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-200 pb-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono text-sm font-medium text-gray-800">{order.id}</p>
                </div>
                <div className="mt-2 sm:mt-0 sm:text-right">
                  <p className="text-sm text-gray-500">Order Placed</p>
                  <p className="font-medium text-gray-800">{order.date.toLocaleDateString()}</p>
                </div>
                <div className="mt-2 sm:mt-0 sm:text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold text-xl text-gray-900">${order.total.toFixed(2)}</p>
                </div>
              </div>
              
              <h3 className="text-base font-semibold text-gray-700 mb-2">Items</h3>
              <ul className="divide-y divide-gray-100">
                {order.items.map(item => (
                  <li key={item.id} className="flex py-3">
                    <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                    <div className="ml-4 flex-1 flex flex-col justify-center">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium text-gray-800">${(item.quantity * item.price).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;