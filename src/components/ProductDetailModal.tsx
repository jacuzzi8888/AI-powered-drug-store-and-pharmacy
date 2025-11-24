import React, { useState } from 'react';
import { Product } from '../types';
import { XMarkIcon, ShoppingCartIcon, ShieldCheckIcon, CheckCircleIcon } from './icons/Icons';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const PharmacistRecommendedBadge: React.FC = () => (
    <div className="flex items-center">
        <CheckCircleIcon className="h-5 w-5 text-primary-teal" />
        <span className="text-sm text-gray-700 ml-2 font-medium">Pharmacist Recommended</span>
    </div>
);

const StockBadge: React.FC<{ stock: number }> = ({ stock }) => {
    if (stock <= 0) {
        return <span className="px-2 py-1 text-xs font-bold text-red-800 bg-red-100 rounded-full">Out of Stock</span>;
    }
    return <span className="px-2 py-1 text-xs font-bold text-green-800 bg-green-100 rounded-full">In Stock</span>;
};

const InfoTab: React.FC<{product: Product}> = ({product}) => {
    const [activeTab, setActiveTab] = useState('description');
    
    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'details', label: 'Details & Ingredients' },
        { id: 'usage', label: 'Usage Instructions' },
    ];
    
    return (
        <div>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-primary-teal text-primary-teal'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-4 text-sm text-gray-600">
                {activeTab === 'description' && <p>{product.description}</p>}
                {activeTab === 'details' && <p>Detailed ingredients and other product information would be listed here.</p>}
                {activeTab === 'usage' && <p>Clear, step-by-step usage instructions would be provided here for patient safety and clarity.</p>}
            </div>
        </div>
    )
};


const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart }) => {
  const [added, setAdded] = useState(false);
  
  const handleAddToCart = () => {
    onAddToCart(product, 1);
    setAdded(true);
    setTimeout(() => {
        onClose();
    }, 1500);
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" 
        aria-labelledby="modal-title" 
        role="dialog" 
        aria-modal="true" 
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl transform transition-all w-full max-w-4xl mx-auto flex flex-col md:flex-row overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-1/2">
            <img src={product.imageUrl} alt={product.name} className="w-full h-64 md:h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10">
                <XMarkIcon className="h-6 w-6" />
                <span className="sr-only">Close</span>
            </button>

            <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                <span className="text-sm font-semibold text-primary-teal uppercase tracking-wide">{product.category}</span>
                <h2 className="text-3xl font-bold font-lora text-text-dark mt-2">{product.name}</h2>
                <div className="my-4 flex justify-between items-center">
                    {product.isRecommended ? <PharmacistRecommendedBadge /> : <div />}
                    <StockBadge stock={product.stock} />
                </div>
                
                <div className="my-6 bg-blue-50 border-l-4 border-secondary-blue p-4 rounded-r-lg">
                    <h4 className="font-bold text-blue-800 flex items-center"><ShieldCheckIcon className="h-5 w-5 mr-2"/> Pharmacist's Note</h4>
                    <p className="text-sm text-blue-700 mt-1">Always follow the recommended dosage. If symptoms persist, consult with a healthcare professional.</p>
                </div>
                
                <InfoTab product={product} />

            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between gap-4">
                 <p className="text-3xl font-bold text-text-dark">₦{product.price.toLocaleString()}</p>
                <button
                    onClick={handleAddToCart}
                    disabled={added || product.stock <= 0}
                    className={`px-6 py-3 font-semibold rounded-full transition-all duration-300 flex items-center justify-center w-2/3 ${
                    added
                        ? 'bg-green-500 text-white'
                        : product.stock <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-secondary-blue text-white hover:bg-opacity-90'
                    }`}
                >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    {added ? 'Added to Basket!' : product.stock <= 0 ? 'Out of Stock' : 'Add to Basket'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;