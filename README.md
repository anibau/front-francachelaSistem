# Francachela - Sistema de Gestión de Ventas e Inventario

Frontend moderno para el sistema de gestión de licorería Francachela, con interfaz táctil, gestión de inventario, clientes y reportes.

## 🚀 Características

- **POS Táctil**: Interfaz optimizada para tablets y pantallas táctiles
- **Gestión de Productos**: CRUD completo con códigos de barras
- **Sistema de Clientes**: Fidelización y puntos
- **Promociones**: Descuentos automáticos y combos
- **Reportes**: Métricas en tiempo real
- **Multitickets**: Múltiples ventas simultáneas
- **Métodos de Pago**: Efectivo, Yape, Plin, Transferencia
- **Modo Offline**: Funciona sin conexión con mocks

## 🛠️ Tecnologías

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **State Management**: React Query
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 📋 Requisitos

- Node.js 18+
- npm o yarn

## 🚀 Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/anibau/front-francachelaSistem.git
   cd front-francachelaSistem
   ```

2. Instalar dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Configurar variables de entorno:
   - Copia el archivo `.env.example` a `.env`
   - Ajusta las variables según tu entorno

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. Abrir [http://localhost:5173](http://localhost:5173) en el navegador.

## 📱 Modo Offline

El sistema puede funcionar sin conexión a internet, almacenando las operaciones en el almacenamiento local del navegador y sincronizándolas cuando se restablezca la conexión.

Para activar el modo offline:
1. Haz clic en el icono de conexión en la barra superior
2. Las operaciones se guardarán localmente
3. Al restablecer la conexión, se sincronizarán automáticamente

## 🔄 Integración con Backend

Este frontend está diseñado para integrarse con el backend de Francachela, que proporciona las siguientes APIs:

- Autenticación y usuarios
- Gestión de productos e inventario
- Sistema de puntos y fidelización
- Promociones y descuentos
- Delivery y seguimiento
- Cierres de caja y control financiero

## 📦 Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── ui/           # Componentes de UI básicos
│   └── layout/       # Componentes de estructura
├── contexts/         # Contextos de React
├── hooks/            # Custom hooks
├── lib/              # Utilidades y helpers
├── pages/            # Páginas de la aplicación
├── routes/           # Configuración de rutas
├── services/         # Servicios de API
└── types/            # Definiciones de TypeScript
```

## 🧪 Testing

```bash
npm run test
# o
yarn test
```

## 🏗️ Build para Producción

```bash
npm run build
# o
yarn build
```

## 📄 Licencia

Este proyecto es propiedad de Francachela.

## 👥 Contacto

Para más información, contactar a [contacto@francachela.com](mailto:contacto@francachela.com).

