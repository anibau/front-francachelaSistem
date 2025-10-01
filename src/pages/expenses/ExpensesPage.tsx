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
  DollarSign,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Receipt,
  Tag
} from "lucide-react";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  subcategory?: string;
  date: string;
  status: "pending" | "approved" | "paid" | "rejected";
  requestedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  paymentMethod?: "cash" | "transfer" | "card";
  receipt?: string;
  notes?: string;
  isRecurring?: boolean;
  recurringFrequency?: "weekly" | "monthly" | "yearly";
  nextDue?: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  budget: number;
  spent: number;
  color: string;
}

const ExpensesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data
  const [expenses] = useState<Expense[]>([
    {
      id: "1",
      description: "Compra de productos para inventario",
      amount: 1250.00,
      category: "inventory",
      subcategory: "Cervezas",
      date: "2024-01-22",
      status: "approved",
      requestedBy: "María González",
      approvedBy: "Admin",
      approvedAt: "2024-01-22T10:30:00",
      paymentMethod: "transfer",
      notes: "Reposición de stock semanal",
    },
    {
      id: "2",
      description: "Pago de servicios públicos - Luz",
      amount: 180.50,
      category: "utilities",
      date: "2024-01-20",
      status: "paid",
      requestedBy: "Carlos Mendoza",
      approvedBy: "Admin",
      approvedAt: "2024-01-20T14:15:00",
      paidAt: "2024-01-20T16:00:00",
      paymentMethod: "transfer",
      isRecurring: true,
      recurringFrequency: "monthly",
      nextDue: "2024-02-20",
    },
    {
      id: "3",
      description: "Mantenimiento de equipos de refrigeración",
      amount: 350.00,
      category: "maintenance",
      date: "2024-01-19",
      status: "pending",
      requestedBy: "Ana Rodríguez",
      notes: "Reparación urgente de refrigeradora principal",
    },
    {
      id: "4",
      description: "Material de limpieza y desinfección",
      amount: 85.75,
      category: "supplies",
      date: "2024-01-18",
      status: "paid",
      requestedBy: "Luis Torres",
      approvedBy: "Admin",
      approvedAt: "2024-01-18T11:00:00",
      paidAt: "2024-01-18T15:30:00",
      paymentMethod: "cash",
    },
    {
      id: "5",
      description: "Publicidad en redes sociales",
      amount: 200.00,
      category: "marketing",
      date: "2024-01-17",
      status: "rejected",
      requestedBy: "Pedro Martínez",
      notes: "Presupuesto de marketing agotado este mes",
    },
  ]);

  const [categories] = useState<ExpenseCategory[]>([
    { id: "inventory", name: "Inventario", budget: 5000, spent: 3250, color: "bg-blue-100 text-blue-800" },
    { id: "utilities", name: "Servicios", budget: 800, spent: 650, color: "bg-green-100 text-green-800" },
    { id: "maintenance", name: "Mantenimiento", budget: 1000, spent: 450, color: "bg-orange-100 text-orange-800" },
    { id: "supplies", name: "Suministros", budget: 500, spent: 285, color: "bg-purple-100 text-purple-800" },
    { id: "marketing", name: "Marketing", budget: 600, spent: 150, color: "bg-pink-100 text-pink-800" },
    { id: "other", name: "Otros", budget: 300, spent: 120, color: "bg-gray-100 text-gray-800" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "approved":
        return "Aprobado";
      case "paid":
        return "Pagado";
      case "rejected":
        return "Rechazado";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : "bg-gray-100 text-gray-800";
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || expense.category === filterCategory;
    const matchesStatus = activeTab === "all" || expense.status === activeTab;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleViewDetails = (id: string) => {
    navigate(`/expenses/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/expenses/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este gasto?")) {
      console.log("Eliminar gasto:", id);
    }
  };

  const handleApprove = (id: string) => {
    console.log("Aprobar gasto:", id);
  };

  const handleReject = (id: string) => {
    console.log("Rechazar gasto:", id);
  };

  const handleMarkAsPaid = (id: string) => {
    console.log("Marcar como pagado:", id);
  };

  const stats = {
    total: expenses.length,
    pending: expenses.filter(e => e.status === "pending").length,
    approved: expenses.filter(e => e.status === "approved").length,
    paid: expenses.filter(e => e.status === "paid").length,
    totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
    monthlyBudget: categories.reduce((sum, c) => sum + c.budget, 0),
    monthlySpent: categories.reduce((sum, c) => sum + c.spent, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Gastos</h1>
          <p className="text-muted-foreground">
            Gestiona gastos operativos y presupuestos
          </p>
        </div>
        <Button onClick={() => navigate("/expenses/new")} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Gasto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Receipt className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Gastos</p>
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
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pagados</p>
                <p className="text-2xl font-bold text-foreground">{stats.paid}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Monto Total</p>
                <p className="text-2xl font-bold text-foreground">
                  S/{stats.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Presupuesto Mensual por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className={category.color}>
                    {category.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    S/{category.spent} / S/{category.budget}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      category.spent > category.budget ? 'bg-red-500' : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min((category.spent / category.budget) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {((category.spent / category.budget) * 100).toFixed(1)}% utilizado
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar gastos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="approved">Aprobados</TabsTrigger>
          <TabsTrigger value="paid">Pagados</TabsTrigger>
          <TabsTrigger value="rejected">Rechazados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <Card key={expense.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-accent rounded-lg">
                          <Receipt className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{expense.description}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getCategoryColor(expense.category)}>
                              {getCategoryName(expense.category)}
                            </Badge>
                            {expense.subcategory && (
                              <Badge variant="outline">
                                {expense.subcategory}
                              </Badge>
                            )}
                            {expense.isRecurring && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                Recurrente
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold text-foreground">
                            S/{expense.amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{expense.requestedBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(expense.status)}>
                            {getStatusIcon(expense.status)}
                            <span className="ml-1">{getStatusLabel(expense.status)}</span>
                          </Badge>
                        </div>
                      </div>

                      {expense.notes && (
                        <div className="mt-3 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            <strong>Notas:</strong> {expense.notes}
                          </p>
                        </div>
                      )}

                      {expense.approvedBy && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Aprobado por: <span className="font-medium">{expense.approvedBy}</span>
                          {expense.approvedAt && (
                            <span> el {new Date(expense.approvedAt).toLocaleString()}</span>
                          )}
                        </div>
                      )}

                      {expense.paidAt && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          Pagado el {new Date(expense.paidAt).toLocaleString()}
                          {expense.paymentMethod && (
                            <span> vía {expense.paymentMethod}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {expense.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(expense.id)}
                          >
                            Aprobar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(expense.id)}
                          >
                            Rechazar
                          </Button>
                        </>
                      )}
                      {expense.status === "approved" && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsPaid(expense.id)}
                        >
                          Marcar Pagado
                        </Button>
                      )}
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(expense.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(expense.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
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

          {filteredExpenses.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No se encontraron gastos
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterCategory !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "No hay gastos en esta categoría"}
                </p>
                {!searchTerm && filterCategory === "all" && activeTab === "all" && (
                  <Button onClick={() => navigate("/expenses/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Gasto
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

export default ExpensesPage;
