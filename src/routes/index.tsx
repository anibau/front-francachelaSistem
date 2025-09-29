import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import LoginPage from "@/pages/auth/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import POSPage from "@/pages/pos/POSPage";
import ProductsPage from "@/pages/products/ProductsPage";
import ProductForm from "@/pages/products/ProductForm";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Placeholder components for routes not yet implemented
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
    <p className="text-gray-600">Esta página está en desarrollo</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "pos",
        element: <POSPage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/new",
        element: <ProductForm />,
      },
      {
        path: "products/:id/edit",
        element: <ProductForm isEditing />,
      },
      {
        path: "promotions",
        element: <PlaceholderPage title="Promociones" />,
      },
      {
        path: "customers",
        element: <PlaceholderPage title="Clientes" />,
      },
      {
        path: "delivery",
        element: <PlaceholderPage title="Delivery" />,
      },
      {
        path: "cash-register",
        element: <PlaceholderPage title="Caja" />,
      },
      {
        path: "expenses",
        element: <PlaceholderPage title="Gastos" />,
      },
      {
        path: "points",
        element: <PlaceholderPage title="Puntos" />,
      },
      {
        path: "reports",
        element: <PlaceholderPage title="Reportes" />,
      },
      {
        path: "settings",
        element: <PlaceholderPage title="Configuración" />,
      },
      {
        path: "profile",
        element: <PlaceholderPage title="Perfil" />,
      },
      {
        path: "notifications",
        element: <PlaceholderPage title="Notificaciones" />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

