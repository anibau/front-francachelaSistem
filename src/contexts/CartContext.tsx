import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Cart, CartItem, Customer } from "@/types";
import { generateId } from "@/lib/utils";
import { useOffline } from "./OfflineContext";
// import apiService from "@/services/api";

interface CartContextType {
  carts: Cart[];
  activeCartId: string | null;
  isProcessing: boolean;
  createCart: () => string;
  setActiveCartId: (cartId: string) => void;
  addItem: (item: Omit<CartItem, "id" | "subtotal">) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setCustomer: (customer: Customer) => void;
  checkout: (paymentMethod: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [activeCartId, setActiveCartId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isOfflineMode, queueOperation } = useOffline();

  // Load carts from localStorage on mount
  useEffect(() => {
    const storedCarts = localStorage.getItem("carts");
    const storedActiveCartId = localStorage.getItem("activeCartId");
    
    if (storedCarts) {
      try {
        const parsedCarts = JSON.parse(storedCarts);
        setCarts(parsedCarts);
        
        if (storedActiveCartId && parsedCarts.find((c: Cart) => c.id === storedActiveCartId)) {
          setActiveCartId(storedActiveCartId);
        }
      } catch (error) {
        console.error("Error loading carts from localStorage:", error);
      }
    }
  }, []);

  // Save carts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("carts", JSON.stringify(carts));
  }, [carts]);

  useEffect(() => {
    if (activeCartId) {
      localStorage.setItem("activeCartId", activeCartId);
    }
  }, [activeCartId]);

  const createCart = (): string => {
    const newCart: Cart = {
      id: generateId(),
      items: [],
      total: 0,
      discount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCarts(prev => [...prev, newCart]);
    setActiveCartId(newCart.id);
    return newCart.id;
  };

  const calculateCartTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.subtotal, 0);
  };

  const updateCart = (cartId: string, updater: (cart: Cart) => Cart) => {
    setCarts(prev =>
      prev.map(cart =>
        cart.id === cartId
          ? { ...updater(cart), updatedAt: new Date().toISOString() }
          : cart
      )
    );
  };

  const addItem = (itemData: Omit<CartItem, "id" | "subtotal">) => {
    if (!activeCartId) return;

    const newItem: CartItem = {
      ...itemData,
      id: generateId(),
      subtotal: itemData.price * itemData.quantity * (1 - itemData.discount / 100),
    };

    updateCart(activeCartId, cart => {
      // Check if item already exists
      const existingItemIndex = cart.items.findIndex(
        item => item.productId === newItem.productId
      );

      let updatedItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = cart.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + newItem.quantity,
                subtotal: item.price * (item.quantity + newItem.quantity) * (1 - item.discount / 100),
              }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...cart.items, newItem];
      }

      return {
        ...cart,
        items: updatedItems,
        total: calculateCartTotal(updatedItems),
      };
    });
  };

  const removeItem = (itemId: string) => {
    if (!activeCartId) return;

    updateCart(activeCartId, cart => {
      const updatedItems = cart.items.filter(item => item.id !== itemId);
      return {
        ...cart,
        items: updatedItems,
        total: calculateCartTotal(updatedItems),
      };
    });
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (!activeCartId) return;

    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    updateCart(activeCartId, cart => {
      const updatedItems = cart.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              subtotal: item.price * quantity * (1 - item.discount / 100),
            }
          : item
      );

      return {
        ...cart,
        items: updatedItems,
        total: calculateCartTotal(updatedItems),
      };
    });
  };

  const clearCart = () => {
    if (!activeCartId) return;

    updateCart(activeCartId, cart => ({
      ...cart,
      items: [],
      total: 0,
      discount: 0,
      customer: undefined,
    }));
  };

  const setCustomer = (customer: Customer) => {
    if (!activeCartId) return;

    updateCart(activeCartId, cart => ({
      ...cart,
      customer,
    }));
  };

  const checkout = async (paymentMethod: string): Promise<void> => {
    if (!activeCartId) throw new Error("No active cart");

    const cart = carts.find(c => c.id === activeCartId);
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    setIsProcessing(true);

    try {
      const saleData = {
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
        })),
        customerId: cart.customer?.id,
        paymentMethod,
        total: cart.total,
        discount: cart.discount,
      };

      if (isOfflineMode) {
        // Queue operation for later sync
        queueOperation({
          id: generateId(),
          type: "sale",
          data: saleData,
          timestamp: new Date().toISOString(),
          retries: 0,
        });
      } else {
        // Process sale immediately
        // await apiService.createSale(saleData);
        
        // Mock processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Clear the cart after successful checkout
      clearCart();
      
      // Create a new cart for the next sale
      createCart();

    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const value: CartContextType = {
    carts,
    activeCartId,
    isProcessing,
    createCart,
    setActiveCartId,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    setCustomer,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

