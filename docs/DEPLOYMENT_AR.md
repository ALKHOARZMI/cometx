# CometX - دليل النشر

## جدول المحتويات

1. [المتطلبات الأساسية](#المتطلبات-الأساسية)
2. [النشر باستخدام Docker](#النشر-باستخدام-docker)
3. [النشر اليدوي](#النشر-اليدوي)
4. [النشر السحابي](#النشر-السحابي)
5. [تكوين البيئة](#تكوين-البيئة)
6. [إعداد SSL/TLS](#إعداد-ssltls)
7. [المراقبة](#المراقبة)
8. [استكشاف الأخطاء وإصلاحها](#استكشاف-الأخطاء-وإصلاحها)

## المتطلبات الأساسية

- Docker 20.x أو أحدث (للنشر بالحاويات)
- Node.js 20.x أو أحدث (للنشر اليدوي)
- خادم أو منصة استضافة
- (اختياري) اسم نطاق
- (اختياري) شهادة SSL

## النشر باستخدام Docker

### بناء صورة Docker

```bash
# استنساخ المستودع
git clone https://github.com/ALKHOARZMI/cometx.git
cd cometx

# بناء صورة Docker
docker build -t cometx:latest .
```

### تشغيل الحاوية

```bash
# التشغيل على المنفذ 80
docker run -d -p 80:80 --name cometx cometx:latest

# أو تحديد منفذ مخصص
docker run -d -p 8080:80 --name cometx cometx:latest
```

### Docker Compose

أنشئ ملف `docker-compose.yml`:

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

التشغيل باستخدام Docker Compose:

```bash
docker-compose up -d
```

## النشر اليدوي

### 1. بناء التطبيق

```bash
npm install
npm run build
```

### 2. استضافة الملفات الثابتة

يحتوي مجلد `dist/` على جميع الملفات الثابتة. انشر إلى أي خدمة استضافة ثابتة:

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

    # تفعيل ضغط gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Apache

أنشئ `.htaccess` في مجلد `dist/`:

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

## النشر السحابي

### Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel --prod
```

### Netlify

```bash
# تثبيت Netlify CLI
npm i -g netlify-cli

# النشر
netlify deploy --prod --dir=dist
```

### GitHub Pages

أضف إلى `package.json`:

```json
{
  "homepage": "https://yourusername.github.io/cometx",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

تثبيت gh-pages:

```bash
npm install --save-dev gh-pages
npm run deploy
```

### AWS S3 + CloudFront

1. بناء التطبيق
2. رفع محتويات `dist/` إلى حاوية S3
3. تكوين الحاوية لاستضافة موقع ويب ثابت
4. إنشاء توزيع CloudFront
5. تعيين صفحات الخطأ لإعادة التوجيه إلى `index.html`

## تكوين البيئة

### متغيرات وقت البناء

أنشئ ملف `.env`:

```env
VITE_APP_NAME=CometX
VITE_API_URL=https://api.example.com
```

الوصول في الكود:

```typescript
const appName = import.meta.env.VITE_APP_NAME;
```

### تحسينات الإنتاج

في `vite.config.ts`:

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

## إعداد SSL/TLS

### Let's Encrypt مع Certbot

```bash
# تثبيت Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# الحصول على الشهادة
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# التجديد التلقائي (مهمة cron)
sudo certbot renew --dry-run
```

### تكوين Nginx SSL

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

## المراقبة

### فحوصات صحة Docker

يتضمن Dockerfile فحوصات صحية. المراقبة مع:

```bash
docker ps
docker inspect --format='{{.State.Health.Status}}' cometx
```

### مراقبة التطبيق

فكر في التكامل مع:
- **Sentry** لتتبع الأخطاء
- **Google Analytics** لتحليلات الاستخدام
- **Prometheus** للمقاييس
- **Grafana** للتصور

### سجلات الوصول Nginx

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## استكشاف الأخطاء وإصلاحها

### لن تبدأ الحاوية

```bash
# التحقق من السجلات
docker logs cometx

# فحص الحاوية
docker inspect cometx

# إعادة تشغيل الحاوية
docker restart cometx
```

### مشاكل الأذونات

```bash
# إصلاح الأذونات
chmod -R 755 dist/
chown -R www-data:www-data dist/
```

### فشل البناء

```bash
# مسح ذاكرة التخزين المؤقت
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

### أخطاء 404 عند التحديث

تأكد من تكوين الخادم الخاص بك لإعادة توجيه جميع الطلبات إلى `index.html` للتوجيه من جانب العميل.

### مشاكل الأداء

- تفعيل ضغط gzip/brotli
- تعيين رؤوس ذاكرة التخزين المؤقت المناسبة
- استخدام CDN للأصول الثابتة
- تحسين الصور
- تفعيل HTTP/2

## استراتيجية النسخ الاحتياطي

### النسخ الاحتياطية المنتظمة

```bash
# نسخ احتياطي لحجم Docker
docker run --rm --volumes-from cometx -v $(pwd):/backup ubuntu tar czf /backup/cometx-backup.tar.gz /usr/share/nginx/html

# نسخ احتياطي للتكوين
tar czf config-backup.tar.gz nginx.conf Dockerfile docker-compose.yml
```

### النسخ الاحتياطية التلقائية

إعداد مهمة cron:

```bash
0 2 * * * /path/to/backup-script.sh
```

## أفضل ممارسات الأمان

1. **حافظ على التبعيات محدثة**: `npm audit` بانتظام
2. **استخدم HTTPS**: قدم دائمًا عبر SSL/TLS
3. **تعيين رؤوس الأمان**: CSP، HSTS، X-Frame-Options
4. **تحديثات منتظمة**: حافظ على تحديث صور Docker ونظام التشغيل
5. **مراقبة السجلات**: تحقق من النشاط المشبوه
6. **جدار الحماية**: تكوين UFW أو ما شابه
7. **تحديد المعدل**: منع هجمات DDoS

## التوسع

### التوسع الأفقي

استخدام موازن التحميل مع عدة نسخ:

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

### تكامل CDN

استخدام CDN للأصول الثابتة:
- Cloudflare
- AWS CloudFront
- Fastly
- Azure CDN

## الترخيص

ترخيص MIT - راجع [LICENSE](../LICENSE)
