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
  Tag,
  Calendar,
  Percent,
  DollarSign,
  Gift,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: "percentage" | "fixed_amount" | "combo" | "birthday";
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  customerTiers?: string[];
}

const PromotionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data
  const [promotions] = useState<Promotion[]>([
    {
      id: "1",
      name: "Descuento de Cumpleaños",
      description: "20% de descuento especial para clientes en su cumpleaños",
      type: "birthday",
      value: 20,
      minPurchase: 50,
      maxDiscount: 100,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      isActive: true,
      usageCount: 45,
      customerTiers: ["gold", "platinum"],
    },
    {
      id: "2",
      name: "Combo Cerveza + Piqueo",
      description: "Cerveza + piqueo por S/25",
      type: "combo",
      value: 25,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      isActive: true,
      usageLimit: 100,
      usageCount: 67,
      applicableProducts: ["cerveza-cristal", "piqueo-mixto"],
    },
    {
      id: "3",
      name: "15% en Licores Premium",
      description: "Descuento en toda la línea de licores premium",
      type: "percentage",
      value: 15,
      minPurchase: 200,
      startDate: "2024-01-10",
      endDate: "2024-01-31",
      isActive: true,
      usageCount: 23,
      applicableCategories: ["licores-premium"],
    },
    {
      id: "4",
      name: "S/10 de Descuento",
      description: "Descuento fijo de S/10 en compras mayores a S/80",
      type: "fixed_amount",
      value: 10,
      minPurchase: 80,
      startDate: "2024-01-01",
      endDate: "2024-01-25",
      isActive: false,
      usageLimit: 50,
      usageCount: 50,
    },
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "percentage":
        return "bg-blue-100 text-blue-800";
      case "fixed_amount":
        return "bg-green-100 text-green-800";
      case "combo":
        return "bg-purple-100 text-purple-800";
      case "birthday":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "percentage":
        return "Porcentaje";
      case "fixed_amount":
        return "Monto Fijo";
      case "combo":
        return "Combo";
      case "birthday":
        return "Cumpleaños";
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-4 w-4" />;
      case "fixed_amount":
        return <DollarSign className="h-4 w-4" />;
      case "combo":
        return <Gift className="h-4 w-4" />;
      case "birthday":
        return <Users className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    return promotion.isActive && now >= start && now <= end;
  };

  const isPromotionExpired = (promotion: Promotion) => {
    const now = new Date();
    const end = new Date(promotion.endDate);
    return now > end;
  };

  const filteredPromotions = promotions.filter((promotion) => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || promotion.type === filterType;
    
    let matchesStatus = true;
    if (activeTab === "active") {
      matchesStatus = isPromotionActive(promotion);
    } else if (activeTab === "inactive") {
      matchesStatus = !promotion.isActive;
    } else if (activeTab === "expired") {
      matchesStatus = isPromotionExpired(promotion);
    }
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEdit = (id: string) => {
    navigate(`/promotions/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta promoción?")) {
      console.log("Eliminar promoción:", id);
    }
  };

  const handleToggleStatus = (id: string) => {
    console.log("Cambiar estado de promoción:", id);
  };

  const stats = {
    total: promotions.length,
    active: promotions.filter(p => isPromotionActive(p)).length,
    inactive: promotions.filter(p => !p.isActive).length,
    expired: promotions.filter(p => isPromotionExpired(p)).length,
    totalUsage: promotions.reduce((sum, p) => sum + p.usageCount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Promociones</h1>
          <p className="text-muted-foreground">
            Gestiona descuentos, ofertas y promociones especiales
          </p>
        </div>
        <Button onClick={() => navigate("/promotions/new")} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Promoción
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Tag className="h-6 w-6 text-primary" />
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
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Activas</p>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Inactivas</p>
                <p className="text-2xl font-bold text-foreground">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Expiradas</p>
                <p className="text-2xl font-bold text-foreground">{stats.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Usos Totales</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalUsage}</p>
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
                  placeholder="Buscar promociones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="all">Todos los tipos</option>
                <option value="percentage">Porcentaje</option>
                <option value="fixed_amount">Monto Fijo</option>
                <option value="combo">Combo</option>
                <option value="birthday">Cumpleaños</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="active">Activas</TabsTrigger>
          <TabsTrigger value="inactive">Inactivas</TabsTrigger>
          <TabsTrigger value="expired">Expiradas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredPromotions.map((promotion) => (
              <Card key={promotion.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-accent rounded-lg">
                          {getTypeIcon(promotion.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{promotion.name}</h3>
                          <p className="text-sm text-muted-foreground">{promotion.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getTypeColor(promotion.type)}>
                          {getTypeLabel(promotion.type)}
                        </Badge>
                        <Badge variant={isPromotionActive(promotion) ? "default" : "secondary"}>
                          {isPromotionActive(promotion) ? "Activa" : 
                           isPromotionExpired(promotion) ? "Expirada" : "Inactiva"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Valor:</span>
                          <p className="font-medium">
                            {promotion.type === "percentage" ? `${promotion.value}%` : 
                             promotion.type === "fixed_amount" ? `S/${promotion.value}` :
                             `S/${promotion.value}`}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Vigencia:</span>
                          <p className="font-medium">
                            {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Usos:</span>
                          <p className="font-medium">
                            {promotion.usageCount}{promotion.usageLimit ? `/${promotion.usageLimit}` : ''}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Compra mínima:</span>
                          <p className="font-medium">
                            {promotion.minPurchase ? `S/${promotion.minPurchase}` : 'Sin mínimo'}
                          </p>
                        </div>
                      </div>

                      {promotion.usageLimit && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progreso de uso</span>
                            <span>{Math.round((promotion.usageCount / promotion.usageLimit) * 100)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${Math.min((promotion.usageCount / promotion.usageLimit) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant={promotion.isActive ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleToggleStatus(promotion.id)}
                      >
                        {promotion.isActive ? "Desactivar" : "Activar"}
                      </Button>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/promotions/${promotion.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(promotion.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(promotion.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPromotions.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No se encontraron promociones
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterType !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "No hay promociones en esta categoría"}
                </p>
                {!searchTerm && filterType === "all" && activeTab === "all" && (
                  <Button onClick={() => navigate("/promotions/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Promoción
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

export default PromotionsPage;
