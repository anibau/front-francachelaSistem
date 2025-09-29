import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Minus, ShoppingCart, X, User, CreditCard, Banknote, Smartphone, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useOffline } from "@/contexts/OfflineContext";
import { formatCurrency } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

interface Category {
  id: string;
  name: string;
}

const POSPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);

  const { 
    carts, 
    activeCartId, 
    setActiveCartId, 
    createCart, 
    addItem, 
    removeItem, 
    updateItemQuantity, 
    clearCart, 
    setCustomer,
    checkout,
    isProcessing
  } = useCart();
  
  const { isOfflineMode } = useOffline();

  const activeCart = carts.find(cart => cart.id === activeCartId);

  // Create a new cart if there are no carts or no active cart
  useEffect(() => {
    if (carts.length === 0 || !activeCartId) {
      createCart();
    }
  }, [carts, activeCartId, createCart]);

  // Fetch products and categories
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setIsLoading(true);
      try {
        // Mock data for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProducts(mockProducts);
        setCategories(mockCategories);
      } catch (error) {
        console.error("Error fetching products and categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, [isOfflineMode]);

  // Filter products based on search query and selected category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle adding product to cart
  const handleAddProduct = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      discount: 0,
    });
  };

  // Handle searching for customer by phone
  const handleSearchCustomer = async () => {
    if (!customerPhone) return;
    
    setIsSearchingCustomer(true);
    try {
      // Mock customer data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCustomerInfo({
        id: "cust123",
        name: "Juan Pérez",
        phone: customerPhone,
        points: 120,
      });
    } catch (error) {
      console.error("Error searching for customer:", error);
      setCustomerInfo(null);
    } finally {
      setIsSearchingCustomer(false);
    }
  };

  // Handle selecting customer
  const handleSelectCustomer = () => {
    if (customerInfo) {
      setCustomer(customerInfo);
      setIsCustomerDialogOpen(false);
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    try {
      await checkout(paymentMethod);
      setIsCheckoutDialogOpen(false);
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] gap-4 overflow-hidden">
      {/* Products Section */}
      <div className="lg:w-2/3 flex flex-col overflow-hidden">
        {/* Search and Categories */}
        <div className="mb-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full overflow-x-auto flex-nowrap justify-start">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-4">
          {isLoading ? (
            // Loading skeleton
            [...Array(12)].map((_, i) => (
              <Card key={i} className="cursor-pointer overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <CardContent className="p-3">
                  <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 animate-pulse"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredProducts.length > 0 ? (
            // Product cards
            filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer overflow-hidden hover:shadow-md transition-shadow"
                onClick={() => handleAddProduct(product)}
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Package className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm truncate">{product.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-blue-600 font-bold">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // No products found
            <div className="col-span-full flex flex-col items-center justify-center text-center p-8">
              <Package className="h-12 w-12 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">No se encontraron productos</h3>
              <p className="text-sm text-gray-500">
                Intenta con otra búsqueda o categoría
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <div className="lg:w-1/3 flex flex-col bg-white border rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Carrito de Compra</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomerDialogOpen(true)}
              >
                <User className="h-4 w-4 mr-1" />
                {activeCart?.customer ? activeCart.customer.name : "Cliente"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                disabled={!activeCart || activeCart.items.length === 0}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {activeCart?.customer && (
            <div className="mt-2 text-sm bg-blue-50 text-blue-600 p-2 rounded-md">
              <p className="font-medium">{activeCart.customer.name}</p>
              <p>Puntos: {activeCart.customer.points || 0}</p>
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!activeCart || activeCart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">Carrito vacío</h3>
              <p className="text-sm text-gray-500">
                Agrega productos haciendo clic en ellos
              </p>
            </div>
          ) : (
            activeCart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500">
                      {formatCurrency(item.price)} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center ml-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary */}
        <div className="p-4 border-t bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(activeCart?.total || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Descuento</span>
              <span>{activeCart?.discount || 0}%</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(activeCart?.total || 0)}</span>
            </div>
          </div>

          <Button
            className="w-full mt-4"
            size="lg"
            disabled={!activeCart || activeCart.items.length === 0}
            onClick={() => setIsCheckoutDialogOpen(true)}
          >
            Procesar Venta
          </Button>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Venta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">Método de Pago</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setPaymentMethod("cash")}
                >
                  <Banknote className="h-4 w-4 mr-2" />
                  Efectivo
                </Button>
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Tarjeta
                </Button>
                <Button
                  variant={paymentMethod === "yape" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setPaymentMethod("yape")}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Yape
                </Button>
                <Button
                  variant={paymentMethod === "plin" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setPaymentMethod("plin")}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Plin
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Resumen</h3>
              <div className="bg-gray-50 p-4 rounded-md space-y-2">
                <div className="flex justify-between">
                  <span>Productos:</span>
                  <span>{activeCart?.items.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(activeCart?.total || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Descuento:</span>
                  <span>{activeCart?.discount || 0}%</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(activeCart?.total || 0)}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCheckout} disabled={isProcessing}>
              {isProcessing ? "Procesando..." : "Confirmar Venta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Dialog */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buscar Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Teléfono del cliente"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
              <Button onClick={handleSearchCustomer} disabled={isSearchingCustomer}>
                {isSearchingCustomer ? "Buscando..." : "Buscar"}
              </Button>
            </div>

            {customerInfo && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium">{customerInfo.name}</h3>
                <p className="text-sm text-gray-500">Teléfono: {customerInfo.phone}</p>
                <p className="text-sm text-gray-500">Puntos: {customerInfo.points}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSelectCustomer}
              disabled={!customerInfo}
            >
              Seleccionar Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Mock data for development
const mockProducts: Product[] = [
  { id: "1", name: "Cerveza Cristal 650ml", price: 5.90, stock: 120, category: "cervezas" },
  { id: "2", name: "Cerveza Pilsen 650ml", price: 5.90, stock: 85, category: "cervezas" },
  { id: "3", name: "Cerveza Cusqueña 620ml", price: 6.90, stock: 75, category: "cervezas" },
  { id: "4", name: "Ron Cartavio Black 750ml", price: 25.90, stock: 42, category: "ron" },
  { id: "5", name: "Ron Flor de Caña 750ml", price: 45.90, stock: 28, category: "ron" },
  { id: "6", name: "Whisky Johnnie Walker Red 750ml", price: 55.90, stock: 35, category: "whisky" },
  { id: "7", name: "Whisky Johnnie Walker Black 750ml", price: 85.90, stock: 22, category: "whisky" },
  { id: "8", name: "Pisco Quebranta 700ml", price: 35.90, stock: 48, category: "pisco" },
  { id: "9", name: "Pisco Acholado 700ml", price: 38.90, stock: 36, category: "pisco" },
  { id: "10", name: "Vodka Absolut 750ml", price: 49.90, stock: 30, category: "vodka" },
  { id: "11", name: "Vodka Smirnoff 750ml", price: 35.90, stock: 42, category: "vodka" },
  { id: "12", name: "Gin Tanqueray 750ml", price: 65.90, stock: 18, category: "gin" },
];

const mockCategories: Category[] = [
  { id: "cervezas", name: "Cervezas" },
  { id: "ron", name: "Ron" },
  { id: "whisky", name: "Whisky" },
  { id: "pisco", name: "Pisco" },
  { id: "vodka", name: "Vodka" },
  { id: "gin", name: "Gin" },
];

export default POSPage;

