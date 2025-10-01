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
  Award,
  TrendingUp,
  TrendingDown,
  Users,
  Gift,
  Star,
  Crown,
  Zap,
  Calendar,
  Phone,
  User,
  History,
  Settings
} from "lucide-react";

interface PointsTransaction {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  type: "earned" | "redeemed" | "expired" | "bonus" | "adjustment";
  points: number;
  description: string;
  date: string;
  saleId?: string;
  rewardId?: string;
  expiryDate?: string;
  processedBy: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalPoints: number;
  lifetimePoints: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  joinDate: string;
  lastActivity: string;
  totalSpent: number;
  totalPurchases: number;
}

interface PointsReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: "discount" | "product" | "service";
  isActive: boolean;
  stock?: number;
  expiryDate?: string;
  image?: string;
}

const PointsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Mock data
  const [transactions] = useState<PointsTransaction[]>([
    {
      id: "1",
      customerId: "CUST001",
      customerName: "María González",
      customerPhone: "987654321",
      type: "earned",
      points: 25,
      description: "Compra por S/250.00",
      date: "2024-01-22T14:30:00",
      saleId: "SALE-001",
      processedBy: "Sistema",
    },
    {
      id: "2",
      customerId: "CUST002",
      customerName: "Carlos Mendoza",
      customerPhone: "912345678",
      type: "redeemed",
      points: -50,
      description: "Canje: Descuento 10%",
      date: "2024-01-22T12:15:00",
      rewardId: "REW-001",
      processedBy: "María González",
    },
    {
      id: "3",
      customerId: "CUST001",
      customerName: "María González",
      customerPhone: "987654321",
      type: "bonus",
      points: 50,
      description: "Bonus cumpleaños",
      date: "2024-01-20T10:00:00",
      processedBy: "Sistema",
    },
    {
      id: "4",
      customerId: "CUST003",
      customerName: "Ana Rodríguez",
      customerPhone: "998877665",
      type: "earned",
      points: 15,
      description: "Compra por S/150.00",
      date: "2024-01-19T16:45:00",
      saleId: "SALE-002",
      processedBy: "Sistema",
    },
  ]);

  const [customers] = useState<Customer[]>([
    {
      id: "CUST001",
      name: "María González",
      phone: "987654321",
      email: "maria.gonzalez@email.com",
      totalPoints: 285,
      lifetimePoints: 450,
      tier: "gold",
      joinDate: "2023-01-15",
      lastActivity: "2024-01-22",
      totalSpent: 2850.50,
      totalPurchases: 45,
    },
    {
      id: "CUST002",
      name: "Carlos Mendoza",
      phone: "912345678",
      email: "carlos.mendoza@email.com",
      totalPoints: 165,
      lifetimePoints: 320,
      tier: "silver",
      joinDate: "2023-05-10",
      lastActivity: "2024-01-22",
      totalSpent: 1650.75,
      totalPurchases: 28,
    },
    {
      id: "CUST003",
      name: "Ana Rodríguez",
      phone: "998877665",
      totalPoints: 89,
      lifetimePoints: 125,
      tier: "bronze",
      joinDate: "2023-08-20",
      lastActivity: "2024-01-19",
      totalSpent: 890.25,
      totalPurchases: 15,
    },
    {
      id: "CUST004",
      name: "Roberto Silva",
      phone: "955443322",
      email: "roberto.silva@email.com",
      totalPoints: 542,
      lifetimePoints: 890,
      tier: "platinum",
      joinDate: "2022-11-05",
      lastActivity: "2024-01-21",
      totalSpent: 5420.80,
      totalPurchases: 78,
    },
  ]);

  const [rewards] = useState<PointsReward[]>([
    {
      id: "REW-001",
      name: "Descuento 10%",
      description: "10% de descuento en tu próxima compra",
      pointsCost: 50,
      category: "discount",
      isActive: true,
    },
    {
      id: "REW-002",
      name: "Cerveza Gratis",
      description: "Cerveza de 650ml gratis",
      pointsCost: 100,
      category: "product",
      isActive: true,
      stock: 25,
    },
    {
      id: "REW-003",
      name: "Descuento 20%",
      description: "20% de descuento en tu próxima compra",
      pointsCost: 150,
      category: "discount",
      isActive: true,
    },
    {
      id: "REW-004",
      name: "Delivery Gratis",
      description: "Entrega gratuita en tu próximo pedido",
      pointsCost: 75,
      category: "service",
      isActive: true,
    },
  ]);

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "earned":
        return "bg-green-100 text-green-800";
      case "redeemed":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "bonus":
        return "bg-blue-100 text-blue-800";
      case "adjustment":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "earned":
        return "Ganados";
      case "redeemed":
        return "Canjeados";
      case "expired":
        return "Expirados";
      case "bonus":
        return "Bonus";
      case "adjustment":
        return "Ajuste";
      default:
        return type;
    }
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

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "bronze":
        return "🥉";
      case "silver":
        return "🥈";
      case "gold":
        return "🥇";
      case "platinum":
        return "💎";
      default:
        return "⭐";
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           transaction.customerPhone.includes(searchTerm) ||
           transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredCustomers = customers.filter((customer) => {
    return customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
           customer.phone.includes(customerSearch);
  });

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleAwardPoints = (customerId: string, points: number, description: string) => {
    console.log("Otorgar puntos:", customerId, points, description);
  };

  const handleRedeemPoints = (customerId: string, points: number, rewardId: string) => {
    console.log("Canjear puntos:", customerId, points, rewardId);
  };

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => new Date(c.lastActivity) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
    totalPointsIssued: customers.reduce((sum, c) => sum + c.lifetimePoints, 0),
    totalPointsActive: customers.reduce((sum, c) => sum + c.totalPoints, 0),
    averagePointsPerCustomer: Math.round(customers.reduce((sum, c) => sum + c.totalPoints, 0) / customers.length),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Sistema de Puntos</h1>
          <p className="text-muted-foreground">
            Gestiona el programa de fidelización y recompensas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/points/rewards")}>
            <Gift className="h-4 w-4 mr-2" />
            Recompensas
          </Button>
          <Button onClick={() => navigate("/points/settings")}>
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
          <TabsTrigger value="rewards">Recompensas</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalCustomers}</p>
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
                      <p className="text-sm font-medium text-muted-foreground">Activos (30d)</p>
                      <p className="text-2xl font-bold text-foreground">{stats.activeCustomers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Puntos Emitidos</p>
                      <p className="text-2xl font-bold text-foreground">
                        {stats.totalPointsIssued.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Star className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Puntos Activos</p>
                      <p className="text-2xl font-bold text-foreground">
                        {stats.totalPointsActive.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Zap className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Promedio</p>
                      <p className="text-2xl font-bold text-foreground">
                        {stats.averagePointsPerCustomer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Clientes por Puntos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers
                    .sort((a, b) => b.totalPoints - a.totalPoints)
                    .slice(0, 5)
                    .map((customer, index) => (
                      <div key={customer.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              #{index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getTierColor(customer.tier)}>
                            {getTierIcon(customer.tier)} {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)}
                          </Badge>
                          <span className="font-semibold text-primary">
                            {customer.totalPoints} pts
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Transacciones Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent rounded-lg">
                          {transaction.type === "earned" && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {transaction.type === "redeemed" && <TrendingDown className="h-4 w-4 text-red-600" />}
                          {transaction.type === "bonus" && <Gift className="h-4 w-4 text-blue-600" />}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.customerName}</p>
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customers */}
        <TabsContent value="customers" className="mt-6">
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar cliente por nombre o teléfono..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customers List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{customer.name}</h3>
                          <p className="text-sm text-muted-foreground">{customer.phone}</p>
                        </div>
                      </div>
                      <Badge className={getTierColor(customer.tier)}>
                        {getTierIcon(customer.tier)} {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{customer.totalPoints}</p>
                        <p className="text-xs text-muted-foreground">Puntos Actuales</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">{customer.lifetimePoints}</p>
                        <p className="text-xs text-muted-foreground">Puntos Totales</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Total Gastado:</span>
                        <span className="font-medium">S/{customer.totalSpent.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compras:</span>
                        <span className="font-medium">{customer.totalPurchases}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Última Actividad:</span>
                        <span className="font-medium">{new Date(customer.lastActivity).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCustomerSelect(customer)}
                        className="flex-1"
                      >
                        Ver Historial
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/customers/${customer.id}`)}
                        className="flex-1"
                      >
                        Gestionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Transactions */}
        <TabsContent value="transactions" className="mt-6">
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar transacciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Transactions List */}
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-accent rounded-lg">
                          {transaction.type === "earned" && <TrendingUp className="h-5 w-5 text-green-600" />}
                          {transaction.type === "redeemed" && <TrendingDown className="h-5 w-5 text-red-600" />}
                          {transaction.type === "bonus" && <Gift className="h-5 w-5 text-blue-600" />}
                          {transaction.type === "expired" && <Calendar className="h-5 w-5 text-gray-600" />}
                          {transaction.type === "adjustment" && <Settings className="h-5 w-5 text-yellow-600" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{transaction.customerName}</h3>
                            <Badge className={getTransactionTypeColor(transaction.type)}>
                              {getTransactionTypeLabel(transaction.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {transaction.customerPhone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(transaction.date).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {transaction.processedBy}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points}
                        </p>
                        <p className="text-sm text-muted-foreground">puntos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Rewards */}
        <TabsContent value="rewards" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recompensas Disponibles</h2>
              <Button onClick={() => navigate("/points/rewards/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Recompensa
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <Card key={reward.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Gift className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant={reward.isActive ? "default" : "secondary"}>
                        {reward.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-lg mb-2">{reward.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-primary">{reward.pointsCost} puntos</span>
                      </div>
                      {reward.stock && (
                        <span className="text-sm text-muted-foreground">
                          Stock: {reward.stock}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Editar
                      </Button>
                      <Button size="sm" className="flex-1">
                        {reward.isActive ? "Desactivar" : "Activar"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PointsPage;
