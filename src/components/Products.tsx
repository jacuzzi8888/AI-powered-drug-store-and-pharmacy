
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ShoppingCartIcon, EyeIcon, CheckCircleIcon } from './icons/Icons';

const PharmacistRecommendedBadge: React.FC = () => (
    <div className="flex items-center">
        <CheckCircleIcon className="h-4 w-4 text-primary-teal" />
        <span className="text-xs text-gray-600 ml-1.5 font-medium">Pharmacist Recommended</span>
    </div>
);

const StockBadge: React.FC<{ stock: number }> = ({ stock }) => {
    if (stock <= 0) {
        return <span className="text-xs font-medium text-red-700">Out of Stock</span>;
    }
    return <span className="text-xs font-medium text-primary-teal">In Stock</span>;
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
    <div className="bg-white rounded-2xl shadow-sm border border-light-aqua/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col">
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
       <div className="p-5 flex flex-col flex-grow">
        <p className="text-sm font-semibold text-primary-teal">{product.category}</p>
        <h3 className="text-lg font-lora font-bold text-text-dark mt-1 h-14">{product.name}</h3>
        <div className="flex-grow"></div>
        <div className="mt-2 flex justify-between items-center">
            {product.isRecommended ? <PharmacistRecommendedBadge /> : <div/>}
            <StockBadge stock={product.stock} />
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-2xl font-bold text-text-dark">₦{product.price.toLocaleString()}</p>
          <button
            onClick={handleAddToCart}
            disabled={added || product.stock <= 0}
            aria-label={`Add ${product.name} to cart`}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 flex items-center justify-center w-[120px] h-[40px] ${
              added
                ? 'bg-green-500 text-white'
                : product.stock <= 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-secondary-blue text-white hover:bg-opacity-90'
            }`}
          >
            {added ? 'Added ✓' : product.stock <= 0 ? 'Out of Stock' : (
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
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  
  const filteredProducts = useMemo(() => {
    const minPrice = parseFloat(priceRange.min);
    const maxPrice = parseFloat(priceRange.max);

    return products
      .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(p => isNaN(minPrice) || p.price >= minPrice)
      .filter(p => isNaN(maxPrice) || p.price <= maxPrice);
  }, [products, selectedCategory, searchTerm, priceRange]);

  return (
    <>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-dark tracking-tight font-lora">Health & Wellness Shop</h1>
          <p className="mt-3 text-lg text-text-medium max-w-2xl mx-auto">Find all your everyday health and wellness essentials, curated for your needs.</p>
        </header>

        <div className="mb-10 space-y-4">
            <div className="max-w-xl mx-auto">
                <input type="search" placeholder="Search for vitamins, pain relief, and more..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-5 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-teal text-base"/>
            </div>
             <div className="flex justify-center flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min Price" value={priceRange.min} onChange={e => setPriceRange(p => ({...p, min: e.target.value}))} className="w-24 px-3 py-1.5 border border-gray-300 rounded-full text-sm"/>
                    <span>-</span>
                    <input type="number" placeholder="Max Price" value={priceRange.max} onChange={e => setPriceRange(p => ({...p, max: e.target.value}))} className="w-24 px-3 py-1.5 border border-gray-300 rounded-full text-sm"/>
                </div>
            </div>
            <div className="flex justify-center flex-wrap gap-3">
                {categories.map(category => (
                    <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${selectedCategory === category ? 'bg-primary-teal text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
                        {category}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onQuickView={onQuickView} />
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
