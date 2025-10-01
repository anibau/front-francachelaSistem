import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings,
  Store,
  Users,
  CreditCard,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";

interface SystemSettings {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  taxRate: number;
  currency: string;
  timezone: string;
  language: string;
}

interface PaymentSettings {
  acceptCash: boolean;
  acceptCard: boolean;
  acceptYape: boolean;
  acceptPlin: boolean;
  acceptTransfer: boolean;
  cardProcessorFee: number;
  digitalWalletFee: number;
}

interface PointsSettings {
  pointsPerSol: number;
  minimumPurchaseForPoints: number;
  pointsExpirationDays: number;
  birthdayBonusPoints: number;
  enablePointsSystem: boolean;
}

interface NotificationSettings {
  lowStockAlert: boolean;
  lowStockThreshold: number;
  dailySalesReport: boolean;
  customerBirthdayReminder: boolean;
  expiredProductsAlert: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Mock data
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    storeName: "Licorería Francachela",
    storeAddress: "Av. Principal 123, Lima, Perú",
    storePhone: "+51 987 654 321",
    storeEmail: "info@francachela.com",
    taxRate: 18,
    currency: "PEN",
    timezone: "America/Lima",
    language: "es",
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    acceptCash: true,
    acceptCard: true,
    acceptYape: true,
    acceptPlin: true,
    acceptTransfer: true,
    cardProcessorFee: 3.5,
    digitalWalletFee: 2.0,
  });

  const [pointsSettings, setPointsSettings] = useState<PointsSettings>({
    pointsPerSol: 1,
    minimumPurchaseForPoints: 10,
    pointsExpirationDays: 365,
    birthdayBonusPoints: 50,
    enablePointsSystem: true,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    lowStockAlert: true,
    lowStockThreshold: 10,
    dailySalesReport: true,
    customerBirthdayReminder: true,
    expiredProductsAlert: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Guardando configuración de ${section}`);
      // Aquí iría la lógica para guardar en el backend
    } catch (error) {
      console.error("Error al guardar configuración:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSettings = () => {
    const settings = {
      system: systemSettings,
      payment: paymentSettings,
      points: pointsSettings,
      notifications: notificationSettings,
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'francachela-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string);
          if (settings.system) setSystemSettings(settings.system);
          if (settings.payment) setPaymentSettings(settings.payment);
          if (settings.points) setPointsSettings(settings.points);
          if (settings.notifications) setNotificationSettings(settings.notifications);
          console.log("Configuración importada exitosamente");
        } catch (error) {
          console.error("Error al importar configuración:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Configuración</h1>
          <p className="text-muted-foreground">
            Gestiona la configuración del sistema y preferencias
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="points">Puntos</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Información de la Tienda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre de la Tienda</label>
                    <Input
                      value={systemSettings.storeName}
                      onChange={(e) => setSystemSettings({...systemSettings, storeName: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Teléfono</label>
                    <Input
                      value={systemSettings.storePhone}
                      onChange={(e) => setSystemSettings({...systemSettings, storePhone: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Dirección</label>
                  <Input
                    value={systemSettings.storeAddress}
                    onChange={(e) => setSystemSettings({...systemSettings, storeAddress: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={systemSettings.storeEmail}
                    onChange={(e) => setSystemSettings({...systemSettings, storeEmail: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tasa de Impuesto (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={systemSettings.taxRate}
                      onChange={(e) => setSystemSettings({...systemSettings, taxRate: parseFloat(e.target.value)})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Moneda</label>
                    <select
                      value={systemSettings.currency}
                      onChange={(e) => setSystemSettings({...systemSettings, currency: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="PEN">Soles (PEN)</option>
                      <option value="USD">Dólares (USD)</option>
                      <option value="EUR">Euros (EUR)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Zona Horaria</label>
                    <select
                      value={systemSettings.timezone}
                      onChange={(e) => setSystemSettings({...systemSettings, timezone: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="America/Lima">Lima (UTC-5)</option>
                      <option value="America/New_York">Nueva York (UTC-5)</option>
                      <option value="Europe/Madrid">Madrid (UTC+1)</option>
                    </select>
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings("general")} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Métodos de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Efectivo</span>
                      <input
                        type="checkbox"
                        checked={paymentSettings.acceptCash}
                        onChange={(e) => setPaymentSettings({...paymentSettings, acceptCash: e.target.checked})}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Tarjeta de Crédito/Débito</span>
                      <input
                        type="checkbox"
                        checked={paymentSettings.acceptCard}
                        onChange={(e) => setPaymentSettings({...paymentSettings, acceptCard: e.target.checked})}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Yape</span>
                      <input
                        type="checkbox"
                        checked={paymentSettings.acceptYape}
                        onChange={(e) => setPaymentSettings({...paymentSettings, acceptYape: e.target.checked})}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Plin</span>
                      <input
                        type="checkbox"
                        checked={paymentSettings.acceptPlin}
                        onChange={(e) => setPaymentSettings({...paymentSettings, acceptPlin: e.target.checked})}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Transferencia Bancaria</span>
                      <input
                        type="checkbox"
                        checked={paymentSettings.acceptTransfer}
                        onChange={(e) => setPaymentSettings({...paymentSettings, acceptTransfer: e.target.checked})}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Comisión Tarjetas (%)</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={paymentSettings.cardProcessorFee}
                        onChange={(e) => setPaymentSettings({...paymentSettings, cardProcessorFee: parseFloat(e.target.value)})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Comisión Billeteras Digitales (%)</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={paymentSettings.digitalWalletFee}
                        onChange={(e) => setPaymentSettings({...paymentSettings, digitalWalletFee: parseFloat(e.target.value)})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings("payments")} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Points Settings */}
        <TabsContent value="points" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Sistema de Puntos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Habilitar Sistema de Puntos</h3>
                    <p className="text-sm text-muted-foreground">
                      Permite a los clientes acumular y canjear puntos
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pointsSettings.enablePointsSystem}
                    onChange={(e) => setPointsSettings({...pointsSettings, enablePointsSystem: e.target.checked})}
                    className="w-4 h-4"
                  />
                </div>

                {pointsSettings.enablePointsSystem && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Puntos por Sol Gastado</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={pointsSettings.pointsPerSol}
                        onChange={(e) => setPointsSettings({...pointsSettings, pointsPerSol: parseFloat(e.target.value)})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Compra Mínima para Puntos (S/)</label>
                      <Input
                        type="number"
                        min="0"
                        value={pointsSettings.minimumPurchaseForPoints}
                        onChange={(e) => setPointsSettings({...pointsSettings, minimumPurchaseForPoints: parseInt(e.target.value)})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Expiración de Puntos (días)</label>
                      <Input
                        type="number"
                        min="0"
                        value={pointsSettings.pointsExpirationDays}
                        onChange={(e) => setPointsSettings({...pointsSettings, pointsExpirationDays: parseInt(e.target.value)})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bonus Cumpleaños (puntos)</label>
                      <Input
                        type="number"
                        min="0"
                        value={pointsSettings.birthdayBonusPoints}
                        onChange={(e) => setPointsSettings({...pointsSettings, birthdayBonusPoints: parseInt(e.target.value)})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                <Button onClick={() => handleSaveSettings("points")} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Alerta de Stock Bajo</h3>
                      <p className="text-sm text-muted-foreground">
                        Notificar cuando los productos tengan poco stock
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.lowStockAlert}
                      onChange={(e) => setNotificationSettings({...notificationSettings, lowStockAlert: e.target.checked})}
                      className="w-4 h-4"
                    />
                  </div>

                  {notificationSettings.lowStockAlert && (
                    <div className="ml-4">
                      <label className="text-sm font-medium">Umbral de Stock Bajo</label>
                      <Input
                        type="number"
                        min="1"
                        value={notificationSettings.lowStockThreshold}
                        onChange={(e) => setNotificationSettings({...notificationSettings, lowStockThreshold: parseInt(e.target.value)})}
                        className="mt-1 w-32"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Reporte Diario de Ventas</h3>
                      <p className="text-sm text-muted-foreground">
                        Enviar resumen diario de ventas por email
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.dailySalesReport}
                      onChange={(e) => setNotificationSettings({...notificationSettings, dailySalesReport: e.target.checked})}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Recordatorio de Cumpleaños</h3>
                      <p className="text-sm text-muted-foreground">
                        Notificar cumpleaños de clientes para ofertas especiales
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.customerBirthdayReminder}
                      onChange={(e) => setNotificationSettings({...notificationSettings, customerBirthdayReminder: e.target.checked})}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Productos Vencidos</h3>
                      <p className="text-sm text-muted-foreground">
                        Alerta sobre productos próximos a vencer
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.expiredProductsAlert}
                      onChange={(e) => setNotificationSettings({...notificationSettings, expiredProductsAlert: e.target.checked})}
                      className="w-4 h-4"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Canales de Notificación</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Notificaciones por Email</span>
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Notificaciones por SMS</span>
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsNotifications}
                        onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings("notifications")} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Seguridad y Acceso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Cambiar Contraseña</h3>
                    <div className="space-y-3 max-w-md">
                      <Input
                        type="password"
                        placeholder="Contraseña actual"
                      />
                      <Input
                        type="password"
                        placeholder="Nueva contraseña"
                      />
                      <Input
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                      />
                      <Button>Cambiar Contraseña</Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">API Key</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Clave para integraciones con sistemas externos
                    </p>
                    <div className="flex items-center gap-2 max-w-md">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value="sk_live_1234567890abcdef"
                        readOnly
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        Regenerar
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Sesiones Activas</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Sesión Actual</p>
                          <p className="text-sm text-muted-foreground">
                            Chrome en Windows • IP: 192.168.1.100
                          </p>
                        </div>
                        <Badge variant="default">Activa</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Tablet POS</p>
                          <p className="text-sm text-muted-foreground">
                            Safari en iPad • IP: 192.168.1.101
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Cerrar Sesión
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Respaldo de Datos</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Último respaldo: Hoy a las 3:00 AM
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Respaldo
                      </Button>
                      <Button>
                        <Database className="h-4 w-4 mr-2" />
                        Crear Respaldo Ahora
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
