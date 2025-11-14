import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import PrescriptionManager from './components/PrescriptionManager';
import AiAssistant from './components/AiAssistant';
import Products from './components/Products';
import Cart from './components/Cart';
import ProductDetailModal from './components/ProductDetailModal';
import { Prescription, PrescriptionStatus, Product, CartItem } from './types';

export type View = 'dashboard' | 'prescriptions' | 'ai-assistant' | 'products';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isCartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 'px-001',
      fileName: 'Dr_Smith_Rx_Amoxicillin.pdf',
      fileUrl: 'https://picsum.photos/seed/px001/200/300',
      status: PrescriptionStatus.Approved,
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      stampJws: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJweC0wMDEiLCJ2ZXJpZmllcl9pZCI6InBoYXJtLTAwNyIsImlhdCI6MTcxOTI4NzYwMCwiZmlsZV9zaGEyNTYiOiJlM2IwYzQ0MmY2ZDE1MTFjZGU3ZTY4OWU4YzFjYTY1OThlY2FjYjBlNzYxYzc2ZGNmMDY3NTllN2M2OTgxZWM3In0.fake_signature_string_for_demo',
    },
    {
      id: 'px-002',
      fileName: 'Prescription_Photo_Jan24.jpg',
      fileUrl: 'https://picsum.photos/seed/px002/200/300',
      status: PrescriptionStatus.Rejected,
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'px-003',
      fileName: 'Cardiology_Consult_Rx.pdf',
      fileUrl: 'https://picsum.photos/seed/px003/200/300',
      status: PrescriptionStatus.Pending,
      submittedAt: new Date(),
    },
  ]);

  const [products] = useState<Product[]>([
    {
      id: 'prod-001',
      name: 'Ibuprofen 200mg Tablets',
      description: 'Provides powerful relief from various types of pain including headaches, dental pain, and menstrual cramps. Also effective in reducing inflammation and fever. Contains 24 easy-to-swallow tablets.',
      price: 4.99,
      imageUrl: 'https://picsum.photos/seed/ibuprofen/400/400',
      category: 'Pain Relief',
      rating: 4.5,
      reviewCount: 120,
    },
    {
      id: 'prod-002',
      name: 'Allergy Relief Antihistamine',
      description: 'Offers 24-hour non-drowsy relief from common allergy symptoms such as sneezing, runny nose, itchy eyes, and hives. One tablet a day keeps your allergies at bay. 30 tablets per pack.',
      price: 12.50,
      imageUrl: 'https://picsum.photos/seed/allergy/400/400',
      category: 'Allergy & Hay Fever',
      rating: 4.8,
      reviewCount: 254,
    },
    {
      id: 'prod-003',
      name: 'Vitamin C 1000mg Effervescent',
      description: 'Boost your immune system with these high-strength Vitamin C tablets. The effervescent formula makes for a refreshing, easy-to-take orange-flavored drink. Contains 20 tablets.',
      price: 7.29,
      imageUrl: 'https://picsum.photos/seed/vitaminc/400/400',
      category: 'Vitamins & Supplements',
      rating: 4.7,
      reviewCount: 98,
    },
    {
      id: 'prod-004',
      name: 'Digital Thermometer',
      description: 'Get fast, accurate, and reliable temperature readings in seconds. Suitable for oral, rectal, or underarm use. Features a flexible tip and a clear digital display. Essential for every home first aid kit.',
      price: 9.99,
      imageUrl: 'https://picsum.photos/seed/thermo/400/400',
      category: 'Health & Diagnostics',
      rating: 4.2,
      reviewCount: 75,
    },
    {
      id: 'prod-005',
      name: 'Hydrocolloid Blemish Patches',
      description: 'A gentle yet effective solution for acne. These patches absorb impurities, reduce inflammation, and create a protective barrier to speed up healing. 72 invisible patches in various sizes.',
      price: 8.49,
      imageUrl: 'https://picsum.photos/seed/acne/400/400',
      category: 'Skincare',
      rating: 4.9,
      reviewCount: 310,
    },
    {
      id: 'prod-006',
      name: 'Soothing Throat Lozenges',
      description: 'Provides fast-acting relief for sore, scratchy throats. The honey and lemon flavor is both comforting and effective. Each pack contains 36 individually wrapped lozenges.',
      price: 3.99,
      imageUrl: 'https://picsum.photos/seed/cough/400/400',
      category: 'Cold & Flu',
      rating: 4.4,
      reviewCount: 88,
    },
  ]);

  const addPrescription = useCallback((file: File) => {
    const newPrescription: Prescription = {
      id: `px-${Date.now()}`,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      status: PrescriptionStatus.Pending,
      submittedAt: new Date(),
    };
    
    setPrescriptions(prev => [newPrescription, ...prev]);

    // Simulate OCR and verification process
    setTimeout(() => {
      setPrescriptions(prev => prev.map(p => {
        if (p.id === newPrescription.id) {
          const statuses = [PrescriptionStatus.Approved, PrescriptionStatus.Rejected, PrescriptionStatus.NeedsClarification];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          const updatedPrescription: Prescription = { ...p, status: randomStatus };
          if (randomStatus === PrescriptionStatus.Approved) {
            updatedPrescription.stampJws = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJweC1uZXciLCJ2ZXJpZmllcl9pZCI6InBoYXJtLTAwNyIsImlhdCI6MTcxOTI4NzYwMCwiZmlsZV9zaGEyNTYiOiJmYWtlX2hhc2hfZm9yX2RlbW8ifQ.another_fake_signature_for_demo';
          }
          return updatedPrescription;
        }
        return p;
      }));
    }, 5000 + Math.random() * 3000); // Simulate network + processing delay

  }, []);

  const handleAddToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item.id !== productId);
      }
      return prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  const handleRemoveFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Home 
                  setView={setCurrentView} 
                  products={products.slice(0, 4)} 
                  prescriptions={prescriptions}
                  onAddToCart={handleAddToCart}
                  onQuickView={setSelectedProduct}
                />;
      case 'prescriptions':
        return <PrescriptionManager prescriptions={prescriptions} onUpload={addPrescription} />;
      case 'products':
        return <Products products={products} onAddToCart={handleAddToCart} onQuickView={setSelectedProduct} />;
      case 'ai-assistant':
        return <AiAssistant />;
      default:
        return <Home 
                  setView={setCurrentView} 
                  products={products.slice(0, 4)}
                  prescriptions={prescriptions}
                  onAddToCart={handleAddToCart}
                  onQuickView={setSelectedProduct}
                />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header 
        currentView={currentView} 
        setView={setCurrentView}
        cartItemCount={cartItemCount}
        onCartClick={() => setCartOpen(true)}
      />
      <Cart 
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
      />
       {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={handleAddToCart}
        />
      )}
      <main className="flex-1 w-full">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;