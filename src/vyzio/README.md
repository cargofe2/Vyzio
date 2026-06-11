# VYZIO — MVP Codebase

> La plataforma donde la nueva generación aprende a construir el futuro con IA.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| API | tRPC v11 (type-safe end-to-end) |
| Auth | Clerk (social login, MFA, webhooks) |
| DB | PostgreSQL + Prisma ORM |
| Cache / Rankings | Upstash Redis |
| IA Tutor (VY) | Anthropic Claude API (claude-sonnet-4) |
| Embeddings / RAG | OpenAI + Pinecone |
| Pagos | Stripe (suscripciones + webhooks) |
| Storage | Cloudflare R2 |
| Deploy | Vercel (frontend) + Railway (DB) |

## Estructura del proyecto

```
vyzio/
├── prisma/
│   ├── schema.prisma          ← Schema completo (15 modelos)
│   └── seed.ts                ← Achievements, misiones, primeras lecciones
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── trpc/[trpc]/   ← tRPC HTTP handler
│   │       └── webhooks/
│   │           ├── stripe/    ← Stripe webhook (pagos)
│   │           └── clerk/     ← Clerk webhook (registro)
│   ├── server/
│   │   ├── trpc.ts            ← Base tRPC: contexto, procedures, middleware
│   │   └── routers/
│   │       ├── index.ts       ← Root router
│   │       ├── content.ts     ← Niveles, mundos, lecciones
│   │       ├── progress.ts    ← Completar lecciones, quizzes, dashboard
│   │       ├── gamification.ts← XP, misiones, recompensas
│   │       ├── vy.ts          ← Tutor VY (Claude API)
│   │       ├── subscription.ts← Stripe checkout y planes
│   │       ├── community.ts   ← Leaderboard, proyectos, equipos
│   │       └── user.ts        ← Registro, perfil, logros
│   └── lib/
│       ├── prisma.ts          ← Singleton Prisma
│       ├── redis.ts           ← Upstash Redis + leaderboard keys
│       ├── stripe.ts          ← Cliente Stripe + webhook handler
│       ├── gamification.ts    ← Motor de XP, rangos, rachas, misiones
│       ├── certificates.ts    ← Generación y verificación de certificados
│       └── env.ts             ← Validación de variables de entorno (Zod)
├── .env.example               ← Todas las variables necesarias
├── package.json
└── README.md
```

## Inicio rápido

### 1. Clonar e instalar

```bash
git clone https://github.com/tu-org/vyzio.git
cd vyzio
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
# Edita .env.local con tus credenciales
```

Servicios necesarios:
- **PostgreSQL**: Railway.app (gratis para empezar) o local con Docker
- **Clerk**: clerk.com (tier gratis hasta 10K usuarios)
- **Anthropic**: console.anthropic.com (VY tutor)
- **Stripe**: dashboard.stripe.com (pagos)
- **Upstash Redis**: console.upstash.com (leaderboards)
- **Pinecone**: app.pinecone.io (RAG para VY)
- **Cloudflare R2**: dash.cloudflare.com (assets)

### 3. Base de datos

```bash
# Generar cliente Prisma
npm run db:generate

# Crear tablas
npm run db:migrate

# Seedear datos iniciales (achievements, misiones, lecciones)
npm run db:seed
```

### 4. Stripe (local)

```bash
# En terminal separada:
npm run stripe:listen
# Copia el webhook secret al .env.local
```

### 5. Arrancar

```bash
npm run dev
# http://localhost:3000
```

## Modelos de base de datos

| Modelo | Descripción |
|---|---|
| `User` | Perfil, avatar, preferencias |
| `Gamification` | XP, gemas, coins, racha, rango |
| `XpEvent` | Log de todos los eventos de XP |
| `Level` | Los 4 niveles del programa |
| `World` | Los 40+ mundos temáticos |
| `Lesson` | Las 625+ lecciones |
| `QuizQuestion` | Preguntas de cada lección |
| `LessonProgress` | Progreso por usuario×lección |
| `WorldProgress` | % de completación por mundo |
| `QuizAttempt` | Registro de respuestas |
| `Achievement` | Catálogo de 15+ logros |
| `UserAchievement` | Logros ganados por usuario |
| `Mission` | Misiones diarias/semanales/torneos |
| `MissionProgress` | Estado de misiones por usuario |
| `Certificate` | Certificados verificables (UUID + QR) |
| `PortfolioItem` | Proyectos del portafolio |
| `VyMessage` | Historial de chat con VY |
| `Team` | Equipos de competencia |
| `TeamMember` | Miembros de cada equipo |
| `Subscription` | Planes Stripe por usuario |

## tRPC API Reference

```typescript
// Ejemplos de uso desde el cliente:
const utils = api.useUtils();

// Contenido
api.content.getLevels.useQuery()
api.content.getWorlds.useQuery({ levelId })
api.content.getLessons.useQuery({ worldId })
api.content.getLesson.useQuery({ lessonId })

// Progreso
api.progress.getDashboard.useQuery()
api.progress.completeLesson.useMutation()
api.progress.submitQuizAnswer.useMutation()

// VY Tutor
api.vy.chat.useMutation()
api.vy.getHistory.useQuery({ limit: 20 })
api.vy.evaluateProject.useMutation()

// Gamificación
api.gamification.getStatus.useQuery()
api.gamification.getMissions.useQuery()
api.gamification.claimMissionReward.useMutation()

// Comunidad
api.community.getWeeklyLeaderboard.useQuery({ limit: 50 })
api.community.getProjects.useQuery({ limit: 10 })
api.community.publishProject.useMutation()

// Suscripción
api.subscription.getCurrent.useQuery()
api.subscription.createCheckout.useMutation()
api.subscription.createPortalSession.useMutation()

// Usuario
api.user.getMe.useQuery()
api.user.getProfile.useQuery({ username })
api.user.updateProfile.useMutation()
api.user.getAchievements.useQuery()
```

## Lógica de Gamificación

```typescript
// XP base por acción
XP_REWARDS = {
  lesson_complete:        75,
  quiz_perfect_first:    100,   // correcto al primer intento
  quiz_correct:           60,
  project_complete:      300,
  world_complete_bonus:  500,
  level_complete_bonus: 2000,
}

// Multiplicadores de racha (Plan Pro)
streak >= 7  días → ×1.25
streak >= 14 días → ×1.35
streak >= 30 días → ×1.50
streak >= 60 días → ×1.65
streak >= 100 días → ×1.80

// Rangos y XP requerido
NOVICE:      0 XP
EXPLORER:    500 XP
CREATOR:     2,000 XP
BUILDER:     6,000 XP
INNOVATOR:   15,000 XP
VISIONARY:   30,000 XP
PIONEER:     55,000 XP
MASTER:      90,000 XP
LEGEND:      140,000 XP
AI_TITAN:    200,000 XP
```

## Deploy

```bash
# Vercel (frontend + API routes)
vercel deploy

# Railway (PostgreSQL)
# Conecta tu repo desde railway.app

# Variables de entorno
# Agrega todas las del .env.example en Vercel Dashboard
```

## Roadmap del código

- [ ] Frontend: páginas de dashboard, lección, perfil, comunidad
- [ ] Frontend: componentes UI (design system VYZIO)
- [ ] App móvil: React Native + Expo
- [ ] PDF generator para certificados (BullMQ job)
- [ ] RAG para VY: indexar lecciones en Pinecone
- [ ] Admin panel: gestión de contenido
- [ ] Analytics: PostHog + Mixpanel integración
- [ ] Push notifications (Expo Notifications)

---

Built with ❤️ by el equipo VYZIO
