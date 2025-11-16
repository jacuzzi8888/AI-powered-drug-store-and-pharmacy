import React, { useState, useMemo, ChangeEvent } from 'react';
import { Product } from '../types';
import { PlusIcon, TrashIcon, ArchiveBoxIcon } from './icons/Icons';

interface InventoryManagerProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  onRemoveProduct: (productId: string) => void;
}

const initialFormState = {
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    stock: '',
};

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="p-2 border border-stone-300 rounded-md w-full focus:ring-2 focus:ring-[#3A7D44] focus:border-[#3A7D44] outline-none" />
);
const FormTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className="p-2 border border-stone-300 rounded-md w-full focus:ring-2 focus:ring-[#3A7D44] focus:border-[#3A7D44] outline-none" />
);
const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className="p-2 border border-stone-300 rounded-md w-full focus:ring-2 focus:ring-[#3A7D44] focus:border-[#3A7D44] outline-none" />
);

const InventoryManager: React.FC<InventoryManagerProps> = ({ products, onAddProduct, onRemoveProduct }) => {
  const [newProduct, setNewProduct] = useState(initialFormState);
  const [filterCategory, setFilterCategory] = useState('All');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  
  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'category') {
        if (value === '__addNew__') {
            setIsAddingNewCategory(true);
            setNewProduct(prev => ({ ...prev, category: '' }));
        } else {
            setIsAddingNewCategory(false);
            setNewProduct(prev => ({ ...prev, category: value }));
        }
    } else {
       setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setImagePreview(result);
            setNewProduct(prev => ({ ...prev, imageUrl: result }));
        };
        reader.readAsDataURL(file);
    } else {
        setImagePreview(null);
        setNewProduct(prev => ({ ...prev, imageUrl: '' }));
        if(file) alert("Please select a valid image file.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(newProduct).some(val => String(val).trim() === '')) {
        alert('Please fill out all fields and upload an image.');
        return;
    }
     if (isNaN(parseFloat(newProduct.price)) || parseFloat(newProduct.price) <= 0) {
        alert('Please enter a valid price.');
        return;
    }
     if (isNaN(parseInt(newProduct.stock, 10)) || parseInt(newProduct.stock, 10) < 0) {
        alert('Please enter a valid stock quantity (0 or more).');
        return;
    }
    onAddProduct({ ...newProduct, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock, 10) });
    setNewProduct(initialFormState);
    setImagePreview(null);
    setIsAddingNewCategory(false);
  };

  const handleRemove = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to remove "${productName}" from the inventory?`)) {
        onRemoveProduct(productId);
    }
  };

  const filteredProducts = useMemo(() => {
    if (filterCategory === 'All') {
      return products;
    }
    return products.filter(p => p.category === filterCategory);
  }, [products, filterCategory]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-6 md:mb-8">
        <h1 className="text-4xl font-bold font-lora text-[#344F1F]">Inventory Management</h1>
        <p className="mt-2 text-lg text-[#344F1F]/80">Add, remove, and manage your product stock.</p>
      </header>

      <div className="bg-[#EAF6E6] p-6 rounded-lg shadow-sm border border-[#3A7D44]/20 mb-8">
        <h2 className="text-xl font-semibold font-lora text-[#344F1F] mb-4 flex items-center">
            <PlusIcon className="h-6 w-6 mr-2" />
            Add a New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput type="text" name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Product Name" required />
                <FormInput type="number" name="price" value={newProduct.price} onChange={handleInputChange} placeholder="Price (e.g., 4.99)" step="0.01" required />
                <div className="space-y-2">
                    <FormSelect name="category" value={isAddingNewCategory ? '__addNew__' : newProduct.category} onChange={handleInputChange} required>
                        <option value="" disabled>Select a Category</option>
                        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="__addNew__">Add New Category...</option>
                    </FormSelect>
                    {isAddingNewCategory && (
                         <FormInput type="text" name="category" value={newProduct.category} onChange={handleInputChange} placeholder="New Category Name" required />
                    )}
                </div>
                <FormInput type="number" name="stock" value={newProduct.stock} onChange={handleInputChange} placeholder="Stock Quantity" step="1" required />
            </div>
            <FormTextArea name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Product Description" rows={3} required />
            <div className="flex items-center gap-4">
                <div className="w-full">
                    <label htmlFor="image-upload" className="block text-sm font-medium text-[#344F1F] mb-1">Product Image</label>
                    <input id="image-upload" type="file" name="imageUrl" onChange={handleImageChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#3A7D44]/20 file:text-[#3A7D44] hover:file:bg-[#3A7D44]/30" required />
                </div>
                {imagePreview && (
                    <div className="flex-shrink-0">
                        <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-md border" />
                    </div>
                )}
            </div>
            <div className="flex justify-end">
                <button type="submit" className="px-5 py-2.5 bg-[#F4991A] text-white font-semibold rounded-full shadow-sm hover:bg-opacity-90">Add Product</button>
            </div>
        </form>
      </div>

      <div className="bg-[#EAF6E6] p-6 rounded-lg shadow-sm border border-[#3A7D44]/20">
        <h2 className="text-xl font-semibold font-lora text-[#344F1F] mb-4 flex items-center">
            <ArchiveBoxIcon className="h-6 w-6 mr-2" />
            Current Inventory ({filteredProducts.length})
        </h2>
         <div className="flex justify-start flex-wrap gap-3 mb-4 border-b border-[#3A7D44]/20 pb-4">
            {categories.map(category => (
                <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    filterCategory === category
                    ? 'bg-[#3A7D44] text-white shadow-md'
                    : 'bg-white text-[#344F1F] hover:bg-white/70 border border-[#3A7D44]/20'
                }`}
                >
                {category}
                </button>
            ))}
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#3A7D44]/20">
                <thead className="bg-white/50">
                    <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody className="bg-[#EAF6E6] divide-y divide-[#3A7D44]/20">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(p => (
                             <tr key={p.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-md object-cover" src={p.imageUrl} alt={p.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-[#344F1F]">{p.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${p.price.toFixed(2)}</td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${p.stock <= 0 ? 'bg-red-100 text-red-800' : p.stock <= 10 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                                        {p.stock}
                                    </span>
                                 </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleRemove(p.id, p.name)} className="text-[#F4991A] hover:text-opacity-80 flex items-center">
                                        <TrashIcon className="h-4 w-4 mr-1"/> Remove
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-10 text-gray-500">
                                No products found in this category.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;