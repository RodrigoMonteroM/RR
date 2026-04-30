# Boxes

App para parejas que guarda listas de deseos, ideas y planes en "cajas" compartidas.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui |
| Backend | Express + Bun + TypeScript |
| Base de datos | MySQL 8 + Prisma ORM |
| Auth | JWT (jose) + bcrypt |
| Infra | Docker + docker-compose |

## Requisitos

- Docker y Docker Compose
- Git

## Setup

```bash
# 1. Clonar el repo
git clone <url>
cd boxes

# 2. Crear el .env
cp .env.example .env
# Editar .env con tus valores

# 3. Levantar todo
docker compose up --build
```

La app estará en:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API: http://localhost:3000/api

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

```env
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=boxdb
MYSQL_USER=box_user
MYSQL_PASSWORD=

DATABASE_URL=mysql://box_user:<password>@mysql:3306/boxdb
JWT_SECRET=

PORT=3000

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
FRONTEND_URL=http://localhost:5173

VITE_API_URL=http://localhost:3000/api
```

## Estructura

```
boxes/
├── backend/        # Express API (Bun runtime)
│   ├── prisma/     # Schema y migraciones
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── routes/
│       └── middlewares/
└── frontend/       # React + Vite
    └── src/
        ├── pages/
        ├── components/
        ├── store/
        └── services/
```

## API

Base URL: `http://localhost:3000/api`

### Auth
| Método | Ruta | Auth |
|--------|------|------|
| POST | `/auth/register` | No |
| POST | `/auth/login` | No |
| GET | `/auth/me` | Sí |

### Boxes
| Método | Ruta | Auth |
|--------|------|------|
| GET | `/boxes` | Sí |
| POST | `/boxes` | Sí |
| GET | `/boxes/:id` | Sí |
| PUT | `/boxes/:id` | Sí |
| DELETE | `/boxes/:id` | Sí |

### Items
| Método | Ruta | Auth |
|--------|------|------|
| GET | `/boxes/:boxId/items` | Sí |
| POST | `/boxes/:boxId/items` | Sí |
| PUT | `/items/:id` | Sí |
| DELETE | `/items/:id` | Sí |
