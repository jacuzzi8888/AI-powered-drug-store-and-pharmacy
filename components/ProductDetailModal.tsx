import React, { useState } from 'react';
import { Product } from '../types';
import { XMarkIcon, ShoppingCartIcon, StarIcon } from './icons/Icons';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const StarRating: React.FC<{ rating: number, reviewCount: number }> = ({ rating, reviewCount }) => {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-5 w-5 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600 ml-3">{rating.toFixed(1)} stars ({reviewCount} reviews)</span>
    </div>
  );
};

const StockBadge: React.FC<{ stock: number }> = ({ stock }) => {
    if (stock <= 0) {
        return <span className="px-2 py-1 text-xs font-bold text-red-800 bg-red-100 rounded-full">Out of Stock</span>;
    }
    if (stock <= 10) {
        return <span className="px-2 py-1 text-xs font-bold text-amber-800 bg-amber-100 rounded-full">Low Stock ({stock} left)</span>;
    }
    return <span className="px-2 py-1 text-xs font-bold text-green-800 bg-green-100 rounded-full">In Stock</span>;
};


const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  const handleAddToCart = () => {
    onAddToCart(product, quantity);
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
        className="bg-white rounded-lg shadow-xl transform transition-all w-full max-w-4xl mx-auto flex flex-col md:flex-row overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-1/2">
            <img src={product.imageUrl} alt={product.name} className="w-full h-64 md:h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-6 flex flex-col relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10">
                <XMarkIcon className="h-6 w-6" />
                <span className="sr-only">Close</span>
            </button>

            <div className="flex-grow">
                <span className="text-sm font-semibold text-teal-600 uppercase tracking-wide">{product.category}</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h2>
                <div className="my-4 flex justify-between items-center">
                    <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                    <StockBadge stock={product.stock} />
                </div>
                <p className="text-3xl font-bold text-gray-800 my-4">${product.price.toFixed(2)}</p>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-4">
                <button
                    onClick={handleAddToCart}
                    disabled={added || product.stock <= 0}
                    className={`w-full px-6 py-3 font-semibold rounded-md transition-all duration-300 flex items-center justify-center ${
                    added
                        ? 'bg-green-500 text-white'
                        : product.stock <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    {added ? 'Added to Cart!' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;