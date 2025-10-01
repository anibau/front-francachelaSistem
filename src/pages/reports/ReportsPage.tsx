import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  Filter,
  Eye,
  FileText,
  PieChart,
  LineChart,
  Activity
} from "lucide-react";

interface SalesReport {
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  paymentMethods: Array<{
    method: string;
    amount: number;
    percentage: number;
  }>;
}

interface CustomerReport {
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
  customerRetention: number;
  topCustomers: Array<{
    name: string;
    totalSpent: number;
    orders: number;
    tier: string;
  }>;
}

interface InventoryReport {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  topSellingProducts: Array<{
    name: string;
    sold: number;
    revenue: number;
    stock: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
}

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeTab, setActiveTab] = useState("sales");

  // Mock data
  const [salesReport] = useState<SalesReport>({
    period: "Enero 2024",
    totalSales: 45680.50,
    totalOrders: 342,
    averageOrderValue: 133.57,
    topProducts: [
      { name: "Cerveza Cristal 650ml", quantity: 156, revenue: 936.00 },
      { name: "Pisco Quebranta 750ml", quantity: 45, revenue: 2025.00 },
      { name: "Vino Tinto Reserva", quantity: 78, revenue: 1950.00 },
      { name: "Whisky Johnnie Walker Red", quantity: 23, revenue: 1955.00 },
      { name: "Ron Cartavio Blanco", quantity: 34, revenue: 1020.00 },
    ],
    paymentMethods: [
      { method: "Efectivo", amount: 18672.20, percentage: 40.9 },
      { method: "Tarjeta", amount: 13704.15, percentage: 30.0 },
      { method: "Yape", amount: 9136.10, percentage: 20.0 },
      { method: "Plin", amount: 2284.02, percentage: 5.0 },
      { method: "Transferencia", amount: 1884.03, percentage: 4.1 },
    ],
  });

  const [customerReport] = useState<CustomerReport>({
    totalCustomers: 1247,
    newCustomers: 89,
    activeCustomers: 456,
    customerRetention: 73.2,
    topCustomers: [
      { name: "Roberto Silva", totalSpent: 5420.80, orders: 78, tier: "platinum" },
      { name: "María González", totalSpent: 2850.50, orders: 45, tier: "gold" },
      { name: "Carlos Mendoza", totalSpent: 1650.75, orders: 28, tier: "silver" },
      { name: "Ana Rodríguez", totalSpent: 890.25, orders: 15, tier: "bronze" },
      { name: "Luis Torres", totalSpent: 756.40, orders: 12, tier: "bronze" },
    ],
  });

  const [inventoryReport] = useState<InventoryReport>({
    totalProducts: 245,
    lowStockProducts: 23,
    outOfStockProducts: 5,
    topSellingProducts: [
      { name: "Cerveza Cristal 650ml", sold: 156, revenue: 936.00, stock: 45 },
      { name: "Pisco Quebranta 750ml", sold: 45, revenue: 2025.00, stock: 12 },
      { name: "Vino Tinto Reserva", sold: 78, revenue: 1950.00, stock: 23 },
      { name: "Whisky Johnnie Walker Red", sold: 23, revenue: 1955.00, stock: 8 },
      { name: "Ron Cartavio Blanco", sold: 34, revenue: 1020.00, stock: 15 },
    ],
    categoryPerformance: [
      { category: "Cervezas", revenue: 15420.30, percentage: 33.8 },
      { category: "Licores", revenue: 12850.75, percentage: 28.1 },
      { category: "Vinos", revenue: 8945.20, percentage: 19.6 },
      { category: "Piscos", revenue: 5680.15, percentage: 12.4 },
      { category: "Otros", revenue: 2784.10, percentage: 6.1 },
    ],
  });

  const handleExportReport = (type: string) => {
    console.log("Exportar reporte:", type);
    // Aquí iría la lógica para exportar el reporte
  };

  const handleGenerateReport = () => {
    console.log("Generar reporte personalizado");
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "bronze":
        return "bg-amber-100 text-amber-800";
      case "silver":
        return "bg-gray-100 text-gray-800";
      case "gold":
        return "bg-yellow-100 text-yellow-800";
      case "platinum":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reportes</h1>
          <p className="text-muted-foreground">
            Análisis y métricas del negocio
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Reporte Personalizado
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex gap-2">
              <Button
                variant={selectedPeriod === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("day")}
              >
                Hoy
              </Button>
              <Button
                variant={selectedPeriod === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("week")}
              >
                Semana
              </Button>
              <Button
                variant={selectedPeriod === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("month")}
              >
                Mes
              </Button>
              <Button
                variant={selectedPeriod === "year" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("year")}
              >
                Año
              </Button>
              <Button
                variant={selectedPeriod === "custom" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("custom")}
              >
                Personalizado
              </Button>
            </div>
            
            {selectedPeriod === "custom" && (
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-auto"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-auto"
                />
                <Button onClick={handleGenerateReport}>
                  Generar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
        </TabsList>

        {/* Sales Report */}
        <TabsContent value="sales" className="mt-6">
          <div className="space-y-6">
            {/* Sales Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Ventas Totales</p>
                      <p className="text-2xl font-bold text-foreground">
                        S/{salesReport.totalSales.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Órdenes</p>
                      <p className="text-2xl font-bold text-foreground">
                        {salesReport.totalOrders}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Ticket Promedio</p>
                      <p className="text-2xl font-bold text-foreground">
                        S/{salesReport.averageOrderValue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Crecimiento</p>
                      <p className="text-2xl font-bold text-green-600">+12.5%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Productos Más Vendidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesReport.topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              #{index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.quantity} unidades
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-primary">
                          S/{product.revenue.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Métodos de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesReport.paymentMethods.map((method, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{method.method}</span>
                          <div className="text-right">
                            <p className="font-semibold">S/{method.amount.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{method.percentage}%</p>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${method.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Customers Report */}
        <TabsContent value="customers" className="mt-6">
          <div className="space-y-6">
            {/* Customer Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
                      <p className="text-2xl font-bold text-foreground">
                        {customerReport.totalCustomers}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Nuevos Clientes</p>
                      <p className="text-2xl font-bold text-foreground">
                        {customerReport.newCustomers}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Clientes Activos</p>
                      <p className="text-2xl font-bold text-foreground">
                        {customerReport.activeCustomers}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <LineChart className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Retención</p>
                      <p className="text-2xl font-bold text-foreground">
                        {customerReport.customerRetention}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle>Mejores Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerReport.topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {customer.orders} órdenes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getTierColor(customer.tier)}>
                          {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)}
                        </Badge>
                        <span className="font-semibold text-primary">
                          S/{customer.totalSpent.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Report */}
        <TabsContent value="inventory" className="mt-6">
          <div className="space-y-6">
            {/* Inventory Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Productos</p>
                      <p className="text-2xl font-bold text-foreground">
                        {inventoryReport.totalProducts}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <TrendingDown className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Stock Bajo</p>
                      <p className="text-2xl font-bold text-foreground">
                        {inventoryReport.lowStockProducts}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Sin Stock</p>
                      <p className="text-2xl font-bold text-foreground">
                        {inventoryReport.outOfStockProducts}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Rotación</p>
                      <p className="text-2xl font-bold text-foreground">85%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Selling Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Productos Más Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventoryReport.topSellingProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              #{index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.sold} vendidos | Stock: {product.stock}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-primary">
                          S/{product.revenue.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventoryReport.categoryPerformance.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category.category}</span>
                          <div className="text-right">
                            <p className="font-semibold">S/{category.revenue.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{category.percentage}%</p>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Financial Report */}
        <TabsContent value="financial" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Reporte Financiero
                </h3>
                <p className="text-muted-foreground mb-4">
                  Esta sección incluirá análisis financiero detallado, flujo de caja, rentabilidad y proyecciones.
                </p>
                <Button>
                  Próximamente
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
