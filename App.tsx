

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import PrescriptionManager from './components/PrescriptionManager';
import AiAssistant from './components/AiAssistant';
import Products from './components/Products';
import Cart from './components/Cart';
import ProductDetailModal from './components/ProductDetailModal';
import { Prescription, PrescriptionStatus, Product, CartItem, Order, User, ShippingAddress, OrderStatus, PharmacistMessage, Notification, UserProfile } from './types';
import OrderHistory from './components/OrderHistory';
import InventoryManager from './components/InventoryManager';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import MyAccount from './components/MyAccount';
import PharmacistMessaging from './components/PharmacistMessaging';
import HealthHub from './components/HealthHub';
import NotificationContainer from './components/ui/NotificationContainer';

export type View = 'dashboard' | 'prescriptions' | 'ai-assistant' | 'products' | 'order-history' | 'inventory' | 'login' | 'admin-dashboard' | 'checkout' | 'order-confirmation' | 'my-account' | 'pharmacist-messaging' | 'health-hub';

const defaultProducts: Product[] = [
    {
      id: 'prod-001',
      name: 'Ibuprofen 200mg Tablets',
      description: 'Provides powerful relief from various types of pain including headaches, dental pain, and menstrual cramps. Also effective in reducing inflammation and fever. Contains 24 easy-to-swallow tablets.',
      price: 7500,
      imageUrl: 'https://picsum.photos/seed/ibuprofen/400/400',
      category: 'Pain Relief',
      stock: 100,
      isRecommended: true,
    },
    {
      id: 'prod-002',
      name: 'Allergy Relief Antihistamine',
      description: 'Offers 24-hour non-drowsy relief from common allergy symptoms such as sneezing, runny nose, itchy eyes, and hives. One tablet a day keeps your allergies at bay. 30 tablets per pack.',
      price: 18500,
      imageUrl: 'https://picsum.photos/seed/allergy/400/400',
      category: 'Allergy & Hay Fever',
      stock: 75,
    },
    {
      id: 'prod-003',
      name: 'Vitamin C 1000mg Effervescent',
      description: 'Boost your immune system with these high-strength Vitamin C tablets. The effervescent formula makes for a refreshing, easy-to-take orange-flavored drink. Contains 20 tablets.',
      price: 11000,
      imageUrl: 'https://picsum.photos/seed/vitaminc/400/400',
      category: 'Vitamins & Supplements',
      stock: 50,
      isRecommended: true,
    },
    {
      id: 'prod-004',
      name: 'Digital Thermometer',
      description: 'Get fast, accurate, and reliable temperature readings in seconds. Suitable for oral, rectal, or underarm use. Features a flexible tip and a clear digital display. Essential for every home first aid kit.',
      price: 15000,
      imageUrl: 'https://picsum.photos/seed/thermo/400/400',
      category: 'Health & Diagnostics',
      stock: 30,
    },
    {
      id: 'prod-005',
      name: 'Hydrocolloid Blemish Patches',
      description: 'A gentle yet effective solution for acne. These patches absorb impurities, reduce inflammation, and create a protective barrier to speed up healing. 72 invisible patches in various sizes.',
      price: 12500,
      imageUrl: 'https://picsum.photos/seed/acne/400/400',
      category: 'Skincare',
      stock: 0,
    },
    {
      id: 'prod-006',
      name: 'Soothing Throat Lozenges',
      description: 'Provides fast-acting relief for sore, scratchy throats. The honey and lemon flavor is both comforting and effective. Each pack contains 36 individually wrapped lozenges.',
      price: 6000,
      imageUrl: 'https://picsum.photos/seed/cough/400/400',
      category: 'Cold & Flu',
      stock: 120,
      isRecommended: true,
    },
  ];
  
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('products');
  const [isCartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [latestOrderId, setLatestOrderId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const addNotification = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type,
    };
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 'px-001',
      fileName: 'Dr_Smith_Rx_Amoxicillin.pdf',
      fileUrl: 'https://picsum.photos/seed/px001/200/300',
      status: PrescriptionStatus.Approved,
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      stampJws: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJweC0wMDEiLCJ2ZXJpZmllcl9pZCI6InBoYXJtLTAwNyIsImlhdCI6MTcxOTI4NzYwMCwiZmlsZV9zaGEyNTYiOiJlM2IwYzQ0MmY2ZDE1MTFjZGU3ZTY4OWU4YzFjYTY1OThlY2FjYjBlNzYxYzc2ZGNmMDY3NTllN2M2OTgxZWM3In0.fake_signature_string_for_demo',
      autoRefill: true,
    },
    {
      id: 'px-002',
      fileName: 'Prescription_Photo_Jan24.jpg',
      fileUrl: 'https://picsum.photos/seed/px002/200/300',
      status: PrescriptionStatus.Rejected,
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      pharmacistNote: 'The image provided is too blurry to read the dosage instructions clearly. Please upload a clearer picture.',
      autoRefill: false,
    },
    {
      id: 'px-003',
      fileName: 'Cardiology_Consult_Rx.pdf',
      fileUrl: 'https://picsum.photos/seed/px003/200/300',
      status: PrescriptionStatus.Pending,
      submittedAt: new Date(),
      autoRefill: false,
    },
  ]);
  
  const [pharmacistMessages, setPharmacistMessages] = useState<PharmacistMessage[]>([
    { id: 'msg-1', sender: 'pharmacist', text: 'Hello! This is a secure channel to chat with a licensed pharmacist. How can I help you today? Please note, this chat is for non-emergency questions only.', timestamp: new Date(Date.now() - 5 * 60 * 1000), isRead: false },
  ]);

  const [products, setProducts] = useState<Product[]>(() => {
    try {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            return JSON.parse(storedProducts);
        }
    } catch (error) {
        console.error("Failed to load products from localStorage", error);
    }
    // On first load, save default products to localStorage
    localStorage.setItem('products', JSON.stringify(defaultProducts));
    return defaultProducts;
  });
  
  const getUserData = (email: string): User | null => {
    const data = localStorage.getItem(`user_${email}`);
    return data ? JSON.parse(data) : null;
  };
  
  const saveUserData = (user: User) => {
    localStorage.setItem(`user_${user.email}`, JSON.stringify(user));
  };

  useEffect(() => {
    try {
        const loggedInUserEmail = localStorage.getItem('currentUserEmail');
        if (loggedInUserEmail) {
            const userData = getUserData(loggedInUserEmail);
            if(userData) {
                setCurrentUser(userData);
            }
        }
    } catch (error) {
        console.error("Failed to load user from local storage", error);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
        console.error("Failed to save products to localStorage", error);
    }
  }, [products]);
  
  useEffect(() => {
    try {
        const storedOrders = localStorage.getItem('orderHistory');
        if (storedOrders) {
            const parsedOrders: Order[] = JSON.parse(storedOrders).map((order: any) => ({
                ...order,
                date: new Date(order.date), // Rehydrate Date object
                status: order.status || OrderStatus.Delivered, // Default old orders to Delivered
            }));
            setOrders(parsedOrders);
        }
    } catch (error) {
        console.error("Failed to load or parse orders from localStorage", error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let ordersChanged = false;
      let notificationMessage: string | null = null;
      let orderIdForNotification: string | null = null;
  
      const updatedOrders = orders.map(order => {
        const secondsSinceOrder = (new Date().getTime() - new Date(order.date).getTime()) / 1000;
  
        if (order.status === OrderStatus.Processing && secondsSinceOrder > 5) {
          ordersChanged = true;
          notificationMessage = `Payment for order ${order.id.slice(-6)} confirmed!`;
          orderIdForNotification = order.id;
          return { ...order, status: OrderStatus.Paid };
        } else if (order.status === OrderStatus.Paid && secondsSinceOrder > 10) { // Shortened for demo
          ordersChanged = true;
          notificationMessage = `Your order ${order.id.slice(-6)} has shipped!`;
          orderIdForNotification = order.id;
          return { ...order, status: OrderStatus.Shipped, trackingLink: `https://example-courier.com/track?id=${order.id}` };
        } else if (order.status === OrderStatus.Shipped && secondsSinceOrder > 20) { // Shortened for demo
          ordersChanged = true;
          notificationMessage = `Your order ${order.id.slice(-6)} has been delivered.`;
          orderIdForNotification = order.id;
          return { ...order, status: OrderStatus.Delivered };
        }
        return order;
      });
  
      if (ordersChanged) {
        setOrders(updatedOrders);
        localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
        if (notificationMessage && orderIdForNotification === latestOrderId) {
            addNotification(notificationMessage, 'success');
        }
      }
    }, 5000);
  
    return () => clearInterval(interval);
  }, [orders, addNotification, latestOrderId]);

  const navigateTo = useCallback((view: View) => {
    window.location.hash = view;
    setCurrentView(view);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash.replace('#', '');
        const validViews: View[] = ['dashboard', 'prescriptions', 'ai-assistant', 'products', 'order-history', 'inventory', 'login', 'admin-dashboard', 'checkout', 'order-confirmation', 'my-account', 'pharmacist-messaging', 'health-hub'];
        if (validViews.includes(hash as View)) {
            navigateTo(hash as View);
        } else {
            navigateTo('products');
        }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [navigateTo]);


  const handleRegister = useCallback((email: string, password: string): boolean => {
      const users: Pick<User, 'email' | 'password' | 'role'>[] = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(user => user.email === email)) {
          addNotification("User with this email already exists.", "error");
          return false;
      }
      
      // FIX: Explicitly type the 'role' constant to ensure it's '"user" | "admin"', not 'string'.
      // This resolves two downstream type errors where a 'string' was being assigned to a property expecting a union type.
      const role: 'user' | 'admin' = users.length === 0 ? 'admin' : 'user';
      const newUserCredentials = { email, password, role };
      users.push(newUserCredentials);
      localStorage.setItem('users', JSON.stringify(users));

      const newUserProfile: User = {
        ...newUserCredentials,
        profile: { fullName: 'New User', dateOfBirth: '', phone: '' },
        addresses: [], paymentMethods: [], insurance: []
      };
      saveUserData(newUserProfile);

      addNotification(`Registration successful! Role: ${role}. Please log in.`, 'success');
      return true;
  }, [addNotification]);

  const handleLogin = useCallback((email: string, password: string): boolean => {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const userCredentials = users.find(u => u.email === email && u.password === password);
      
      if (userCredentials) {
          const userData = getUserData(email);
          setCurrentUser(userData);
          localStorage.setItem('currentUserEmail', email);
          if(userData?.role === 'admin') navigateTo('admin-dashboard');
          else navigateTo('dashboard');
          return true;
      } else {
          addNotification("Invalid email or password.", "error");
          return false;
      }
  }, [navigateTo, addNotification]);

  const handleLogout = useCallback(() => {
      setCurrentUser(null);
      localStorage.removeItem('currentUserEmail');
      navigateTo('products');
  }, [navigateTo]);
  
  const addPrescription = useCallback((file: File) => {
    const newPrescription: Prescription = {
      id: `px-${Date.now()}`,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      status: PrescriptionStatus.Pending,
      submittedAt: new Date(),
      autoRefill: false,
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
          if (randomStatus === PrescriptionStatus.Rejected) {
            updatedPrescription.pharmacistNote = 'The provided image was not clear enough to verify. Please upload a new one.'
          }
          return updatedPrescription;
        }
        return p;
      }));
    }, 5000 + Math.random() * 3000);

  }, []);
  
  const handleUpdatePrescription = (updatedPrescription: Prescription) => {
    setPrescriptions(prev => prev.map(p => p.id === updatedPrescription.id ? updatedPrescription : p));
  };
  
  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
      const newProduct: Product = { ...productData, id: `prod-${Date.now()}`, price: parseFloat(String(productData.price)), stock: Number(productData.stock) };
      setProducts(prev => [newProduct, ...prev]);
  }, []);

  const removeProduct = useCallback((productId: string) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const handleAddToCart = useCallback((product: Product, quantity: number = 1) => {
    const productInStock = products.find(p => p.id === product.id);
    if (!productInStock || productInStock.stock < quantity) {
        addNotification('Sorry, this product is out of stock.', 'error'); return;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if(newQuantity > productInStock.stock) {
            addNotification(`Sorry, only ${productInStock.stock} items are in stock.`, 'error'); return prevCart;
        }
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item);
      }
      return [...prevCart, { ...product, quantity }];
    });
  }, [products, addNotification]);

  const handleUpdateQuantity = useCallback((productId: string, quantity: number) => {
    const productInStock = products.find(p => p.id === productId);
    if (productInStock && quantity > productInStock.stock) {
        addNotification(`Sorry, only ${productInStock.stock} items are available.`, 'error'); return;
    }
    setCart(prevCart => {
      if (quantity <= 0) return prevCart.filter(item => item.id !== productId);
      return prevCart.map(item => item.id === productId ? { ...item, quantity } : item);
    });
  }, [products, addNotification]);

  const handleRemoveFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;
    setCartOpen(false); navigateTo('checkout');
  }, [cart.length, navigateTo]);

  const handlePlaceOrder = useCallback((shippingAddress: ShippingAddress, paymentMethod: string) => {
    setProducts(currentProducts => {
        const updatedProducts = [...currentProducts];
        cart.forEach(cartItem => {
            const productIndex = updatedProducts.findIndex(p => p.id === cartItem.id);
            if (productIndex !== -1) updatedProducts[productIndex].stock -= cartItem.quantity;
        });
        return updatedProducts;
    });
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = 2500;
    const newOrder: Order = {
        id: `order-${Date.now()}`, date: new Date(), items: [...cart], total: subtotal + shippingCost,
        shippingAddress, paymentMethod, status: OrderStatus.Processing,
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
    setLatestOrderId(newOrder.id);
    setCart([]);
    navigateTo('order-confirmation');
    addNotification('Order placed successfully!', 'success');
  }, [cart, orders, navigateTo, addNotification]);

  const handleUpdateUserProfile = (profile: UserProfile) => {
    if (currentUser) {
        const updatedUser = { ...currentUser, profile };
        setCurrentUser(updatedUser);
        saveUserData(updatedUser);
        addNotification('Profile updated successfully!', 'success');
    }
  };

  const handlePharmacistSendMessage = (text: string) => {
    const userMessage: PharmacistMessage = { id: `msg-${Date.now()}`, sender: 'user', text, timestamp: new Date(), isRead: true };
    const pharmacistResponse: PharmacistMessage = { id: `msg-${Date.now()+1}`, sender: 'pharmacist', text: 'Thank you for your message. A pharmacist will review it and respond shortly.', timestamp: new Date(Date.now() + 1000), isRead: false };
    setPharmacistMessages(prev => [...prev, userMessage, pharmacistResponse]);
  };

  const cartItemCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Home setView={navigateTo} products={products.filter(p => p.isRecommended).slice(0, 4)} prescriptions={prescriptions} onAddToCart={handleAddToCart} onQuickView={setSelectedProduct} user={currentUser} />;
      case 'prescriptions': return <PrescriptionManager prescriptions={prescriptions} onUpload={addPrescription} onUpdate={handleUpdatePrescription} />;
      case 'products': return <Products products={products} onAddToCart={handleAddToCart} onQuickView={setSelectedProduct} />;
      case 'ai-assistant': return <AiAssistant />;
      case 'order-history': return <OrderHistory orders={orders} />;
      case 'inventory': return <InventoryManager products={products} onAddProduct={addProduct} onRemoveProduct={removeProduct} />;
      case 'admin-dashboard': return <AdminDashboard setView={navigateTo} />;
      case 'checkout': return <Checkout cartItems={cart} onPlaceOrder={handlePlaceOrder} setView={navigateTo} />;
      case 'order-confirmation': return <OrderConfirmation order={orders.find(o => o.id === latestOrderId) || null} setView={navigateTo} />;
      case 'my-account': return currentUser ? <MyAccount user={currentUser} onUpdateProfile={handleUpdateUserProfile} /> : null;
      case 'pharmacist-messaging': return <PharmacistMessaging messages={pharmacistMessages} onSendMessage={handlePharmacistSendMessage} />;
      case 'health-hub': return <HealthHub />;
      default: return <Home setView={navigateTo} products={products.filter(p => p.isRecommended).slice(0, 4)} prescriptions={prescriptions} onAddToCart={handleAddToCart} onQuickView={setSelectedProduct} user={currentUser} />;
    }
  };
  
  if (currentView === 'login') return <Auth onLogin={handleLogin} onRegister={handleRegister} />;

  return (
    <div className="min-h-screen flex flex-col bg-background-cream">
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      <Header currentView={currentView} setView={navigateTo} cartItemCount={cartItemCount} onCartClick={() => setCartOpen(true)} user={currentUser} onLogout={handleLogout}/>
      <Cart isOpen={isCartOpen} onClose={() => setCartOpen(false)} items={cart} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveFromCart} onCheckout={handleCheckout}/>
      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart}/>}
      <main className="flex-1 w-full">{renderContent()}</main>
      <Footer />
    </div>
  );
};

export default App;