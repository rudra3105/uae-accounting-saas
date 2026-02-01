# Installation & Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup

Create a PostgreSQL database:
```sql
CREATE DATABASE uae_accounting_saas;
```

### 3. Environment Variables

Update `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/uae_accounting_saas?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-key"
```

Generate secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Database Migrations

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed initial data
npm run prisma:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 6. Login with Default Credentials

- **Email:** admin@albaraka.ae
- **Password:** admin@123

---

## Production Deployment

### Build
```bash
npm run build
npm run start
```

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@prod-db:5432/uae_accounting_saas?schema=public"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="secure-random-secret"
```

### Database Backups
```bash
# PostgreSQL backup
pg_dump -U user -h localhost uae_accounting_saas > backup.sql

# Restore
psql -U user -h localhost uae_accounting_saas < backup.sql
```

---

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Database connection error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env.local
- Ensure database exists

### Prisma migration conflicts
```bash
npx prisma migrate resolve --rolled-back
npx prisma migrate dev
```

---

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm run prisma:seed` | Seed initial data |
| `npm run lint` | Run ESLint |
