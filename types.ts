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
}

export interface CartItem extends Product {
  quantity: number;
}