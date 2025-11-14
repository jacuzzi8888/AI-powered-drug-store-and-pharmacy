import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ShoppingCartIcon, EyeIcon, StarIcon } from './icons/Icons';

const StarRating: React.FC<{ rating: number, reviewCount: number }> = ({ rating, reviewCount }) => {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 ml-2">{reviewCount} reviews</span>
    </div>
  );
};

export const ProductCard: React.FC<{ product: Product, onAddToCart: (product: Product, quantity: number) => void, onQuickView: (product: Product) => void }> = ({ product, onAddToCart, onQuickView }) => {
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group flex flex-col cursor-pointer" onClick={() => onQuickView(product)}>
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover object-center" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <button
                onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full text-sm font-semibold flex items-center backdrop-blur-sm"
                aria-label={`Quick view ${product.name}`}
            >
                <EyeIcon className="h-5 w-5 mr-2" />
                Quick View
            </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
        <h3 className="text-base font-semibold text-gray-800 truncate mt-1 h-6">{product.name}</h3>
        <div className="mt-2">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="flex-grow"></div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            disabled={added}
            aria-label={`Add ${product.name} to cart`}
            className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 flex items-center justify-center w-[100px] h-[38px] ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {added ? 'Added ✓' : (
              <>
                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProductsProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onQuickView: (product: Product) => void;
}

const Products: React.FC<ProductsProps> = ({ products, onAddToCart, onQuickView }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, selectedCategory, searchTerm]);

  return (
    <>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Shop Over-the-Counter</h1>
          <p className="mt-2 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">Browse our curated selection of everyday health and wellness products.</p>
        </header>

        <div className="mb-8 space-y-4">
             <div className="max-w-xl mx-auto">
                <input
                    type="search"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex justify-center flex-wrap gap-2">
                {categories.map(category => (
                    <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                        selectedCategory === category
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                    >
                    {category}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
         {filteredProducts.length === 0 && (
            <div className="text-center py-10 col-span-full">
                <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
         )}
      </div>
    </>
  );
};

export default Products;