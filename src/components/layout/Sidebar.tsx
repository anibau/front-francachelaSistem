import React from "react";
import { NavLink } from "react-router-dom";
import { X, Home, ShoppingCart, Package, Tag, Users, Truck, DollarSign, BarChart, Settings, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const { user } = useAuth();
  
  const navItems: NavItem[] = [
    {
      path: "/",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      path: "/pos",
      label: "Punto de Venta",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      path: "/products",
      label: "Productos",
      icon: <Package className="h-5 w-5" />,
    },
    {
      path: "/promotions",
      label: "Promociones",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      path: "/customers",
      label: "Clientes",
      icon: <Users className="h-5 w-5" />,
    },
    {
      path: "/delivery",
      label: "Delivery",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      path: "/cash-register",
      label: "Caja",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      path: "/expenses",
      label: "Gastos",
      icon: <DollarSign className="h-5 w-5" />,
      roles: ["administrador"],
    },
    {
      path: "/points",
      label: "Puntos",
      icon: <Award className="h-5 w-5" />,
    },
    {
      path: "/reports",
      label: "Reportes",
      icon: <BarChart className="h-5 w-5" />,
      roles: ["administrador"],
    },
    {
      path: "/settings",
      label: "Configuración",
      icon: <Settings className="h-5 w-5" />,
      roles: ["administrador"],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role))
  );

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <span className="text-xl font-bold text-blue-600">Francachela</span>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="px-4 py-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-2 text-sm rounded-md",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

