import React from "react";
import { Link } from "react-router-dom";
import { Menu, Bell, User, LogOut, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOffline } from "@/contexts/OfflineContext";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isOnline, isOfflineMode, toggleOfflineMode } = useOffline();
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current && 
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      
      if (
        userMenuRef.current && 
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-card border-b border-border z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <span className="text-xl font-bold text-primary">Francachela</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Offline Mode Toggle */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${
                  isOfflineMode ? "text-orange-600" : "text-muted-foreground"
                }`}
                onClick={toggleOfflineMode}
              >
                {isOfflineMode ? (
                  <>
                    <WifiOff className="h-4 w-4" />
                    <span className="hidden sm:inline">Modo Offline</span>
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {isOnline ? "Conectado" : "Desconectado"}
                    </span>
                  </>
                )}
              </Button>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card rounded-md shadow-lg py-1 z-10 border border-border">
                  <div className="px-4 py-2 border-b border-border">
                    <h3 className="text-sm font-medium text-foreground">Notificaciones</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 hover:bg-accent">
                      <p className="text-sm text-foreground">Stock bajo: Cerveza Cristal 650ml</p>
                      <p className="text-xs text-muted-foreground">Hace 5 minutos</p>
                    </div>
                    <div className="px-4 py-2 hover:bg-accent">
                      <p className="text-sm text-foreground">Nuevo pedido de delivery #1234</p>
                      <p className="text-xs text-muted-foreground">Hace 20 minutos</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-border text-center">
                    <Link
                      to="/notifications"
                      className="text-sm text-primary hover:text-primary/80"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      Ver todas
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="relative"
              >
                <User className="h-5 w-5" />
              </Button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-10 border border-border">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-accent"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-accent"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Configuración
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent"
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar sesión
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
