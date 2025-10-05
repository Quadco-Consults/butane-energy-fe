# Butane Energy ERP System

A comprehensive Enterprise Resource Planning (ERP) system built for Butane Energy Limited, a leading LPG storage, trading, and marketing company in Northern Nigeria.

## Features

### Authentication
- User login with role-based access
- Session management
- Demo credentials for testing

### Dashboard
- Real-time business metrics
- Revenue and order statistics
- Low stock alerts
- Pending orders tracking
- Plant capacity monitoring

### Inventory Management
- Product catalog (LPG, Cylinders, Accessories)
- Stock level tracking
- Reorder level alerts
- Multi-plant inventory
- Product categorization

### Order Management
- Create and track sales orders
- Customer order history
- Multiple payment methods (Cash, Transfer, Credit)
- Order status workflow (Pending → Confirmed → Processing → Completed)
- Payment status tracking

### Customer Management
- Customer database
- Customer types (Retail, Wholesale, Distributor)
- Credit limit management
- Outstanding balance tracking
- Customer contact information

### Plant Management
- Multi-location facility tracking
- Plant status monitoring (Operational, Under Construction, Planned)
- Storage capacity management
- Current stock levels
- Plant manager assignments

### Reports & Analytics
- Sales by plant analysis
- Top selling products
- Top customers by spending
- Low stock reports
- Recent order history
- Revenue trends

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Login
- **Email**: admin@butanenergy.com
- **Password**: any password (for demo purposes)

## Project Structure

```
erp-frontend/
├── app/                      # Next.js app directory
│   ├── dashboard/           # Dashboard pages
│   │   ├── customers/       # Customer management
│   │   ├── inventory/       # Inventory management
│   │   ├── orders/          # Order management
│   │   ├── plants/          # Plant management
│   │   └── reports/         # Reports & analytics
│   ├── login/               # Login page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page (redirects to login)
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── DashboardLayout.tsx  # Main dashboard layout
├── contexts/                # React Context providers
│   ├── AuthContext.tsx      # Authentication state
│   └── ERPContext.tsx       # ERP data state
├── lib/                     # Utility functions and types
│   ├── types.ts             # TypeScript type definitions
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## Key Components

### Context Providers

**AuthContext**: Manages user authentication state
- User login/logout
- Session persistence
- Role-based access

**ERPContext**: Manages all ERP data
- Products (CRUD operations)
- Customers (CRUD operations)
- Orders (create, update)
- Plants (CRUD operations)
- Inventory transactions
- Dashboard statistics

### Type Definitions

All TypeScript types are defined in `lib/types.ts`:
- User
- Plant
- Product
- Cylinder (extends Product)
- Customer
- Order
- OrderItem
- InventoryTransaction
- SalesReport
- DashboardStats

## Branding

The application uses Butane Energy's brand colors:
- **Primary Green**: #006738 (oklch(0.39 0.15 160))
- Reflects the company's clean energy focus
- Applied to buttons, links, and key UI elements

## Company Information

**Butane Energy Limited**
- Founded: 2017
- Headquarters: Abuja, Nigeria
- Mission: Deepening the usage of clean energy, preserving the environment and creating wealth
- Products: LPG (bulk), 12.5kg & 6.25kg cylinders, LPG accessories
- Current Plants: Kano (operational), Kaduna (operational), Abuja (under construction)
- Goal: 15 plants across Nigeria by 2027

## Future Enhancements

- Real backend API integration
- Advanced reporting with charts
- Email notifications
- Document generation (invoices, receipts)
- Mobile responsive improvements
- User role permissions
- Audit logging
- Data export functionality
- Advanced search and filtering

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

Use shadcn/ui CLI to add new components:
```bash
npx shadcn@latest add [component-name]
```

## License

Proprietary - Butane Energy Limited

## Support

For support and inquiries:
- Email: info@butanenergy.com
- Phone: +2348035147341
- Address: Suite 1, Plot 1054 R.I Uzoma Off Idris Gidado Street Wuye – Abuja
