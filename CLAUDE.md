# Boxes — Contexto Técnico del Proyecto

## Stack

| Capa | Tecnologías |
|------|-------------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui + react-router-dom + Zustand |
| Backend | Express (Bun como runtime) + TypeScript |
| ORM / DB | Prisma + MySQL 8 |
| Auth | JWT (jose) + bcrypt |
| Infra | Docker + docker-compose |

---

## Guía para IAs

> Esta sección es para cualquier IA que trabaje conmigo en este proyecto.

### Mi Objetivo
Estoy aprendiendo a programar. No quiero que me haga todo el código, quiero entender cómo y por qué funciona.

### Mi Nivel
- JS/TS básico
- React aprendiendo
- SQL básico
- HTML/CSS entiendo fundamentos
- Node.js/Express básico

### Cómo trabajo
- Cuando hago código: Te pediré "haz X" o "implementa esta función"
- Cuando quiero aprender: Preguntaré "¿cómo funciona X?"
- Cuando quiero revisión: Diré "revisame este código"

### Lo que NO quiero
- Código sin que lo pida
- Refactorizaciones sin permiso
- Features no solicitadas

### Preferencias
- Código limpio y simple antes que complejo
- Prefiero aprender el "por qué" antes del "qué"
- Comentarios en español cuando sea necesario
- Prefiero muchos archivos pequeños que uno gigante

### Reglas de Comunicación
1. **Sé directo**. Nada de relleno, preámbulos.
2. **Indica el archivo** que debe crearse/modificarse con su ruta completa.
3. **Da el esqueleto** del código cuando guíes y deja que yo rellene la lógica.
4. **Sugiere el siguiente paso** al final de cada respuesta.
5. **Usa checklists** (- [ ]) para que marque progreso.

### Idioma
- **Comunicación**: Español
- **Código**: Inglés (variables, funciones, comentarios en código)
- **Archivos**: Nombres en inglés

Para más detalles de cómo trabajo, ver [AGENTS.md](./AGENTS.md).

---

## Estructura del Proyecto

```
box/
├── CLAUDE.md
├── AGENTS.md
├── agent.md
├── .env.example
├── .env                    # NO commitear
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── index.ts              # Entry point — Express
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── middlewares/
│       ├── lib/
│       └── types/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── components.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── store/
│       ├── types/
│       └── lib/
```

---

## Schema de Base de Datos (Prisma)

```prisma
model User {
  id                 String   @id @default(uuid())
  email              String   @unique
  password           String
  nickname           String   @unique
  firstName          String
  lastName           String
  avatarUrl          String?
  coupleId           String?
  resetToken         String?   @unique
  resetTokenExpirity DateTime?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  couple           Couple?         @relation(fields: [coupleId], references: [id])
  boxes            Box[]
  items            Item[]
  sentRequests     CoupleRequest[] @relation("SentRequests")
  receivedRequests CoupleRequest[] @relation("ReceivedRequests")
}

model Couple {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())

  users User[]
  boxes Box[]
}

model Box {
  id              String   @id @default(uuid())
  name            String
  description     String?
  coupleId        String?
  createdByUserId String
  createdAt       DateTime @default(now())

  couple   Couple? @relation(fields: [coupleId], references: [id])
  createdBy User   @relation(fields: [createdByUserId], references: [id])
  items    Item[]
}

model Item {
  id              String   @id @default(uuid())
  content         String
  boxId           String
  createdByUserId String
  createdAt       DateTime @default(now())

  box       Box  @relation(fields: [boxId], references: [id], onDelete: Cascade)
  createdBy User @relation(fields: [createdByUserId], references: [id])
}

model CoupleRequest {
  id         String   @id @default(uuid())
  senderId   String
  receiverId String
  status     String   @default("PENDING")
  createdAt  DateTime @default(now())

  sender   User @relation("SentRequests", fields: [senderId], references: [id])
  receiver User @relation("ReceivedRequests", fields: [receiverId], references: [id])

  @@unique([senderId, receiverId])
}
```

---

## Contrato API

Base URL: `http://localhost:3000/api`

### Auth
| Método | Ruta | Body | Respuesta | Auth |
|--------|------|------|-----------|------|
| POST | `/auth/register` | `{ email, password, nickname, firstName, lastName }` | `{ user, token }` | No |
| POST | `/auth/login` | `{ email, password }` | `{ user, token }` | No |
| GET | `/auth/me` | — | `{ id, email, nickname, ... }` | Sí |

### Boxes
| Método | Ruta | Body | Respuesta | Auth |
|--------|------|------|-----------|------|
| GET | `/boxes` | — | `Box[]` | Sí |
| GET | `/boxes/:id` | — | `Box` | Sí |
| POST | `/boxes` | `{ name, description? }` | `Box` | Sí |
| PUT | `/boxes/:id` | `{ name?, description? }` | `Box` | Sí |
| DELETE | `/boxes/:id` | — | `{ success: true }` | Sí |
| PUT | `/boxes/:id/visibility` | — | `Box` | Sí |

### Items
| Método | Ruta | Body | Respuesta | Auth |
|--------|------|------|-----------|------|
| GET | `/boxes/:boxId/items` | — | `Item[]` | Sí |
| POST | `/boxes/:boxId/items` | `{ content }` | `Item` | Sí |
| PUT | `/items/:id` | `{ content }` | `Item` | Sí |
| DELETE | `/items/:id` | — | `{ success: true }` | Sí |

### Formato de Error Estándar
```json
{ "error": "Mensaje descriptivo", "statusCode": 400 }
```

---

## Patrones de Arquitectura

### Backend: Controller → Service → Repository
- **Controller**: Parsea request, valida input básico, llama al service, devuelve response.
- **Service**: Lógica de negocio (verificar pertenencia al couple, validaciones de negocio).
- **Repository**: Queries a Prisma. Sin lógica de negocio.

### Middleware Chain
```
Request → CORS → Auth (si ruta protegida) → Controller → Error Handler → Response
```

### Auth Flow
1. Login/Register → Backend genera JWT con `{ userId }` en payload
2. Frontend guarda token en localStorage (via Zustand persist)
3. Cada request protegido lleva header `Authorization: Bearer <token>`
4. Middleware auth decodifica JWT → adjunta `userId` al request

---

## Convenciones de Código

- **Archivos**: kebab-case (`auth.controller.ts`, `box.service.ts`)
- **Variables/funciones**: camelCase
- **Tipos/Interfaces**: PascalCase
- **Exports**: Named exports (no default) excepto páginas de React
- **Imports**: Rutas relativas dentro del mismo módulo, alias `@/` para frontend
- **Async**: async/await, nunca .then() chains
- **IDs**: UUID v4 (generados por Prisma)

---

## Estado Actual del Proyecto

### ✅ Completado
- Backend: Express + auth (register/login/me)
- Frontend: Login, Register, HomePage, ProtectedRoute
- Estado: Zustand store con persistencia

### ❌ Pendiente
- CRUD Boxes (backend + frontend)
- CRUD Items (backend + frontend)
- Vistas: Boxes.tsx, BoxDetail.tsx
- Funcionalidad de parejas (CoupleRequest)

---

## Roadmap del MVP

### Fase 0 — Preparación
**Objetivo**: Crear la estructura base del proyecto.

- [ ] Crear carpeta raíz con `/frontend`, `/backend`
- [ ] Inicializar git con `.gitignore` apropiado
- [ ] Crear `.env` a partir de `.env.example`

### Fase 1 — Docker y Entorno
**Objetivo**: `docker compose up` levanta MySQL + backend + frontend.

- [ ] MySQL: servicio en docker-compose.yml (puerto 3306)
- [ ] Backend: Express con Bun como runtime
- [ ] Frontend: React + Vite + Tailwind + shadcn/ui

### Fase 2 — Backend: Servidor HTTP
**Objetivo**: Servidor Express con rutas organizadas y middlewares base.

- [ ] `src/index.ts` con Express en puerto 3000
- [ ] Middleware CORS
- [ ] Middleware de errores
- [ ] Endpoint `GET /health`

### Fase 3 — Prisma + MySQL
**Objetivo**: Schema modelado, migraciones ejecutadas, conexión verificada.

- [ ] Schema.prisma con los 6 modelos
- [ ] PrismaClient singleton
- [ ] Migraciones ejecutadas

### Fase 4 — Autenticación
**Objetivo**: Register, login, JWT, middleware de auth.

- [ ] `POST /api/auth/register`
- [ ] `POST /api/auth/login`
- [ ] `GET /api/auth/me`
- [ ] JWT con jose + bcrypt

### Fase 5 — CRUD de Boxes e Items
**Objetivo**: Todas las operaciones CRUD protegidas por auth.

#### 5.1 — Boxes
- [ ] `POST /api/boxes`
- [ ] `GET /api/boxes`
- [ ] `GET /api/boxes/:id`
- [ ] `PUT /api/boxes/:id`
- [ ] `DELETE /api/boxes/:id`

#### 5.2 — Items
- [ ] `POST /api/boxes/:boxId/items`
- [ ] `GET /api/boxes/:boxId/items`
- [ ] `PUT /api/items/:id`
- [ ] `DELETE /api/items/:id`

### Fase 6 — Frontend React
**Objetivo**: UI completa que consume la API.

- [ ] Rutas: `/login`, `/register`, `/boxes`, `/boxes/:id`
- [ ] Login/Register pages
- [ ] Boxes page (lista de boxes)
- [ ] BoxDetail page (items de una caja)
- [ ] Estados de loading y feedback

---

## Reglas del Agent

1. Consulta siempre `CLAUDE.md` para el contexto técnico.
2. No dupliques información que ya está en `CLAUDE.md` — refiérelo.
3. Si el usuario está en una fase, no saltes a otra sin que lo pida.
4. Si detectas un error de diseño o código, señálalo inmediatamente.
5. Prioriza código simple y funcional sobre abstracciones prematuras.
6. No agregues features que no están en el roadmap sin preguntar.

---

## Variables de Entorno

```env
# Database
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=boxdb
MYSQL_USER=box_user
MYSQL_PASSWORD=

# Backend
DATABASE_URL=mysql://box_user:password@mysql:3306/boxdb
JWT_SECRET=
PORT=3000

# Frontend
VITE_API_URL=http://localhost:3000/api
```