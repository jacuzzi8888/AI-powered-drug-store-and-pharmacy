
export enum PrescriptionStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  NeedsClarification = 'Needs Clarification',
  RefillRequested = 'Refill Requested',
}

export interface Prescription {
  id: string;
  fileName: string;
  fileUrl: string;
  status: PrescriptionStatus;
  submittedAt: Date;
  stampJws?: string;
  pharmacistNote?: string;
  autoRefill?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  isRecommended?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingAddress {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
}

export enum OrderStatus {
    Processing = 'Processing',
    Paid = 'Paid',
    Shipped = 'Shipped',
    Delivered = 'Delivered',
}

export interface Order {
  id: string;
  date: Date;
  items: CartItem[];
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  status: OrderStatus;
  trackingLink?: string;
}

export interface Address {
    id: string;
    type: 'Home' | 'Work';
    addressLine1: string;
    city: string;
    state: string;
    isDefault: boolean;
}

export interface PaymentMethod {
    id: string;
    type: 'Card';
    provider: 'Visa' | 'Mastercard';
    last4: string;
    expiry: string;
    isDefault: boolean;
}

export interface Insurance {
    id: string;
    provider: string;
    policyNumber: string;
    groupNumber?: string;
}

export interface UserProfile {
    fullName: string;
    dateOfBirth: string; 
    phone: string;
}


export interface User {
  email: string;
  password: string; // In a real app, this would be a hash
  role: 'user' | 'admin';
  profile: UserProfile;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  insurance: Insurance[];
}

export interface PharmacistMessage {
    id: string;
    sender: 'user' | 'pharmacist';
    text: string;
    timestamp: Date;
    isRead: boolean;
}

export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'info' | 'error';
}
