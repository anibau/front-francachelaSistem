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
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  ShoppingBag,
  DollarSign,
  Star,
  Crown,
  TrendingUp
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  birthDate?: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  totalPoints: number;
  lifetimePoints: number;
  totalSpent: number;
  totalOrders: number;
  joinDate: string;
  lastPurchase?: string;
  isActive: boolean;
  notes?: string;
}

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data
  const [customers] = useState<Customer[]>([
    {
      id: "1",
      name: "María González",
      email: "maria.gonzalez@email.com",
      phone: "987654321",
      address: "Av. Larco 123, Miraflores",
      birthDate: "1985-03-15",
      tier: "gold",
      totalPoints: 285,
      lifetimePoints: 450,
      totalSpent: 2850.50,
      totalOrders: 45,
      joinDate: "2023-01-15",
      lastPurchase: "2024-01-22",
      isActive: true,
      notes: "Cliente frecuente, prefiere cervezas artesanales",
    },
    {
      id: "2",
      name: "Carlos Mendoza",
      email: "carlos.mendoza@email.com",
      phone: "912345678",
      address: "Jr. Lima 456, San Isidro",
      birthDate: "1978-07-22",
      tier: "platinum",
      totalPoints: 542,
      lifetimePoints: 890,
      totalSpent: 5420.80,
      totalOrders: 78,
      joinDate: "2022-11-05",
      lastPurchase: "2024-01-21",
      isActive: true,
    },
    {
      id: "3",
      name: "Ana Rodríguez",
      phone: "998877665",
      address: "Calle Real 789, Barranco",
      tier: "silver",
      totalPoints: 165,
      lifetimePoints: 320,
      totalSpent: 1650.75,
      totalOrders: 28,
      joinDate: "2023-05-10",
      lastPurchase: "2024-01-19",
      isActive: true,
    },
    {
      id: "4",
      name: "Roberto Silva",
      email: "roberto.silva@email.com",
      phone: "955443322",
      birthDate: "1990-12-08",
      tier: "bronze",
      totalPoints: 89,
      lifetimePoints: 125,
      totalSpent: 890.25,
      totalOrders: 15,
      joinDate: "2023-08-20",
      lastPurchase: "2024-01-10",
      isActive: true,
    },
    {
      id: "5",
      name: "Luis Torres",
      phone: "966554433",
      tier: "bronze",
      totalPoints: 45,
      lifetimePoints: 78,
      totalSpent: 456.30,
      totalOrders: 8,
      joinDate: "2023-11-15",
      lastPurchase: "2023-12-20",
      isActive: false,
      notes: "Cliente inactivo desde diciembre",
    },
  ]);

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

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTier = filterTier === "all" || customer.tier === filterTier;
    
    let matchesStatus = true;
    if (activeTab === "active") {
      matchesStatus = customer.isActive;
    } else if (activeTab === "inactive") {
      matchesStatus = !customer.isActive;
    } else if (activeTab === "vip") {
      matchesStatus = customer.tier === "gold" || customer.tier === "platinum";
    }
    
    return matchesSearch && matchesTier && matchesStatus;
  });

  const handleEdit = (id: string) => {
    navigate(`/customers/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      console.log("Eliminar cliente:", id);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/customers/${id}`);
  };

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.isActive).length,
    inactive: customers.filter(c => !c.isActive).length,
    vip: customers.filter(c => c.tier === "gold" || c.tier === "platinum").length,
    totalSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    averageSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tu base de datos de clientes y programa de fidelización
          </p>
        </div>
        <Button onClick={() => navigate("/customers/new")} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
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
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Inactivos</p>
                <p className="text-2xl font-bold text-foreground">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">VIP</p>
                <p className="text-2xl font-bold text-foreground">{stats.vip}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Ventas Total</p>
                <p className="text-2xl font-bold text-foreground">
                  S/{stats.totalSpent.toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Promedio</p>
                <p className="text-2xl font-bold text-foreground">
                  S/{stats.averageSpent.toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, teléfono o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="all">Todos los niveles</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="inactive">Inactivos</TabsTrigger>
          <TabsTrigger value="vip">VIP</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{customer.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTierColor(customer.tier)}>
                            {getTierIcon(customer.tier)} {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)}
                          </Badge>
                          <Badge variant={customer.isActive ? "default" : "secondary"}>
                            {customer.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </div>
                    {customer.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{customer.email}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{customer.address}</span>
                      </div>
                    )}
                    {customer.birthDate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(customer.birthDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{customer.totalPoints}</p>
                      <p className="text-xs text-muted-foreground">Puntos Actuales</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{customer.totalOrders}</p>
                      <p className="text-xs text-muted-foreground">Órdenes</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Gastado:</span>
                      <span className="font-medium">S/{customer.totalSpent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Puntos Totales:</span>
                      <span className="font-medium">{customer.lifetimePoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cliente desde:</span>
                      <span className="font-medium">{new Date(customer.joinDate).toLocaleDateString()}</span>
                    </div>
                    {customer.lastPurchase && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Última compra:</span>
                        <span className="font-medium">{new Date(customer.lastPurchase).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {customer.notes && (
                    <div className="mt-3 p-3 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        <strong>Notas:</strong> {customer.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(customer.id)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(customer.id)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(customer.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No se encontraron clientes
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterTier !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "No hay clientes en esta categoría"}
                </p>
                {!searchTerm && filterTier === "all" && activeTab === "all" && (
                  <Button onClick={() => navigate("/customers/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Cliente
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

export default CustomersPage;
