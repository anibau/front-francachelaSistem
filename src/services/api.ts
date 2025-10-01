import axios, { type AxiosInstance } from "axios";
import type { PaginatedResponse, User, Product, Customer, Sale } from "@/types";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.api.post("/auth/login", { email, password });
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get("/auth/profile");
    return response.data;
  }

  // Products endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<PaginatedResponse<Product>> {
    const response = await this.api.get("/productos", { params });
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.api.get(`/productos/${id}`);
    return response.data;
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await this.api.post("/productos", data);
    return response.data;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await this.api.put(`/productos/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.api.delete(`/productos/${id}`);
  }

  // Categories endpoints
  async getCategories(): Promise<{ id: string; name: string }[]> {
    const response = await this.api.get("/categorias");
    return response.data;
  }

  // Customers endpoints
  async getCustomerByPhone(phone: string): Promise<Customer> {
    const response = await this.api.get(`/clientes/telefono/${phone}`);
    return response.data;
  }

  async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Customer>> {
    const response = await this.api.get("/clientes", { params });
    return response.data;
  }

  // Sales endpoints
  async createSale(data: {
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      discount?: number;
    }>;
    customerId?: string;
    paymentMethod: string;
    total: number;
    discount?: number;
  }): Promise<Sale> {
    const response = await this.api.post("/ventas", data);
    return response.data;
  }

  async getSales(params?: {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
  }): Promise<PaginatedResponse<Sale>> {
    const response = await this.api.get("/ventas", { params });
    return response.data;
  }

  // Points endpoints
  async getCustomerPoints(customerNumber: string): Promise<{ points: number }> {
    const response = await this.api.get(`/puntos/cliente/${customerNumber}`);
    return response.data;
  }

  async accumulatePoints(data: {
    customerId: string;
    amount: number;
    saleId: string;
  }): Promise<void> {
    await this.api.post("/puntos/acumular", data);
  }

  async redeemPoints(data: {
    customerId: string;
    points: number;
    concept: string;
  }): Promise<void> {
    await this.api.post("/puntos/canjear", data);
  }

  // Promotions endpoints
  async getActivePromotions(): Promise<any[]> {
    const response = await this.api.get("/promociones/activas");
    return response.data;
  }

  async applyPromotion(data: {
    promotionId: string;
    items: Array<{ productId: string; quantity: number }>;
  }): Promise<{ discount: number; applicableItems: string[] }> {
    const response = await this.api.post("/promociones/aplicar", data);
    return response.data;
  }

  // Dashboard endpoints
  async getDashboardStats(params?: { timeRange?: string }): Promise<{
    salesTotal: number;
    salesCount: number;
    productsCount: number;
    lowStockCount: number;
    customersCount: number;
    pendingDeliveries: number;
  }> {
    const response = await this.api.get("/dashboard/stats", { params });
    return response.data;
  }

  // File upload
  async uploadFile(file: File, type: "product-image" | "document"): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await this.api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Import/Export
  async importProducts(file: File): Promise<{ imported: number; errors: string[] }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.api.post("/productos/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async exportProducts(): Promise<Blob> {
    const response = await this.api.get("/productos/export", {
      responseType: "blob",
    });
    return response.data;
  }
}

const apiService = new ApiService();
export default apiService;

