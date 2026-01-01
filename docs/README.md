# CometX - Sovereign Local-First AI Platform

<div align="center">

![CometX Logo](https://img.shields.io/badge/CometX-AI_Platform-10b981?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](../LICENSE)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**[English](#english) | [العربية](#arabic)**

</div>

---

## <a name="english"></a> 🌟 Overview

**CometX** is a sovereign, local-first AI platform built with **React 18**, **TypeScript**, and **Vite**. It features a stunning dark neon emerald green UI and provides **100% on-device AI processing** using Transformers.js - ensuring complete privacy and no cloud dependencies.

### ✨ Key Features

- 🤖 **100% Local AI Processing** - All AI operations run on-device using @xenova/transformers
- 🌐 **Multilingual Support** - Full Arabic/English support with RTL toggle
- 📊 **Interactive Dashboard** - Real-time system metrics with Chart.js visualizations
- 💬 **AI Chat Interface** - Privacy-first conversational AI assistant
- 💻 **Integrated Terminal** - Full-featured xterm.js terminal emulator
- ⚡ **Monaco Code Editor** - Professional IDE experience with syntax highlighting
- 🏭 **App Factory** - Rapid application scaffolding system
- 🎛️ **Service Orchestrator** - Manage and monitor system services
- 🎨 **Dark Neon Theme** - Beautiful emerald green accent colors
- 🔒 **Privacy-First Design** - No data leaves your device

### 🛠️ Tech Stack

- **Frontend Framework**: React 18.2.0
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **AI Engine**: @xenova/transformers 2.17.2
- **Charts**: Chart.js 4.5.1 + react-chartjs-2
- **Terminal**: @xterm/xterm 6.0.0
- **Code Editor**: @monaco-editor/react 4.7.0
- **Internationalization**: i18next 25.7.3
- **Icons**: Lucide React 0.562.0

### 📁 Project Structure

```
cometx/
├── src/
│   ├── components/         # Reusable UI components
│   │   └── Layout.tsx     # Main layout with sidebar navigation
│   ├── pages/             # Application pages
│   │   ├── Dashboard.tsx  # System metrics dashboard
│   │   ├── Chat.tsx       # AI chat interface
│   │   ├── Terminal.tsx   # Integrated terminal
│   │   ├── CodeEditor.tsx # Monaco code editor
│   │   ├── AppFactory.tsx # Application factory
│   │   └── Orchestrator.tsx # Service orchestrator
│   ├── services/          # Business logic
│   │   └── AIService.ts   # AI model management
│   ├── i18n/              # Internationalization
│   │   └── config.ts      # i18n configuration
│   ├── locales/           # Translation files
│   │   ├── en.json        # English translations
│   │   └── ar.json        # Arabic translations
│   └── index.css          # Global styles
├── docs/                  # Documentation
├── .github/workflows/     # CI/CD pipelines
├── Dockerfile             # Container configuration
└── nginx.conf            # Nginx configuration
```

### 🚀 Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for detailed installation and setup instructions.

```bash
# Clone repository
git clone https://github.com/ALKHOARZMI/cometx.git
cd cometx

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 🐳 Docker Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide.

```bash
# Build Docker image
docker build -t cometx .

# Run container
docker run -p 80:80 cometx
```

### 🌍 Language Support

CometX supports bidirectional text and seamless language switching:

- **English (LTR)** - Left-to-right layout
- **Arabic (RTL)** - Right-to-left layout with full support

Toggle between languages using the language selector in the sidebar.

### 🔒 Privacy & Security

- **Zero Cloud Dependencies** - All processing happens locally
- **No Data Collection** - Your data never leaves your device
- **Open Source** - Full transparency with MIT license
- **Secure by Design** - Security-first architecture

### 📚 Documentation

- [Quick Start Guide](./QUICKSTART.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [دليل البدء السريع](./QUICKSTART_AR.md)
- [دليل النشر](./DEPLOYMENT_AR.md)

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

### 🙏 Acknowledgments

- React Team for React 18
- Hugging Face for Transformers.js
- All open-source contributors

---

## <a name="arabic"></a> 🌟 نظرة عامة

**CometX** هي منصة ذكاء اصطناعي محلية وذات سيادة مبنية باستخدام **React 18** و **TypeScript** و **Vite**. تتميز بواجهة مستخدم رائعة بألوان خضراء زمردية نيون داكنة وتوفر **معالجة ذكاء اصطناعي 100% على الجهاز** باستخدام Transformers.js - مما يضمن الخصوصية الكاملة وعدم الاعتماد على السحابة.

### ✨ الميزات الرئيسية

- 🤖 **معالجة ذكاء اصطناعي محلية 100%** - تعمل جميع عمليات الذكاء الاصطناعي على الجهاز باستخدام @xenova/transformers
- 🌐 **دعم متعدد اللغات** - دعم كامل للعربية/الإنجليزية مع إمكانية التبديل بين RTL و LTR
- 📊 **لوحة معلومات تفاعلية** - مقاييس النظام في الوقت الفعلي مع رسوم بيانية Chart.js
- 💬 **واجهة محادثة ذكية** - مساعد ذكاء اصطناعي محادثي يحافظ على الخصوصية
- 💻 **طرفية مدمجة** - محاكي طرفية xterm.js كامل الميزات
- ⚡ **محرر أكواد Monaco** - تجربة IDE احترافية مع تمييز بناء الجملة
- 🏭 **مصنع التطبيقات** - نظام سريع لإنشاء التطبيقات
- 🎛️ **منسق الخدمات** - إدارة ومراقبة خدمات النظام
- 🎨 **سمة نيون داكنة** - ألوان تمييز خضراء زمردية جميلة
- 🔒 **تصميم يعطي الأولوية للخصوصية** - لا تترك بياناتك جهازك

### 🛠️ المكدس التقني

- **إطار الواجهة الأمامية**: React 18.2.0
- **اللغة**: TypeScript 5.9
- **أداة البناء**: Vite 7.2.4
- **التصميم**: Tailwind CSS 4.1.18
- **محرك الذكاء الاصطناعي**: @xenova/transformers 2.17.2
- **الرسوم البيانية**: Chart.js 4.5.1 + react-chartjs-2
- **الطرفية**: @xterm/xterm 6.0.0
- **محرر الأكواد**: @monaco-editor/react 4.7.0
- **الترجمة**: i18next 25.7.3
- **الأيقونات**: Lucide React 0.562.0

### 📁 هيكل المشروع

```
cometx/
├── src/
│   ├── components/         # مكونات واجهة المستخدم القابلة لإعادة الاستخدام
│   │   └── Layout.tsx     # التخطيط الرئيسي مع التنقل الجانبي
│   ├── pages/             # صفحات التطبيق
│   │   ├── Dashboard.tsx  # لوحة مقاييس النظام
│   │   ├── Chat.tsx       # واجهة المحادثة الذكية
│   │   ├── Terminal.tsx   # الطرفية المدمجة
│   │   ├── CodeEditor.tsx # محرر أكواد Monaco
│   │   ├── AppFactory.tsx # مصنع التطبيقات
│   │   └── Orchestrator.tsx # منسق الخدمات
│   ├── services/          # منطق الأعمال
│   │   └── AIService.ts   # إدارة نموذج الذكاء الاصطناعي
│   ├── i18n/              # التدويل
│   │   └── config.ts      # تكوين i18n
│   ├── locales/           # ملفات الترجمة
│   │   ├── en.json        # الترجمة الإنجليزية
│   │   └── ar.json        # الترجمة العربية
│   └── index.css          # الأنماط العامة
├── docs/                  # التوثيق
├── .github/workflows/     # خطوط CI/CD
├── Dockerfile             # تكوين الحاوية
└── nginx.conf            # تكوين Nginx
```

### 🚀 البدء السريع

راجع [QUICKSTART_AR.md](./QUICKSTART_AR.md) للحصول على تعليمات التثبيت والإعداد التفصيلية.

```bash
# استنساخ المستودع
git clone https://github.com/ALKHOARZMI/cometx.git
cd cometx

# تثبيت التبعيات
npm install

# بدء خادم التطوير
npm run dev

# البناء للإنتاج
npm run build
```

### 🐳 نشر Docker

راجع [DEPLOYMENT_AR.md](./DEPLOYMENT_AR.md) للحصول على دليل النشر الشامل.

```bash
# بناء صورة Docker
docker build -t cometx .

# تشغيل الحاوية
docker run -p 80:80 cometx
```

### 🌍 دعم اللغات

يدعم CometX النص ثنائي الاتجاه والتبديل السلس بين اللغات:

- **الإنجليزية (LTR)** - تخطيط من اليسار إلى اليمين
- **العربية (RTL)** - تخطيط من اليمين إلى اليسار مع دعم كامل

التبديل بين اللغات باستخدام محدد اللغة في الشريط الجانبي.

### 🔒 الخصوصية والأمان

- **صفر اعتماد على السحابة** - تتم جميع المعالجات محليًا
- **لا يوجد جمع للبيانات** - بياناتك لا تغادر جهازك أبدًا
- **مفتوح المصدر** - شفافية كاملة مع ترخيص MIT
- **آمن بالتصميم** - بنية تعطي الأمان الأولوية

### 📚 التوثيق

- [دليل البدء السريع](./QUICKSTART.md)
- [دليل النشر](./DEPLOYMENT.md)
- [Quick Start Guide](./QUICKSTART_AR.md)
- [Deployment Guide](./DEPLOYMENT_AR.md)

### 🤝 المساهمة

المساهمات مرحب بها! لا تتردد في تقديم طلب سحب.

### 📄 الترخيص

هذا المشروع مرخص بموجب ترخيص MIT - راجع ملف [LICENSE](../LICENSE) للحصول على التفاصيل.

### 🙏 الشكر والتقدير

- فريق React لـ React 18
- Hugging Face لـ Transformers.js
- جميع المساهمين في المصادر المفتوحة

---

<div align="center">

**Built with ❤️ for Privacy and Sovereignty**

**مبني بـ ❤️ من أجل الخصوصية والسيادة**

</div>
