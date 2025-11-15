export enum PrescriptionStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  NeedsClarification = 'Needs Clarification',
}

export interface Prescription {
  id: string;
  fileName: string;
  fileUrl: string;
  status: PrescriptionStatus;
  submittedAt: Date;
  stampJws?: string;
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
  rating: number;
  reviewCount: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: Date;
  items: CartItem[];
  total: number;
}

export interface User {
  email: string;
  password: string; // In a real app, this would be a hash
  role: 'user' | 'admin';
}