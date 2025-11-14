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
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group flex flex-col cursor-pointer" onClick={() => onQuickView(product)}>
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
        <p className="text-sm font-semibold text-teal-600">{product.category}</p>
        <h3 className="text-lg font-bold text-gray-800 truncate mt-1 h-7">{product.name}</h3>
        <div className="flex-grow"></div>
        <div className="mt-2">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-extrabold text-gray-900">${product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            disabled={added}
            aria-label={`Add ${product.name} to cart`}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 flex items-center justify-center w-[110px] h-[40px] ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            {added ? 'Added ✓' : (
              <>
                <ShoppingCartIcon className="h-5 w-5 mr-1.5" />
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Explore Our Aisles</h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">Find all your everyday health and wellness essentials.</p>
        </header>

        <div className="mb-8 space-y-4">
             <div className="max-w-xl mx-auto">
                <input
                    type="search"
                    placeholder="Search for vitamins, pain relief, and more..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-5 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
                />
            </div>
            <div className="flex justify-center flex-wrap gap-3">
                {categories.map(category => (
                    <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                        selectedCategory === category
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                    >
                    {category}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
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