# CometX - Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Docker Deployment](#docker-deployment)
3. [Manual Deployment](#manual-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Environment Configuration](#environment-configuration)
6. [SSL/TLS Setup](#ssltls-setup)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker 20.x or higher (for containerized deployment)
- Node.js 20.x or higher (for manual deployment)
- A server or hosting platform
- (Optional) Domain name
- (Optional) SSL certificate

## Docker Deployment

### Build Docker Image

```bash
# Clone the repository
git clone https://github.com/ALKHOARZMI/cometx.git
cd cometx

# Build the Docker image
docker build -t cometx:latest .
```

### Run Container

```bash
# Run on port 80
docker run -d -p 80:80 --name cometx cometx:latest

# Or specify a custom port
docker run -d -p 8080:80 --name cometx cometx:latest
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  cometx:
    build: .
    container_name: cometx
    ports:
      - "80:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Run with Docker Compose:

```bash
docker-compose up -d
```

## Manual Deployment

### 1. Build the Application

```bash
npm install
npm run build
```

### 2. Static File Hosting

The `dist/` folder contains all static files. Deploy to any static hosting service:

#### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/cometx/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Apache

Create `.htaccess` in the `dist/` folder:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

## Cloud Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### GitHub Pages

Add to `package.json`:

```json
{
  "homepage": "https://yourusername.github.io/cometx",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Install gh-pages:

```bash
npm install --save-dev gh-pages
npm run deploy
```

### AWS S3 + CloudFront

1. Build the application
2. Upload `dist/` contents to S3 bucket
3. Configure bucket for static website hosting
4. Create CloudFront distribution
5. Set error pages to redirect to `index.html`

## Environment Configuration

### Build-time Variables

Create `.env` file:

```env
VITE_APP_NAME=CometX
VITE_API_URL=https://api.example.com
```

Access in code:

```typescript
const appName = import.meta.env.VITE_APP_NAME;
```

### Production Optimizations

In `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'editor-vendor': ['@monaco-editor/react'],
        },
      },
    },
  },
});
```

## SSL/TLS Setup

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (cron job)
sudo certbot renew --dry-run
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /path/to/cometx/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring

### Docker Health Checks

The Dockerfile includes health checks. Monitor with:

```bash
docker ps
docker inspect --format='{{.State.Health.Status}}' cometx
```

### Application Monitoring

Consider integrating:
- **Sentry** for error tracking
- **Google Analytics** for usage analytics
- **Prometheus** for metrics
- **Grafana** for visualization

### Nginx Access Logs

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs cometx

# Inspect container
docker inspect cometx

# Restart container
docker restart cometx
```

### Permission Issues

```bash
# Fix permissions
chmod -R 755 dist/
chown -R www-data:www-data dist/
```

### Build Failures

```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 Errors on Refresh

Ensure your server is configured to redirect all requests to `index.html` for client-side routing.

### Performance Issues

- Enable gzip/brotli compression
- Set proper cache headers
- Use CDN for static assets
- Optimize images
- Enable HTTP/2

## Backup Strategy

### Regular Backups

```bash
# Backup Docker volume
docker run --rm --volumes-from cometx -v $(pwd):/backup ubuntu tar czf /backup/cometx-backup.tar.gz /usr/share/nginx/html

# Backup configuration
tar czf config-backup.tar.gz nginx.conf Dockerfile docker-compose.yml
```

### Automated Backups

Set up cron job:

```bash
0 2 * * * /path/to/backup-script.sh
```

## Security Best Practices

1. **Keep dependencies updated**: `npm audit` regularly
2. **Use HTTPS**: Always serve over SSL/TLS
3. **Set security headers**: CSP, HSTS, X-Frame-Options
4. **Regular updates**: Keep Docker images and OS updated
5. **Monitor logs**: Check for suspicious activity
6. **Firewall**: Configure UFW or similar
7. **Rate limiting**: Prevent DDoS attacks

## Scaling

### Horizontal Scaling

Use load balancer with multiple instances:

```yaml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    depends_on:
      - cometx1
      - cometx2

  cometx1:
    build: .
    
  cometx2:
    build: .
```

### CDN Integration

Use CDN for static assets:
- Cloudflare
- AWS CloudFront
- Fastly
- Azure CDN

## License

MIT License - See [LICENSE](../LICENSE)
