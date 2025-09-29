import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Package, Edit, Trash, AlertTriangle, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOffline } from "@/contexts/OfflineContext";
import { formatCurrency } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  bonificado: boolean;
  habilitaPuntos: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const { isOfflineMode } = useOffline();

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

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      setProducts(products.filter(p => p.id !== productToDelete.id));
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Handle import products
  const handleImportProducts = async () => {
    if (!importFile) return;
    
    setIsImporting(true);
    try {
      // Mock import success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsImporting(false);
      setIsImportDialogOpen(false);
      setImportFile(null);
    } catch (error) {
      console.error("Error importing products:", error);
      setIsImporting(false);
    }
  };

  // Handle export products
  const handleExportProducts = async () => {
    try {
      // Mock export success
      alert("Exportación iniciada. El archivo se descargará automáticamente.");
    } catch (error) {
      console.error("Error exporting products:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" onClick={handleExportProducts}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button asChild>
            <Link to="/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
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
        </div>
        <div className="w-full md:w-1/3 flex gap-2">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full overflow-x-auto flex-nowrap justify-start">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className={viewMode === "grid" ? "bg-blue-50" : ""}
              onClick={() => setViewMode("grid")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={viewMode === "list" ? "bg-blue-50" : ""}
              onClick={() => setViewMode("list")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        // Loading skeleton
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-4 border rounded-md">
                <div className="flex justify-between">
                  <div className="w-1/3">
                    <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                  </div>
                  <div className="w-1/5">
                    <div className="h-4 bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : filteredProducts.length > 0 ? (
        viewMode === "grid" ? (
          // Grid view
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Package className="h-12 w-12 text-gray-400" />
                  )}
                  {product.stock < 10 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Stock bajo
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <span className="text-blue-600 font-bold">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <Link to={`/products/${product.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => {
                          setProductToDelete(product);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // List view
          <div className="space-y-2">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full rounded-md"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        {product.description || "Sin descripción"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-blue-600">
                        {formatCurrency(product.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Stock: {product.stock}
                        {product.stock < 10 && (
                          <span className="ml-2 text-red-500 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Bajo
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <Link to={`/products/${product.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => {
                          setProductToDelete(product);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // No products found
        <div className="flex flex-col items-center justify-center text-center p-12 border rounded-md">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No se encontraron productos</h3>
          <p className="text-sm text-gray-500 mb-4">
            Intenta con otra búsqueda o categoría
          </p>
          <Button asChild>
            <Link to="/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Link>
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              ¿Estás seguro de que deseas eliminar el producto{" "}
              <span className="font-medium">{productToDelete?.name}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Esta acción no se puede deshacer.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Productos</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-500">
              Sube un archivo Excel (.xlsx) con los productos a importar.
              Asegúrate de que el archivo tenga el formato correcto.
            </p>
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <input
                type="file"
                id="import-file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="import-file"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium">
                  {importFile ? importFile.name : "Haz clic para seleccionar archivo"}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {importFile
                    ? `${(importFile.size / 1024).toFixed(2)} KB`
                    : "Formato: .xlsx, .xls"}
                </span>
              </label>
            </div>
            <a
              href="#"
              className="text-sm text-blue-600 hover:underline inline-flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Descargar plantilla
            </a>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsImportDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleImportProducts}
              disabled={!importFile || isImporting}
            >
              {isImporting ? "Importando..." : "Importar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Mock data for development
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Cerveza Cristal 650ml",
    description: "Cerveza Cristal botella de vidrio 650ml",
    price: 5.90,
    stock: 120,
    category: "cervezas",
    bonificado: false,
    habilitaPuntos: true,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Cerveza Pilsen 650ml",
    description: "Cerveza Pilsen botella de vidrio 650ml",
    price: 5.90,
    stock: 85,
    category: "cervezas",
    bonificado: false,
    habilitaPuntos: true,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "3",
    name: "Cerveza Cusqueña 620ml",
    description: "Cerveza Cusqueña botella de vidrio 620ml",
    price: 6.90,
    stock: 75,
    category: "cervezas",
    bonificado: false,
    habilitaPuntos: true,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "4",
    name: "Ron Cartavio Black 750ml",
    description: "Ron Cartavio Black botella 750ml",
    price: 25.90,
    stock: 42,
    category: "ron",
    bonificado: false,
    habilitaPuntos: true,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "5",
    name: "Ron Flor de Caña 750ml",
    description: "Ron Flor de Caña 5 años botella 750ml",
    price: 45.90,
    stock: 8,
    category: "ron",
    bonificado: true,
    habilitaPuntos: true,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "6",
    name: "Whisky Johnnie Walker Red 750ml",
    description: "Whisky Johnnie Walker Red Label botella 750ml",
    price: 55.90,
    stock: 35,
    category: "whisky",
    bonificado: false,
    habilitaPuntos: true,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "7",
    name: "Whisky Johnnie Walker Black 750ml",
    description: "Whisky Johnnie Walker Black Label botella 750ml",
    price: 85.90,
    stock: 22,
    category: "whisky",
    bonificado: true,
    habilitaPuntos: true,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "8",
    name: "Pisco Quebranta 700ml",
    description: "Pisco Quebranta botella 700ml",
    price: 35.90,
    stock: 5,
    category: "pisco",
    bonificado: false,
    habilitaPuntos: true,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
];

const mockCategories: Category[] = [
  { id: "cervezas", name: "Cervezas" },
  { id: "ron", name: "Ron" },
  { id: "whisky", name: "Whisky" },
  { id: "pisco", name: "Pisco" },
  { id: "vodka", name: "Vodka" },
  { id: "gin", name: "Gin" },
];

export default ProductsPage;

