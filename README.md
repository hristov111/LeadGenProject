# Lead Generation Platform 🚀

A modern, multilingual lead generation platform built with Next.js 16, designed to help users find the best telecom services (Internet, Mobile, TV, Business) in Bulgaria. The platform features an intelligent quiz flow, admin dashboard, duplicate detection, and comprehensive analytics.

**Live Demo:** [lead-gen-project-six.vercel.app](https://lead-gen-project-six.vercel.app)

## ✨ Features

### User-Facing Features
- **🌍 Multi-language Support**: Available in English, Bulgarian, German, Russian, and Turkish
- **📋 Interactive Quiz**: Smart questionnaire to gather user requirements
- **🎯 Results Page**: Personalized matching results with animated transitions
- **📝 Lead Submission**: Optimized contact form with validation
- **🎨 Modern UI**: Beautiful, responsive design with Framer Motion animations
- **♿ Accessibility**: WCAG compliant with keyboard navigation support
- **📱 Mobile-First**: Fully responsive across all devices

### Admin Features
- **📊 Dashboard**: Real-time analytics and conversion tracking
- **👥 Lead Management**: Comprehensive lead tracking and status updates
- **🔍 Duplicate Detection**: Automatic phone number normalization and duplicate flagging
- **📈 Quality Scoring**: Lead quality assessment based on timeline and behavior
- **💾 CSV Export**: Export leads with all metadata
- **🔐 Authentication**: Secure admin access with session management
- **📱 Pipeline Management**: Track leads through conversion funnel

### Technical Features
- **🚦 Rate Limiting**: IP-based submission throttling
- **🔄 Source Tracking**: UTM parameters and referrer tracking
- **📊 Analytics**: Event tracking for user behavior
- **🛡️ Data Validation**: Zod schema validation
- **🗄️ Database**: Prisma ORM with SQLite (easily adaptable to PostgreSQL)
- **✅ Testing**: Playwright E2E tests included

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI (Dialog, Dropdown Menu)
- **Animations**: Framer Motion 12.29
- **Icons**: Lucide React
- **Validation**: Zod 4.3.6

### Backend
- **Runtime**: Node.js
- **Database ORM**: Prisma 7.3
- **Database**: SQLite (via LibSQL)
- **Email**: Resend 6.8
- **Internationalization**: @formatjs/intl-localematcher

### DevOps & Testing
- **Testing**: Playwright 1.58
- **Linting**: ESLint 9
- **Deployment**: Vercel
- **Version Control**: Git

## 📋 Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hristov111/LeadGenProject.git
cd LeadGenProject
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Admin Authentication
ADMIN_PASSWORD="your_secure_password"

# Email (Optional - Resend API)
RESEND_API_KEY="your_resend_api_key"

# Analytics (Optional)
NEXT_PUBLIC_GA_ID="your_google_analytics_id"
```

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
LeadGenProject/
├── prisma/
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
├── src/
│   ├── app/
│   │   ├── [lang]/         # Internationalized routes
│   │   │   ├── admin/      # Admin dashboard & lead management
│   │   │   ├── quiz/       # Interactive questionnaire
│   │   │   ├── results/    # Results display page
│   │   │   ├── lead/       # Lead submission form
│   │   │   └── ...         # Other pages
│   │   ├── api/            # API routes
│   │   │   ├── leads/      # Lead CRUD operations
│   │   │   ├── admin/      # Admin authentication
│   │   │   └── events/     # Analytics events
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   └── layout/        # Layout components
│   ├── dictionaries/       # i18n translation files
│   ├── lib/
│   │   ├── prisma.ts      # Prisma client
│   │   ├── schemas.ts     # Zod validation schemas
│   │   ├── auth.ts        # Authentication helpers
│   │   └── analytics.tsx  # Analytics utilities
│   ├── i18n-config.ts     # i18n configuration
│   └── middleware.ts       # Next.js middleware
├── tests/                  # E2E tests
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Public Endpoints

#### `POST /api/leads`
Submit a new lead.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "0888123456",
  "email": "john@example.com",
  "city": "Sofia",
  "serviceType": "internet",
  "usageIntent": "streaming",
  "budget": "50-100",
  "timeline": "now",
  "consent": true,
  "notes": "Additional information",
  "source": "google",
  "campaign": "spring_2024"
}
```

**Response:**
```json
{
  "success": true,
  "leadId": "uuid-here",
  "isDuplicate": false
}
```

#### `POST /api/contact`
Submit contact form inquiry.

### Admin Endpoints (Requires Authentication)

#### `GET /api/leads`
Fetch all leads with metadata.

#### `PATCH /api/leads`
Update lead status and information.

**Request Body:**
```json
{
  "id": "lead-uuid",
  "status": "contacted",
  "notes": "Follow up notes",
  "pipelineStatus": "qualified"
}
```

#### `POST /api/admin/login`
Admin authentication.

#### `POST /api/admin/logout`
Admin session termination.

## 🧪 Testing

### Run E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run tests
npm run test
# or
npx playwright test

# Run tests in UI mode
npx playwright test --ui

# Run specific test
npx playwright test tests/lead_tracking.spec.ts
```

### Test Coverage

- ✅ Lead submission flow
- ✅ Duplicate detection
- ✅ Admin authentication
- ✅ Lead management operations

## 📊 Database Schema

The application uses the following main model:

```prisma
model Lead {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  name        String
  phone       String
  email       String?
  city        String
  serviceType String
  usageIntent String
  budget      String?
  timeline    String
  consent     Boolean
  status      String   @default("new")
  notes       String?
  
  // Tracking fields
  source      String?
  campaign    String?
  isDuplicate Boolean  @default(false)
  qualityScore Int     @default(0)
  
  // Admin fields
  assignedTo      String?
  pipelineStatus  String @default("new")
  // ... more fields
}
```

## 🌐 Internationalization

The platform supports 5 languages:

- 🇬🇧 English (`en`)
- 🇧🇬 Bulgarian (`bg`)
- 🇩🇪 German (`de`)
- 🇷🇺 Russian (`ru`)
- 🇹🇷 Turkish (`tr`)

Translation files are located in `src/dictionaries/`.

### Adding a New Language

1. Create a new JSON file in `src/dictionaries/` (e.g., `fr.json`)
2. Add the locale to `src/i18n-config.ts`:
```typescript
export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'bg', 'de', 'ru', 'tr', 'fr'],
}
```
3. Copy structure from an existing dictionary file and translate

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Configure environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hristov111/LeadGenProject)

### Environment Variables for Production

Ensure these are set in your deployment platform:

- `DATABASE_URL`: Production database connection string
- `ADMIN_PASSWORD`: Secure admin password
- `RESEND_API_KEY`: Email service API key (optional)
- `NEXT_PUBLIC_GA_ID`: Google Analytics ID (optional)

### Database Migration

For production, consider using:
- **PostgreSQL** (recommended for scale)
- **PlanetScale** (MySQL)
- **Turso** (SQLite at edge)

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 🔧 Configuration

### Admin Access

Default admin route: `/en/admin/login`

Set `ADMIN_PASSWORD` in `.env` file for authentication.

### Rate Limiting

Default settings (in `src/app/api/leads/route.ts`):
- **Window**: 10 minutes
- **Max submissions per IP**: 5

Adjust as needed for your use case.

### Analytics

Events tracked:
- `page_view` - Page navigation
- `quiz_start` - Quiz initiation
- `quiz_step_view` - Quiz step progression
- `quiz_complete` - Quiz completion
- `lead_submit` - Lead form submission

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio (DB GUI)
npx prisma migrate   # Run migrations
npx prisma generate  # Generate Prisma Client
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Prisma](https://www.prisma.io/) - Database ORM
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Vercel](https://vercel.com/) - Hosting platform

## 📧 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for connecting people with the best telecom services**
