export interface User {
  id: string;
  name: string;
  email: string;
  role: "administrador" | "vendedor";
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  bonificado: boolean;
  habilitaPuntos: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  customer?: Customer;
  total: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  items: CartItem[];
  customer?: Customer;
  total: number;
  discount: number;
  paymentMethod: string;
  cashierId: string;
  createdAt: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: "percentage" | "fixed" | "combo";
  value: number;
  minAmount?: number;
  minQuantity?: number;
  validFrom: string;
  validTo: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

