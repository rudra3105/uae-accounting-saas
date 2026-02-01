# Environment Configuration Guide

## .env.local (Development)

```env
# DATABASE CONNECTION
DATABASE_URL="postgresql://user:password@localhost:5432/uae_accounting_saas?schema=public"

# NEXTAUTH CONFIGURATION
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# API ENDPOINTS
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# APP SETTINGS
NODE_ENV="development"

# EMAIL SERVICE (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@yourdomain.com"

# PAYMENT GATEWAY (Optional)
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# PDF GENERATION
PDF_WATERMARK="DRAFT"

# LOGGING
LOG_LEVEL="debug"

# THIRD-PARTY INTEGRATIONS
GOOGLE_ANALYTICS_ID="UA-XXXXXXXXX-X"
```

## .env.production (Production)

```env
# DATABASE CONNECTION
DATABASE_URL="postgresql://user:secure-password@prod-db.aws.com:5432/uae_accounting_saas?schema=public&sslmode=require"

# NEXTAUTH CONFIGURATION
NEXTAUTH_URL="https://accounting.yourdomain.com"
NEXTAUTH_SECRET="[generate-secure-random-secret]"

# API ENDPOINTS
NEXT_PUBLIC_API_URL="https://accounting.yourdomain.com/api"

# APP SETTINGS
NODE_ENV="production"

# EMAIL SERVICE
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="[your-sendgrid-key]"
SMTP_FROM="noreply@yourdomain.com"

# PAYMENT GATEWAY
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."

# PDF GENERATION
PDF_WATERMARK=""

# LOGGING
LOG_LEVEL="error"

# THIRD-PARTY INTEGRATIONS
GOOGLE_ANALYTICS_ID="UA-XXXXXXXXX-X"

# SECURITY
SECURE_COOKIES="true"
CSRF_ENABLED="true"
RATE_LIMIT_ENABLED="true"
```

## Database Connection Strings

### Local Development
```
postgresql://postgres:password@localhost:5432/uae_accounting_saas
```

### Docker Compose
```
postgresql://user:password@db:5432/uae_accounting_saas
```

### AWS RDS
```
postgresql://admin:password@accounting-db.c9akciq32.us-east-1.rds.amazonaws.com:5432/uae_accounting_saas?sslmode=require
```

### Railway.app
```
postgresql://user:password@container.railway.app:5432/railway
```

## Generating Secure Secrets

### NEXTAUTH_SECRET
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using Linux/Mac
head -c 32 /dev/urandom | base64
```

## Email Configuration

### Gmail (SMTP)
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-specific-password"
```

### SendGrid
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="SG.xxxxx..."
```

### Mailgun
```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="postmaster@sandbox.xxx.mailgun.org"
SMTP_PASS="your-mailgun-password"
```

## Payment Gateway Setup

### Stripe
```bash
# Get your keys from https://dashboard.stripe.com/apikeys

STRIPE_PUBLIC_KEY="pk_test_xxxx..."
STRIPE_SECRET_KEY="sk_test_xxxx..."

# For production
STRIPE_PUBLIC_KEY="pk_live_xxxx..."
STRIPE_SECRET_KEY="sk_live_xxxx..."
```

## Local Development with Docker

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: uae_user
      POSTGRES_PASSWORD: secure_password_123
      POSTGRES_DB: uae_accounting_saas
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://uae_user:secure_password_123@postgres:5432/uae_accounting_saas
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: dev-secret-change-in-production
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## Vercel Deployment

### Environment Variables in Vercel Console
1. Go to Project Settings → Environment Variables
2. Add variables for each environment (Preview, Production, Development)
3. Redeploy after adding variables

**Recommended variables:**
```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=[secure-random-secret]
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

## Validation Checklist

Before deploying to production:

- [ ] DATABASE_URL points to production database
- [ ] NEXTAUTH_URL is correct domain
- [ ] NEXTAUTH_SECRET is secure and unique
- [ ] All required third-party keys are set
- [ ] Email configuration is tested
- [ ] Payment gateway credentials are correct
- [ ] Logging is configured for production
- [ ] Security headers are enabled
- [ ] CORS is properly configured
- [ ] Database backups are scheduled

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432

Solution:
- Verify PostgreSQL is running
- Check DATABASE_URL syntax
- Ensure database name exists
```

### NEXTAUTH_SECRET Not Set
```
Error: NEXTAUTH_SECRET is required in production

Solution:
- Generate secure secret: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
- Set in .env.local for development
- Set in Vercel console for production
```

### SSL Connection Error
```
Error: SSL: certificate verify failed

Solution:
- Add ?sslmode=require to DATABASE_URL
- Or add &sslmode=disable for development (NOT for production)
```

---

## Best Practices

1. **Never commit `.env.local` to git**
   - Add to `.gitignore`
   - Use `.env.example` for reference

2. **Use strong secrets**
   - Minimum 32 characters
   - Mix of alphanumeric and special characters
   - Generate cryptographically secure secrets

3. **Rotate secrets regularly**
   - Change NEXTAUTH_SECRET periodically
   - Update database passwords
   - Renew API keys

4. **Environment-specific values**
   - Use different databases for dev/prod
   - Different email services
   - Different payment accounts

5. **Monitor environment changes**
   - Log who changes what
   - Review access patterns
   - Alert on suspicious activity

---

## Quick Start Commands

### Development
```bash
# Copy template to local
cp .env.example .env.local

# Edit with your values
nano .env.local

# Install and setup
npm install
npx prisma migrate dev
npm run dev
```

### Production
```bash
# Set in Vercel console
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET

# Deploy
vercel deploy --prod
```
