import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Package, Users, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useOffline } from "@/contexts/OfflineContext";

interface DashboardStats {
  salesTotal: number;
  salesCount: number;
  productsCount: number;
  lowStockCount: number;
  customersCount: number;
  pendingDeliveries: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    salesTotal: 0,
    salesCount: 0,
    productsCount: 0,
    lowStockCount: 0,
    customersCount: 0,
    pendingDeliveries: 0,
  });
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("day");
  const [isLoading, setIsLoading] = useState(true);
  const { isOfflineMode } = useOffline();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Mock data for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStats({
          salesTotal: 2500,
          salesCount: 42,
          productsCount: 156,
          lowStockCount: 8,
          customersCount: 87,
          pendingDeliveries: 5,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange, isOfflineMode]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    to?: string;
    color?: string;
  }> = ({ title, value, icon, description, to, color = "blue" }) => (
    <Card className="overflow-hidden">
      <CardHeader className={`bg-${color}-50 flex flex-row items-center justify-between space-y-0 pb-2`}>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`text-${color}-500`}>{icon}</div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        {to && (
          <Link to={to} className={`text-${color}-500 text-xs hover:underline mt-2 inline-block`}>
            Ver detalles →
          </Link>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Tabs
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as "day" | "week" | "month")}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="day">Hoy</TabsTrigger>
            <TabsTrigger value="week">Esta Semana</TabsTrigger>
            <TabsTrigger value="month">Este Mes</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="animate-pulse bg-gray-200 h-12"></CardHeader>
              <CardContent className="pt-4">
                <div className="animate-pulse bg-gray-200 h-8 w-24 mb-2"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Ventas Totales"
            value={formatCurrency(stats.salesTotal)}
            icon={<DollarSign className="h-4 w-4" />}
            description={`${stats.salesCount} ventas en este período`}
            to="/reports/sales"
            color="blue"
          />
          <StatCard
            title="Productos"
            value={stats.productsCount}
            icon={<Package className="h-4 w-4" />}
            description={`${stats.lowStockCount} productos con stock bajo`}
            to="/products"
            color="green"
          />
          <StatCard
            title="Clientes"
            value={stats.customersCount}
            icon={<Users className="h-4 w-4" />}
            description="Clientes registrados"
            to="/customers"
            color="purple"
          />
          <StatCard
            title="Delivery Pendientes"
            value={stats.pendingDeliveries}
            icon={<ShoppingCart className="h-4 w-4" />}
            description="Pedidos por entregar"
            to="/delivery"
            color="orange"
          />
          <StatCard
            title="Productos Stock Bajo"
            value={stats.lowStockCount}
            icon={<AlertTriangle className="h-4 w-4" />}
            description="Requieren reposición"
            to="/products?filter=low-stock"
            color="red"
          />
          <StatCard
            title="Tendencia de Ventas"
            value="+12%"
            icon={<TrendingUp className="h-4 w-4" />}
            description="Comparado con período anterior"
            to="/reports/trends"
            color="emerald"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="animate-pulse bg-gray-200 h-4 w-40"></div>
                    <div className="animate-pulse bg-gray-200 h-4 w-20"></div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Cerveza Cristal 650ml</span>
                    <span className="text-sm text-gray-500">124 unidades</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Ron Cartavio Black 750ml</span>
                    <span className="text-sm text-gray-500">98 unidades</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Whisky Johnnie Walker Red 750ml</span>
                    <span className="text-sm text-gray-500">76 unidades</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Pisco Quebranta 700ml</span>
                    <span className="text-sm text-gray-500">65 unidades</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Vodka Absolut 750ml</span>
                    <span className="text-sm text-gray-500">52 unidades</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="animate-pulse bg-gray-200 h-10 w-10 rounded-full"></div>
                    <div className="flex-1">
                      <div className="animate-pulse bg-gray-200 h-4 w-full mb-2"></div>
                      <div className="animate-pulse bg-gray-200 h-3 w-20"></div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Nueva venta completada</p>
                      <p className="text-xs text-gray-500">Hace 5 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Stock actualizado: Cerveza Cristal 650ml</p>
                      <p className="text-xs text-gray-500">Hace 20 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Alerta de stock bajo: Ron Cartavio Black</p>
                      <p className="text-xs text-gray-500">Hace 45 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Nuevo cliente registrado</p>
                      <p className="text-xs text-gray-500">Hace 1 hora</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

