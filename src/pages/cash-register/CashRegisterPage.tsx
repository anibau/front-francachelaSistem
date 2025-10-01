import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign,
  Clock,
  User,
  Calendar,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Smartphone,
  AlertCircle,
  CheckCircle,
  XCircle,
  Lock,
  Unlock
} from "lucide-react";

interface CashRegister {
  id: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  status: "open" | "closed" | "pending_approval";
  initialAmount: number;
  finalAmount?: number;
  expectedAmount?: number;
  difference?: number;
  sales: {
    cash: number;
    card: number;
    yape: number;
    plin: number;
    transfer: number;
  };
  totalSales: number;
  totalTransactions: number;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
}

const CashRegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [openAmount, setOpenAmount] = useState("");
  const [closeAmount, setCloseAmount] = useState("");

  // Mock data
  const [registers] = useState<CashRegister[]>([
    {
      id: "REG-001",
      cashierName: "María González",
      openedAt: "2024-01-22T08:00:00",
      status: "open",
      initialAmount: 200.00,
      sales: {
        cash: 850.50,
        card: 420.75,
        yape: 315.25,
        plin: 180.00,
        transfer: 95.50
      },
      totalSales: 1862.00,
      totalTransactions: 45,
      notes: "Turno mañana - todo normal"
    },
    {
      id: "REG-002",
      cashierName: "Carlos Mendoza",
      openedAt: "2024-01-21T08:00:00",
      closedAt: "2024-01-21T20:00:00",
      status: "closed",
      initialAmount: 200.00,
      finalAmount: 1180.25,
      expectedAmount: 1175.50,
      difference: 4.75,
      sales: {
        cash: 975.50,
        card: 520.30,
        yape: 280.15,
        plin: 150.00,
        transfer: 125.75
      },
      totalSales: 2051.70,
      totalTransactions: 52,
      approvedBy: "Admin",
      approvedAt: "2024-01-21T20:15:00"
    },
    {
      id: "REG-003",
      cashierName: "Ana Rodríguez",
      openedAt: "2024-01-21T14:00:00",
      closedAt: "2024-01-21T22:00:00",
      status: "pending_approval",
      initialAmount: 150.00,
      finalAmount: 890.75,
      expectedAmount: 875.25,
      difference: 15.50,
      sales: {
        cash: 725.25,
        card: 380.50,
        yape: 195.75,
        plin: 120.00,
        transfer: 85.50
      },
      totalSales: 1507.00,
      totalTransactions: 38,
      notes: "Diferencia por cambio de billete roto"
    }
  ]);

  const currentRegister = registers.find(r => r.status === "open");
  const pendingRegisters = registers.filter(r => r.status === "pending_approval");

  const handleOpenRegister = () => {
    if (!openAmount || parseFloat(openAmount) <= 0) {
      alert("Por favor ingresa un monto inicial válido");
      return;
    }
    console.log("Abrir caja con monto inicial:", openAmount);
    setOpenAmount("");
  };

  const handleCloseRegister = () => {
    if (!closeAmount || parseFloat(closeAmount) <= 0) {
      alert("Por favor ingresa el monto final válido");
      return;
    }
    console.log("Cerrar caja con monto final:", closeAmount);
    setCloseAmount("");
  };

  const handleApproveRegister = (id: string) => {
    console.log("Aprobar cierre de caja:", id);
  };

  const handleRejectRegister = (id: string) => {
    console.log("Rechazar cierre de caja:", id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Abierta";
      case "closed":
        return "Cerrada";
      case "pending_approval":
        return "Pendiente Aprobación";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Unlock className="h-4 w-4" />;
      case "closed":
        return <Lock className="h-4 w-4" />;
      case "pending_approval":
        return <Clock className="h-4 w-4" />;
      default:
        return <Lock className="h-4 w-4" />;
    }
  };

  const stats = {
    totalRegisters: registers.length,
    openRegisters: registers.filter(r => r.status === "open").length,
    pendingApproval: registers.filter(r => r.status === "pending_approval").length,
    todaySales: registers
      .filter(r => new Date(r.openedAt).toDateString() === new Date().toDateString())
      .reduce((sum, r) => sum + r.totalSales, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Caja Registradora</h1>
          <p className="text-muted-foreground">
            Control de turnos y cierres de caja
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Cajas Totales</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalRegisters}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Unlock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Abiertas</p>
                <p className="text-2xl font-bold text-foreground">{stats.openRegisters}</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.pendingApproval}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Ventas Hoy</p>
                <p className="text-2xl font-bold text-foreground">
                  S/{stats.todaySales.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Caja Actual</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        {/* Current Register */}
        <TabsContent value="current" className="mt-6">
          {currentRegister ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Unlock className="h-5 w-5 text-green-600" />
                    Caja Abierta - {currentRegister.cashierName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Monto Inicial</p>
                      <p className="text-2xl font-bold text-foreground">
                        S/{currentRegister.initialAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Ventas Totales</p>
                      <p className="text-2xl font-bold text-primary">
                        S/{currentRegister.totalSales.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Transacciones</p>
                      <p className="text-2xl font-bold text-foreground">
                        {currentRegister.totalTransactions}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Banknote className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <p className="text-sm text-muted-foreground">Efectivo</p>
                      <p className="font-semibold">S/{currentRegister.sales.cash.toFixed(2)}</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <CreditCard className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm text-muted-foreground">Tarjeta</p>
                      <p className="font-semibold">S/{currentRegister.sales.card.toFixed(2)}</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Smartphone className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm text-muted-foreground">Yape</p>
                      <p className="font-semibold">S/{currentRegister.sales.yape.toFixed(2)}</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Smartphone className="h-6 w-6 mx-auto mb-2 text-pink-600" />
                      <p className="text-sm text-muted-foreground">Plin</p>
                      <p className="font-semibold">S/{currentRegister.sales.plin.toFixed(2)}</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                      <p className="text-sm text-muted-foreground">Transferencia</p>
                      <p className="font-semibold">S/{currentRegister.sales.transfer.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Abierta desde:</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(currentRegister.openedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Monto Final en Caja</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={closeAmount}
                        onChange={(e) => setCloseAmount(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleCloseRegister} className="w-full">
                        <Lock className="h-4 w-4 mr-2" />
                        Cerrar Caja
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No hay caja abierta
                </h3>
                <p className="text-muted-foreground mb-6">
                  Abre una nueva caja para comenzar a registrar ventas
                </p>
                
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <label className="text-sm font-medium">Monto Inicial</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="200.00"
                      value={openAmount}
                      onChange={(e) => setOpenAmount(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleOpenRegister} className="w-full">
                    <Unlock className="h-4 w-4 mr-2" />
                    Abrir Caja
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Pending Approval */}
        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {pendingRegisters.map((register) => (
              <Card key={register.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{register.cashierName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(register.openedAt).toLocaleDateString()} - {new Date(register.closedAt!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Monto Inicial</p>
                          <p className="font-semibold">S/{register.initialAmount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Monto Final</p>
                          <p className="font-semibold">S/{register.finalAmount!.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Esperado</p>
                          <p className="font-semibold">S/{register.expectedAmount!.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Diferencia</p>
                          <p className={`font-semibold ${
                            register.difference! > 0 ? 'text-green-600' : 
                            register.difference! < 0 ? 'text-red-600' : 'text-foreground'
                          }`}>
                            {register.difference! > 0 ? '+' : ''}S/{register.difference!.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-2 text-sm">
                        <div className="text-center">
                          <p className="text-muted-foreground">Efectivo</p>
                          <p className="font-medium">S/{register.sales.cash.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Tarjeta</p>
                          <p className="font-medium">S/{register.sales.card.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Yape</p>
                          <p className="font-medium">S/{register.sales.yape.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Plin</p>
                          <p className="font-medium">S/{register.sales.plin.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Transfer.</p>
                          <p className="font-medium">S/{register.sales.transfer.toFixed(2)}</p>
                        </div>
                      </div>

                      {register.notes && (
                        <div className="mt-3 p-3 bg-muted rounded-md">
                          <p className="text-sm">
                            <strong>Notas:</strong> {register.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleApproveRegister(register.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprobar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectRegister(register.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {pendingRegisters.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay cierres pendientes
                  </h3>
                  <p className="text-muted-foreground">
                    Todos los cierres de caja han sido procesados
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">
            {registers.filter(r => r.status === "closed").map((register) => (
              <Card key={register.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Lock className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{register.cashierName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(register.status)}>
                              {getStatusIcon(register.status)}
                              <span className="ml-1">{getStatusLabel(register.status)}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Período</p>
                          <p className="font-medium">
                            {new Date(register.openedAt).toLocaleDateString()} - {new Date(register.closedAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Ventas Totales</p>
                          <p className="font-medium">S/{register.totalSales.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Transacciones</p>
                          <p className="font-medium">{register.totalTransactions}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Diferencia</p>
                          <p className={`font-medium ${
                            register.difference! > 0 ? 'text-green-600' : 
                            register.difference! < 0 ? 'text-red-600' : 'text-foreground'
                          }`}>
                            {register.difference! > 0 ? '+' : ''}S/{register.difference!.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Aprobado por</p>
                          <p className="font-medium">{register.approvedBy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CashRegisterPage;
