# Deployment Guide

This guide covers deploying the Nithub Space Management System to production environments, including setup, configuration, and best practices.

## 📋 Table of Contents

- [Deployment Options](#deployment-options)
- [Vercel Deployment](#vercel-deployment)
- [Self-Hosted Deployment](#self-hosted-deployment)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [CDN and Assets](#cdn-and-assets)
- [Monitoring and Logging](#monitoring-and-logging)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)
- [Backup and Recovery](#backup-and-recovery)

## 🚀 Deployment Options

### Recommended Platforms

1. **Vercel** (Recommended)
   - Optimized for Next.js applications
   - Automatic deployments from Git
   - Built-in CDN and edge functions
   - Serverless architecture

2. **Netlify**
   - Static site hosting with serverless functions
   - Continuous deployment
   - Form handling and identity management

3. **AWS**
   - Full control over infrastructure
   - Scalable and enterprise-ready
   - Multiple deployment options (ECS, Lambda, EC2)

4. **Google Cloud Platform**
   - Cloud Run for containerized deployments
   - Firebase hosting for static assets
   - Integrated with Google services

5. **Self-Hosted**
   - Complete control over environment
   - Custom infrastructure requirements
   - On-premises or private cloud

## 🌐 Vercel Deployment

### Quick Deployment

1. **Connect Repository**
   \`\`\`bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Deploy from project directory
   vercel
   \`\`\`

2. **Automatic Deployment**
   - Connect GitHub repository to Vercel
   - Automatic deployments on push to main branch
   - Preview deployments for pull requests

### Vercel Configuration

Create `vercel.json` in project root:

\`\`\`json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1", "sfo1"],
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/admin",
      "destination": "/admin/login",
      "permanent": false
    }
  ],
  "rewrites": [
    {
      "source": "/api/v1/:path*",
      "destination": "/api/:path*"
    }
  ]
}
\`\`\`

### Environment Variables in Vercel

\`\`\`bash
# Set environment variables via CLI
vercel env add NEXT_PUBLIC_API_URL production
vercel env add JWT_SECRET production
vercel env add DATABASE_URL production

# Or use Vercel dashboard
# Project Settings > Environment Variables
\`\`\`

### Custom Domains

\`\`\`bash
# Add custom domain
vercel domains add yourdomain.com

# Configure DNS
# Add CNAME record: www -> cname.vercel-dns.com
# Add A record: @ -> 76.76.19.61
\`\`\`

## 🏗️ Self-Hosted Deployment

### Docker Deployment

1. **Create Dockerfile**
   \`\`\`dockerfile
   # Dockerfile
   FROM node:18-alpine AS base

   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app

   COPY package.json package-lock.json* ./
   RUN npm ci --only=production

   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .

   ENV NEXT_TELEMETRY_DISABLED 1
   RUN npm run build

   # Production image, copy all the files and run next
   FROM base AS runner
   WORKDIR /app

   ENV NODE_ENV production
   ENV NEXT_TELEMETRY_DISABLED 1

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs

   EXPOSE 3000

   ENV PORT 3000
   ENV HOSTNAME "0.0.0.0"

   CMD ["node", "server.js"]
   \`\`\`

2. **Docker Compose Setup**
   \`\`\`yaml
   # docker-compose.yml
   version: '3.8'

   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - DATABASE_URL=${DATABASE_URL}
         - JWT_SECRET=${JWT_SECRET}
         - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
       depends_on:
         - postgres
         - redis
       restart: unless-stopped

     postgres:
       image: postgres:15-alpine
       environment:
         - POSTGRES_DB=nithub_db
         - POSTGRES_USER=nithub_user
         - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
       volumes:
         - postgres_data:/var/lib/postgresql/data
         - ./init.sql:/docker-entrypoint-initdb.d/init.sql
       ports:
         - "5432:5432"
       restart: unless-stopped

     redis:
       image: redis:7-alpine
       ports:
         - "6379:6379"
       volumes:
         - redis_data:/data
       restart: unless-stopped

     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
         - ./ssl:/etc/nginx/ssl
       depends_on:
         - app
       restart: unless-stopped

   volumes:
     postgres_data:
     redis_data:
   \`\`\`

3. **Nginx Configuration**
   ```nginx
   # nginx.conf
   events {
       worker_connections 1024;
   }

   http {
       upstream app {
           server app:3000;
       }

       server {
           listen 80;
           server_name yourdomain.com www.yourdomain.com;
           return 301 https://$server_name$request_uri;
       }

       server {
           listen 443 ssl http2;
           server_name yourdomain.com www.yourdomain.com;

           ssl_certificate /etc/nginx/ssl/cert.pem;
           ssl_certificate_key /etc/nginx/ssl/key.pem;

           ssl_protocols TLSv1.2 TLSv1.3;
           ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
           ssl_prefer_server_ciphers off;

           location / {
               proxy_pass http://app;
               proxy_http_version 1.1;
               proxy_set_header Upgrade $http_upgrade;
               proxy_set_header Connection 'upgrade';
               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Proto $scheme;
               proxy_cache_bypass $http_upgrade;
           }

           # Static assets caching
           location /_next/static/ {
               proxy_pass http://app;
               add_header Cache-Control "public, max-age=31536000, immutable";
           }

           # Security headers
           add_header X-Frame-Options "DENY" always;
           add_header X-Content-Type-Options "nosniff" always;
           add_header Referrer-Policy "strict-origin-when-cross-origin" always;
           add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';" always;
       }
   }
   \`\`\`

### Kubernetes Deployment

1. **Deployment Configuration**
   \`\`\`yaml
   # k8s/deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: nithub-app
     labels:
       app: nithub-app
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: nithub-app
     template:
       metadata:
         labels:
           app: nithub-app
       spec:
         containers:
         - name: nithub-app
           image: nithub/space-management:latest
           ports:
           - containerPort: 3000
           env:
           - name: NODE_ENV
             value: "production"
           - name: DATABASE_URL
             valueFrom:
               secretKeyRef:
                 name: nithub-secrets
                 key: database-url
           - name: JWT_SECRET
             valueFrom:
               secretKeyRef:
                 name: nithub-secrets
                 key: jwt-secret
           resources:
             requests:
               memory: "256Mi"
               cpu: "250m"
             limits:
               memory: "512Mi"
               cpu: "500m"
           livenessProbe:
             httpGet:
               path: /api/health
               port: 3000
             initialDelaySeconds: 30
             periodSeconds: 10
           readinessProbe:
             httpGet:
               path: /api/ready
               port: 3000
             initialDelaySeconds: 5
             periodSeconds: 5
   \`\`\`

2. **Service Configuration**
   \`\`\`yaml
   # k8s/service.yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: nithub-service
   spec:
     selector:
       app: nithub-app
     ports:
     - protocol: TCP
       port: 80
       targetPort: 3000
     type: LoadBalancer
   \`\`\`

3. **Ingress Configuration**
   \`\`\`yaml
   # k8s/ingress.yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: nithub-ingress
     annotations:
       kubernetes.io/ingress.class: nginx
       cert-manager.io/cluster-issuer: letsencrypt-prod
       nginx.ingress.kubernetes.io/ssl-redirect: "true"
   spec:
     tls:
     - hosts:
       - yourdomain.com
       secretName: nithub-tls
     rules:
     - host: yourdomain.com
       http:
         paths:
         - path: /
           pathType: Prefix
           backend:
             service:
               name: nithub-service
               port:
                 number: 80
   \`\`\`

## ⚙️ Environment Configuration

### Production Environment Variables

\`\`\`bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# Database
DATABASE_URL=postgresql://user:password@host:5432/nithub_prod
REDIS_URL=redis://user:password@host:6379

# Email Service
SENDGRID_API_KEY=SG.your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
SUPPORT_EMAIL=support@yourdomain.com

# Payment Gateways
PAYSTACK_SECRET_KEY=sk_live_your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=pk_live_your-paystack-public-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLIC_KEY=pk_live_your-stripe-public-key

# Calendar Integration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OUTLOOK_CLIENT_ID=your-outlook-client-id
OUTLOOK_CLIENT_SECRET=your-outlook-client-secret

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=nithub-assets
AWS_REGION=us-east-1

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-newrelic-license-key
LOG_LEVEL=info

# Security
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Features
ENABLE_ANALYTICS=true
ENABLE_NOTIFICATIONS=true
ENABLE_WEBSOCKETS=true
\`\`\`

### Environment Validation

\`\`\`typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  DATABASE_URL: z.string().url(),
  SENDGRID_API_KEY: z.string().startsWith('SG.'),
  PAYSTACK_SECRET_KEY: z.string().startsWith('sk_'),
  // ... other environment variables
});

export const env = envSchema.parse(process.env);
\`\`\`

## 🗄️ Database Setup

### PostgreSQL Setup

1. **Database Creation**
   \`\`\`sql
   -- Create database
   CREATE DATABASE nithub_prod;
   
   -- Create user
   CREATE USER nithub_user WITH PASSWORD 'secure_password';
   
   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE nithub_prod TO nithub_user;
   
   -- Connect to database
   \c nithub_prod;
   
   -- Create extensions
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pg_trgm";
   \`\`\`

2. **Migration Scripts**
   \`\`\`bash
   # Run database migrations
   npm run db:migrate

   # Seed initial data
   npm run db:seed

   # Backup database
   pg_dump -h localhost -U nithub_user nithub_prod > backup.sql

   # Restore database
   psql -h localhost -U nithub_user nithub_prod &lt; backup.sql
   \`\`\`

3. **Connection Pooling**
   \`\`\`typescript
   // lib/db.ts
   import { Pool } from 'pg';

   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
     max: 20,
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   });

   export { pool };
   \`\`\`

### Redis Setup

\`\`\`bash
# Redis configuration
# /etc/redis/redis.conf

# Security
requirepass your-redis-password
bind 127.0.0.1

# Memory management
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000

# Logging
loglevel notice
logfile /var/log/redis/redis-server.log
\`\`\`

## 📦 CDN and Assets

### Static Asset Optimization

1. **Next.js Image Optimization**
   \`\`\`typescript
   // next.config.mjs
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     images: {
       domains: ['yourdomain.com', 's3.amazonaws.com'],
       formats: ['image/webp', 'image/avif'],
       deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
       imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
     },
     experimental: {
       optimizeCss: true,
     },
   };

   export default nextConfig;
   \`\`\`

2. **AWS CloudFront Setup**
   \`\`\`json
   {
     "DistributionConfig": {
       "CallerReference": "nithub-cdn-2024",
       "Origins": {
         "Quantity": 1,
         "Items": [
           {
             "Id": "nithub-origin",
             "DomainName": "yourdomain.com",
             "CustomOriginConfig": {
               "HTTPPort": 443,
               "HTTPSPort": 443,
               "OriginProtocolPolicy": "https-only"
             }
           }
         ]
       },
       "DefaultCacheBehavior": {
         "TargetOriginId": "nithub-origin",
         "ViewerProtocolPolicy": "redirect-to-https",
         "CachePolicyId": "managed-caching-optimized",
         "Compress": true
       },
       "CacheBehaviors": {
         "Quantity": 2,
         "Items": [
           {
             "PathPattern": "/_next/static/*",
             "TargetOriginId": "nithub-origin",
             "ViewerProtocolPolicy": "https-only",
             "CachePolicyId": "managed-caching-optimized-for-uncompressed-objects",
             "TTL": 31536000
           },
           {
             "PathPattern": "/api/*",
             "TargetOriginId": "nithub-origin",
             "ViewerProtocolPolicy": "https-only",
             "CachePolicyId": "managed-caching-disabled"
           }
         ]
       },
       "Enabled": true,
       "PriceClass": "PriceClass_100"
     }
   }
   \`\`\`

### File Upload Configuration

\`\`\`typescript
// lib/upload.ts
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadFile = async (file: File, key: string) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read',
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};
\`\`\`

## 📊 Monitoring and Logging

### Application Monitoring

1. **Sentry Integration**
   \`\`\`typescript
   // sentry.client.config.ts
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
     debug: false,
     integrations: [
       new Sentry.BrowserTracing({
         tracePropagationTargets: ['localhost', /^https:\/\/yourdomain\.com/],
       }),
     ],
   });
   \`\`\`

2. **Health Check Endpoints**
   \`\`\`typescript
   // app/api/health/route.ts
   import { NextResponse } from 'next/server';
   import { pool } from '@/lib/db';

   export async function GET() {
     try {
       // Check database connection
       await pool.query('SELECT 1');
       
       // Check Redis connection
       // await redis.ping();
       
       return NextResponse.json({
         status: 'healthy',
         timestamp: new Date().toISOString(),
         uptime: process.uptime(),
         memory: process.memoryUsage(),
       });
     } catch (error) {
       return NextResponse.json(
         { status: 'unhealthy', error: error.message },
         { status: 503 }
       );
     }
   }
   \`\`\`

3. **Performance Monitoring**
   \`\`\`typescript
   // lib/monitoring.ts
   import { performance } from 'perf_hooks';

   export const measurePerformance = (name: string) => {
     const start = performance.now();
     
     return {
       end: () => {
         const duration = performance.now() - start;
         console.log(`${name} took ${duration.toFixed(2)}ms`);
         
         // Send to monitoring service
         if (process.env.NODE_ENV === 'production') {
           // Send metrics to New Relic, DataDog, etc.
         }
         
         return duration;
       },
     };
   };
   \`\`\`

### Logging Configuration

\`\`\`typescript
// lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'nithub-space-management' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export { logger };
\`\`\`

## 🔒 Security Considerations

### Security Headers

\`\`\`typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
\`\`\`

### Rate Limiting

\`\`\`typescript
// lib/rate-limit.ts
import { NextRequest } from 'next/server';

const rateLimitMap = new Map();

export function rateLimit(limit: number = 10, windowMs: number = 60000) {
  return (request: NextRequest) => {
    const ip = request.ip || 'anonymous';
    const now = Date.now();
    const windowStart = now - windowMs;

    const requests = rateLimitMap.get(ip) || [];
    const validRequests = requests.filter((time: number) => time > windowStart);

    if (validRequests.length >= limit) {
      return new Response('Too Many Requests', { status: 429 });
    }

    validRequests.push(now);
    rateLimitMap.set(ip, validRequests);

    return null;
  };
}
\`\`\`

### SSL/TLS Configuration

\`\`\`bash
# Generate SSL certificate with Let's Encrypt
certbot certonly --webroot -w /var/www/html -d yourdomain.com -d www.yourdomain.com

# Auto-renewal cron job
0 12 * * * /usr/bin/certbot renew --quiet
\`\`\`

## ⚡ Performance Optimization

### Build Optimization

\`\`\`typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components/ui'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }

    return config;
  },
};

export default nextConfig;
\`\`\`

### Caching Strategy

\`\`\`typescript
// lib/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },
};
\`\`\`

## 💾 Backup and Recovery

### Database Backup

\`\`\`bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="nithub_prod"
DB_USER="nithub_user"

# Create backup
pg_dump -h localhost -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://nithub-backups/database/

# Clean old local backups (keep last 7 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

# Clean old S3 backups (keep last 30 days)
aws s3 ls s3://nithub-backups/database/ | while read -r line; do
  createDate=$(echo $line | awk '{print $1" "$2}')
  createDate=$(date -d "$createDate" +%s)
  olderThan=$(date -d "30 days ago" +%s)
  if [[ $createDate -lt $olderThan ]]; then
    fileName=$(echo $line | awk '{print $4}')
    if [[ $fileName != "" ]]; then
      aws s3 rm s3://nithub-backups/database/$fileName
    fi
  fi
done
\`\`\`

### Disaster Recovery Plan

1. **Recovery Time Objective (RTO)**: 4 hours
2. **Recovery Point Objective (RPO)**: 1 hour
3. **Backup Frequency**: Every 6 hours
4. **Backup Retention**: 30 days
5. **Testing**: Monthly disaster recovery drills

### Monitoring Alerts

\`\`\`yaml
# alerts.yml
groups:
- name: nithub-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: High error rate detected

  - alert: DatabaseConnectionFailure
    expr: up{job="postgres"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: Database connection failure

  - alert: HighMemoryUsage
    expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: High memory usage detected
\`\`\`

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Code review completed
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Performance testing done
- [ ] Database migrations ready
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Documentation updated

### Deployment

- [ ] Deploy to staging environment
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Verify health checks
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify integrations working

### Post-Deployment

- [ ] Monitor application for 24 hours
- [ ] Check error logs
- [ ] Verify backup completion
- [ ] Update status page
- [ ] Notify stakeholders
- [ ] Document any issues
- [ ] Plan next deployment

---

This deployment guide provides comprehensive instructions for deploying the Nithub Space Management System to production. Choose the deployment option that best fits your infrastructure requirements and follow the security and performance best practices outlined above.
