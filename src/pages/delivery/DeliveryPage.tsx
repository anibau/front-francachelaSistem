import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Truck, 
  MapPin,
  Clock,
  Phone,
  User,
  Package,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Navigation,
  Star
} from "lucide-react";

interface DeliveryOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  paymentMethod: "cash" | "card" | "yape" | "plin" | "transfer";
  status: "pending" | "confirmed" | "preparing" | "on_way" | "delivered" | "cancelled";
  orderDate: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  deliveryPerson?: string;
  notes?: string;
  rating?: number;
}

const DeliveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data
  const [orders] = useState<DeliveryOrder[]>([
    {
      id: "DEL-001",
      customerName: "María González",
      customerPhone: "987654321",
      address: "Av. Larco 123, Miraflores",
      coordinates: { lat: -12.1191, lng: -77.0292 },
      items: [
        { name: "Cerveza Cristal 650ml", quantity: 6, price: 36.00 },
        { name: "Piqueo Mixto", quantity: 1, price: 15.00 }
      ],
      total: 51.00,
      paymentMethod: "yape",
      status: "on_way",
      orderDate: "2024-01-22T14:30:00",
      estimatedDelivery: "2024-01-22T15:30:00",
      deliveryPerson: "Carlos Ramos",
      notes: "Tocar timbre, departamento 301"
    },
    {
      id: "DEL-002",
      customerName: "Roberto Silva",
      customerPhone: "912345678",
      address: "Jr. Lima 456, San Isidro",
      items: [
        { name: "Whisky Johnnie Walker Red", quantity: 1, price: 85.00 },
        { name: "Hielo", quantity: 2, price: 6.00 }
      ],
      total: 91.00,
      paymentMethod: "cash",
      status: "preparing",
      orderDate: "2024-01-22T13:45:00",
      estimatedDelivery: "2024-01-22T15:00:00",
      notes: "Pago exacto por favor"
    },
    {
      id: "DEL-003",
      customerName: "Ana Rodríguez",
      customerPhone: "998877665",
      address: "Calle Real 789, Barranco",
      items: [
        { name: "Vino Tinto Reserva", quantity: 2, price: 50.00 },
        { name: "Queso Manchego", quantity: 1, price: 25.00 }
      ],
      total: 75.00,
      paymentMethod: "card",
      status: "delivered",
      orderDate: "2024-01-22T12:00:00",
      deliveredAt: "2024-01-22T13:15:00",
      deliveryPerson: "Luis Mendoza",
      rating: 5
    },
    {
      id: "DEL-004",
      customerName: "Carlos Mendoza",
      customerPhone: "955443322",
      address: "Av. Brasil 321, Pueblo Libre",
      items: [
        { name: "Pisco Quebranta", quantity: 1, price: 45.00 }
      ],
      total: 45.00,
      paymentMethod: "plin",
      status: "pending",
      orderDate: "2024-01-22T15:00:00",
      estimatedDelivery: "2024-01-22T16:30:00"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-orange-100 text-orange-800";
      case "on_way":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "confirmed":
        return "Confirmado";
      case "preparing":
        return "Preparando";
      case "on_way":
        return "En Camino";
      case "delivered":
        return "Entregado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cash":
        return "Efectivo";
      case "card":
        return "Tarjeta";
      case "yape":
        return "Yape";
      case "plin":
        return "Plin";
      case "transfer":
        return "Transferencia";
      default:
        return method;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (activeTab !== "all") {
      matchesStatus = order.status === activeTab;
    }
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: string) => {
    console.log("Actualizar estado:", id, newStatus);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/delivery/${id}`);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    onWay: orders.filter(o => o.status === "on_way").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    totalRevenue: orders.filter(o => o.status === "delivered").reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Delivery</h1>
          <p className="text-muted-foreground">
            Gestiona pedidos de entrega a domicilio
          </p>
        </div>
        <Button onClick={() => navigate("/delivery/new")} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Pedido
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Preparando</p>
                <p className="text-2xl font-bold text-foreground">{stats.preparing}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">En Camino</p>
                <p className="text-2xl font-bold text-foreground">{stats.onWay}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Entregados</p>
                <p className="text-2xl font-bold text-foreground">{stats.delivered}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Ingresos</p>
                <p className="text-2xl font-bold text-foreground">
                  S/{stats.totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por cliente, teléfono o ID de pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="preparing">Preparando</TabsTrigger>
          <TabsTrigger value="on_way">En Camino</TabsTrigger>
          <TabsTrigger value="delivered">Entregados</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-accent rounded-lg">
                          <Truck className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Pedido {order.id}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                            <Badge variant="outline">
                              {getPaymentMethodLabel(order.paymentMethod)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{order.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{order.customerPhone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{order.address}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Pedido: {new Date(order.orderDate).toLocaleString()}</span>
                          </div>
                          {order.estimatedDelivery && (
                            <div className="flex items-center gap-2 text-sm">
                              <AlertCircle className="h-4 w-4 text-muted-foreground" />
                              <span>Estimado: {new Date(order.estimatedDelivery).toLocaleString()}</span>
                            </div>
                          )}
                          {order.deliveredAt && (
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>Entregado: {new Date(order.deliveredAt).toLocaleString()}</span>
                            </div>
                          )}
                          {order.deliveryPerson && (
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Repartidor: {order.deliveryPerson}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-border pt-3">
                        <h4 className="font-medium mb-2">Productos:</h4>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span>S/{item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t border-border">
                          <span>Total:</span>
                          <span>S/{order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mt-3 p-3 bg-muted rounded-md">
                          <p className="text-sm">
                            <strong>Notas:</strong> {order.notes}
                          </p>
                        </div>
                      )}

                      {order.rating && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-sm font-medium">Calificación:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < order.rating! ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, "confirmed")}
                        >
                          Confirmar
                        </Button>
                      )}
                      {order.status === "confirmed" && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, "preparing")}
                        >
                          Preparar
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, "on_way")}
                        >
                          En Camino
                        </Button>
                      )}
                      {order.status === "on_way" && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, "delivered")}
                        >
                          Entregar
                        </Button>
                      )}
                      
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order.id)}
                        >
                          Ver Detalles
                        </Button>
                        {order.coordinates && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://maps.google.com/?q=${order.coordinates!.lat},${order.coordinates!.lng}`, '_blank')}
                          >
                            <Navigation className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No se encontraron pedidos
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "No hay pedidos en esta categoría"}
                </p>
                {!searchTerm && activeTab === "all" && (
                  <Button onClick={() => navigate("/delivery/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Pedido
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryPage;
