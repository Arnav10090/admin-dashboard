# KPI Dashboard

A modern, interactive KPI (Key Performance Indicator) dashboard built with Next.js, TypeScript, and Tailwind CSS. This application allows users to track and visualize various performance metrics with an intuitive drag-and-drop interface.

## Features

- 📊 Interactive KPI cards with real-time updates
- 📅 Date range filtering (day/month/year)
- 🎨 Responsive design with dark mode support
- 📱 Mobile-friendly interface
- 🔄 Drag-and-drop card reordering
- 📈 Visual progress indicators
- 🔄 Automatic calculation of derived metrics (e.g., Tons/HR from Coils/HR)

## Prerequisites

- Node.js 18.0.0 or later
- MySQL 8.0 or later
- npm or yarn package manager

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd admin-dashboard
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add the following variables:

```env
DATABASE_URL="mysql://username:password@localhost:3306/kpi_dashboard?schema=public"
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Replace `username` and `password` with your MySQL credentials.

### 4. Set up the database

Make sure your MySQL server is running, then run:

```bash
npx prisma db push
```

### 5. Seed the database with initial data (optional)

```bash
npx prisma db seed
```

### 6. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # Reusable components
│   ├── lib/               # Utility functions
│   └── ...
├── prisma/                # Database schema and migrations
├── public/                # Static files
└── ...
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio for database management

## Database Schema

The application uses the following main table:

- `KpiCard` - Stores KPI card configurations and values

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
