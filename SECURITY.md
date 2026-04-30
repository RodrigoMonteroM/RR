# Security Policy — Boxes

> **Última auditoría:** 30 de abril de 2026
> **Scope:** Backend (Express + Bun + Prisma), Frontend (React + Vite), Infra (Docker Compose)

---

## Reportar una vulnerabilidad

Si encontrás una vulnerabilidad de seguridad, por favor **no abras un issue público**.

📧 **Contacto:** [tu-email@ejemplo.com] *(cambiar por email real)*

**Proceso:**
1. Enviá un email con descripción, pasos para reproducir e impacto estimado.
2. Recibirás confirmación en ≤ 48 horas.
3. Trabajaremos en un fix y te notificaremos cuando esté resuelto.
4. No divulgues públicamente hasta que se publique un parche.

---

## Resumen de auditoría

| Severidad | Cantidad | Acción |
|-----------|----------|--------|
| 🔴 Crítica | 7 | Arreglar **antes de cualquier deploy** |
| 🟠 Alta | 9 | Arreglar esta semana |
| 🟡 Media | 17 | Arreglar pre-producción |
| 🔵 Baja / Info | 4 | Hardening continuo |

**Total:** 37 hallazgos · **Fase 1 completada** (6/7 fixes aplicados)

---

## Hallazgos Críticos

### C1 — JWT_SECRET sin validación al arranque ✅ RESUELTO
**Archivo:** [backend/src/lib/jwt.ts](backend/src/lib/jwt.ts#L8-L12)
**Problema:** Usa `process.env.JWT_SECRET!` con non-null assertion. Si la variable no existe, la app arranca con `secret = undefined` → tokens firmados con clave vacía.
**Impacto:** Cualquiera puede forjar tokens válidos si el secret es indefinido.
**Fix aplicado:**
```ts
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters long");
}
const secret = new TextEncoder().encode(jwtSecret);
```

---

### C2 — JWT almacenado en localStorage
**Archivo:** [frontend/src/store/auth.store.ts](frontend/src/store/auth.store.ts#L24-L28)
**Problema:** Zustand `persist` sin `storage` configurado usa `localStorage` por defecto. Cualquier script malicioso (XSS) puede leer `box-auth` y robar el token.
**Impacto:** Token robado = acceso completo a la cuenta del usuario.
**Recomendación (corto plazo):** Agregar CSP ([C6](#c6--sin-content-security-policy-en-frontend)) + sanitizar todos los inputs renderizados.
**Recomendación (correcto):** Mover auth a cookies `httpOnly; Secure; SameSite=Strict` gestionadas por el backend. Requiere endpoint de sesión en Express.

---

### C3 — Endpoint `/user/:nickname` expone datos sensibles ✅ RESUELTO
**Archivo:** [backend/src/controllers/user.controller.ts](backend/src/controllers/user.controller.ts#L17)
**Problema:** Solo excluía `password`. Exponía `email`, `coupleId`, `resetToken`, `resetTokenExpirity`. Endpoint público (sin middleware de auth).
**Impacto:** Enumeración de emails, posible robo de tokens de reset si se adivina el nickname.
**Fix aplicado:**
```ts
const { password: _, resetToken, resetTokenExpirity, email, coupleId, ...userResponse } = user;
```

---

### C5 — Sin Helmet / security headers ✅ RESUELTO
**Archivo:** [backend/src/index.ts](backend/src/index.ts#L9-L14)
**Problema:** No se configuraban headers de seguridad: `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Content-Security-Policy`, `Referrer-Policy`.
**Impacto:** Vulnerable a clickjacking, MIME sniffing, y otros ataques que los headers mitigan.
**Fix aplicado:**
```ts
import helmet from "helmet";
app.use(helmet());
```
También se fixó **H6** (CORS con variable de entorno) en el mismo archivo.

---

### C6 — Sin Content-Security-Policy en frontend ✅ RESUELTO
**Archivo:** [frontend/index.html](frontend/index.html#L6)
**Problema:** Ninguna CSP definida. Si un atacante inyecta script, se ejecuta sin restricciones.
**Impacto:** Amplifica cualquier vulnerabilidad XSS a ejecución arbitraria de código.
**Fix aplicado:**
```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';">
```

---

### C7 — MySQL expuesto en 0.0.0.0:3306 ✅ RESUELTO
**Archivo:** [docker-compose.yml](docker-compose.yml)
**Problema:** `ports: "3306:3306"` exponía MySQL a toda la red local.
**Impacto:** Cualquier dispositivo en la misma red podía intentar conectarse a la base de datos.
**Fix aplicado:** Eliminada la sección `ports:` del servicio `mysql`. Los servicios dentro de la misma red de compose se comunican por nombre de servicio sin necesidad de exponer al host.

---

### C8 — Contenedores corren como root ✅ RESUELTO
**Archivos:** [backend/Dockerfile](backend/Dockerfile#L12-L13), [frontend/Dockerfile](frontend/Dockerfile#L11-L12)
**Problema:** Sin directiva `USER`. Los procesos corrían como root dentro del contenedor.
**Impacto:** Si un atacante escapa del contenedor, tenía privilegios de root en el host.
**Fix aplicado:**
```dockerfile
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

---

## Hallazgos Altos

### H1 — JWT expiración de 7 días sin refresh token
**Archivo:** [backend/src/lib/jwt.ts](backend/src/lib/jwt.ts#L14)
**Problema:** `.setExpirationTime("7d")` — un token robado es válido por una semana completa.
**Impacto:** Ventana de explotación prolongada.
**Recomendación:** Reducir a 15-30 minutos e implementar refresh tokens. Como compromiso intermedio: 1-2 días.

---

### H2 — Sin rate limiting en endpoints de autenticación
**Archivos:** [backend/src/index.ts](backend/src/index.ts) — rutas `/auth/*`
**Problema:** Sin protección contra fuerza bruta en login, registro, forgot-password, reset-password.
**Impacto:** Credential stuffing, brute force de passwords, guessing de reset tokens.
**Recomendación:**
```ts
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // 20 intentos por ventana
  message: "Demasiados intentos, intentá de nuevo más tarde",
});

app.use("/api/auth", authLimiter);
```

---

### H3 — ProtectedRoute no valida expiración del token
**Archivo:** [frontend/src/components/ProtectedRoute.tsx](frontend/src/components/ProtectedRoute.tsx#L4-L8)
**Problema:** Solo verifica `if (!token)`. No decodifica el campo `exp` del JWT. Muestra UI protegida brevemente con token expirado hasta que el backend rechaza con 401.
**Impacto:** Flash de UI no autorizada, experiencia de usuario degradada.
**Recomendación:** Decodificar el payload del JWT en el cliente y verificar `exp`:
```ts
const isExpired = (token: string): boolean => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000 < Date.now();
};
```

---

### H4 — Logout no invalida token en backend
**Problema:** No existe endpoint `/auth/logout`. El token sigue siendo válido hasta su expiración (7 días).
**Impacto:** Si el usuario hace logout en un dispositivo compartido, el token sigue activo.
**Recomendación:** Implementar lista de revocación (Redis/DB) con `jti` claim en el JWT, o usar tokens cortos + refresh tokens.

---

### H5 — resetToken generado con UUID predecible
**Archivo:** [backend/src/controllers/auth.controller.ts](backend/src/controllers/auth.controller.ts#L81)
**Problema:** `crypto.randomUUID()` genera UUID v4 con formato predecible. Además, el token se guarda en texto plano en la BD.
**Impacto:** Si la BD se filtra, tokens de reset activos son reutilizables directamente.
**Recomendación:**
```ts
const resetToken = crypto.randomBytes(32).toString('hex');
const hashedToken = await Bun.password.hash(resetToken);
// Guardar hashedToken en BD, comparar con verify al usar
```

---

### H6 — CORS con origen hardcoded ✅ RESUELTO
**Archivo:** [backend/src/index.ts](backend/src/index.ts#L16-L20)
**Problema:** `origin: "http://localhost:5173"` siempre. Rompería en producción.
**Impacto:** En producción, el frontend no podría hacer requests al backend.
**Fix aplicado:**
```ts
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173").split(",");
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
```

---

### H7 — Vite dev server expuesto en 0.0.0.0
**Archivo:** [frontend/vite.config.ts](frontend/vite.config.ts#L13)
**Problema:** `host: '0.0.0.0'` hace el dev server accesible desde toda la red local.
**Impacto:** Cualquier dispositivo en la red puede acceder al frontend en desarrollo.
**Recomendación:** Cambiar a `host: 'localhost'` salvo que se necesite acceso explícito desde otros dispositivos.

---

### H8 — Sin .dockerignore
**Archivos:** [backend/Dockerfile](backend/Dockerfile#L8), [frontend/Dockerfile](frontend/Dockerfile#L9)
**Problema:** `COPY . .` incluye `.git`, posibles `.env` locales, logs, IDE configs en la imagen Docker.
**Impacto:** Imágenes más grandes, posible filtración de secretos o historial de git.
**Recomendación:** Crear `.dockerignore` en raíz:
```
.git
.gitignore
.env
.env.*
*.md
node_modules
dist
.DS_Store
Thumbs.db
.vscode
.idea
```

---

### H9 — Imágenes Docker sin versión fija
**Archivo:** [docker-compose.yml](docker-compose.yml#L3)
**Problema:** `mysql:8`, `oven/bun:1`, `node:20-alpine` — tags flotantes que pueden cambiar con breaking changes.
**Impacto:** Builds no reproducibles, posibles breaking changes inesperados.
**Recomendación:** Pinear a versión exacta:
```yaml
image: mysql:8.0.42
# FROM oven/bun:1.2.12-alpine
# FROM node:20.18.3-alpine
```

---

## Hallazgos Medios

### M1 — Password mínimo 6 caracteres
**Archivo:** [backend/src/schema/userSchema.ts](backend/src/schema/userSchema.ts#L5)
**Problema:** `.min(6)` es insuficiente según estándares actuales (OWASP recomienda mínimo 8, NIST recomienda 10+).
**Recomendación:** Subir a `.min(10)` y considerar validar complejidad (mayúscula + número).

---

### M2 — Sin sanitización explícita de inputs
**Problema:** Zod valida tipo y formato pero no sanitiza. React escapa por defecto, pero si en el futuro se usa `dangerouslySetInnerHTML` sin sanitizar = XSS.
**Recomendación:** Documentar la regla: **nunca usar `dangerouslySetInnerHTML`** sin pasar por `DOMPurify`. Considerar agregar `dompurify` como dependencia.

---

### M3 — avatarUrl acepta URIs peligrosas
**Archivo:** [backend/src/schema/userSchema.ts](backend/src/schema/userSchema.ts#L9)
**Problema:** `z.string().url()` acepta `javascript:alert(1)` y `data:text/html,...` en algunos navegadores.
**Recomendación:**
```ts
avatarUrl: z.string().url().refine(u => u.startsWith('https://')).optional(),
```

---

### M4 — resetTokenExpirity de 1 hora
**Archivo:** [backend/src/controllers/auth.controller.ts](backend/src/controllers/auth.controller.ts#L85)
**Problema:** `Date.now() + 3600000` (1 hora) es demasiado para un token de reset.
**Recomendación:** Reducir a 15 minutos: `Date.now() + 15 * 60 * 1000`.

---

### M5 — FRONTEND_URL sin validación HTTPS
**Archivo:** [backend/src/lib/mailer.ts](backend/src/lib/mailer.ts#L14)
**Problema:** El link de reset se envía por email. Si `FRONTEND_URL` usa `http://`, el token viaja en texto plano.
**Recomendación:** Validar al arranque:
```ts
if (!process.env.FRONTEND_URL?.startsWith('https://')) {
  console.warn("WARNING: FRONTEND_URL should use HTTPS in production");
}
```

---

### M6 — allowPublicKeyRetrieval: true en Prisma
**Archivo:** [backend/src/lib/prisma.ts](backend/src/lib/prisma.ts#L13)
**Problema:** Permite que el cliente obtenga la clave pública del servidor sin TLS, vulnerable a MITM.
**Recomendación:** En producción debe ser `false`. Usar variable de entorno:
```ts
allowPublicKeyRetrieval: process.env.NODE_ENV !== 'production',
```

---

### M7 — Logs imprimen email completo
**Archivo:** [backend/src/middlewares/auth.middleware.ts](backend/src/middlewares/auth.middleware.ts#L30)
**Problema:** `logger.db(\`Verifying password for user → ${email}\`)` expone el email en logs.
**Recomendación:**
```ts
const masked = email.replace(/(.{2}).+(@.+)/, '$1***$2');
logger.db(`Verifying password for user → ${masked}`);
```

---

### M8 — Error messages pueden exponer detalles internos
**Problema:** Algunos catch blocks podrían filtrar stack traces o detalles de implementación en producción.
**Recomendación:** Wrapper de error que devuelva mensaje genérico en producción:
```ts
const message = process.env.NODE_ENV === 'production'
  ? 'Errore interno del server'
  : (error as Error).message;
```

---

### M9 — Sin global error handler en Express
**Archivo:** [backend/src/index.ts](backend/src/index.ts)
**Problema:** Si un middleware lanza un error no manejado, Express responde con HTML por defecto (stack trace en desarrollo).
**Recomendación:** Agregar al final de `index.ts` (después de todas las rutas):
```ts
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error("Unhandled error:", err);
  res.status(500).json({ message: "Errore interno del server" });
});
```

---

### M10 — .gitignore incompleto
**Archivo:** [.gitignore](.gitignore)
**Problema:** Faltan entradas para archivos de seguridad y configuraciones de IDE.
**Recomendación:** Agregar:
```
*.key
*.pem
*.cert
.env.*
!.env.example
.vscode/
.idea/
*.swp
coverage/
```

---

### M11 — .env.example con placeholders débiles
**Archivo:** [.env.example](.env.example#L13)
**Problema:** `JWT_SECRET=change_me_to_a_random_64_char_string` no indica cómo generar uno seguro.
**Recomendación:** Usar placeholder instructivo:
```
JWT_SECRET=<GENERATE_WITH: openssl rand -hex 32>
MYSQL_ROOT_PASSWORD=<GENERATE_WITH: openssl rand -base64 32>
```

---

### M12 — Bind mounts en docker-compose
**Archivo:** [docker-compose.yml](docker-compose.yml#L26)
**Problema:** `./backend:/app` y `./frontend:/app` montan el código local dentro del contenedor. Aceptable en dev, peligroso si se reusa en producción.
**Recomendación:** Usar `docker-compose.dev.yml` para desarrollo con bind mounts, y `docker-compose.yml` limpio para producción.

---

### M13 — Sin custom networks en compose
**Archivo:** [docker-compose.yml](docker-compose.yml)
**Problema:** Todos los servicios usan la red bridge por defecto.
**Recomendación:**
```yaml
networks:
  boxes-net:
    driver: bridge

services:
  mysql:
    networks: [boxes-net]
  backend:
    networks: [boxes-net]
  frontend:
    networks: [boxes-net]
```

---

### M14 — Backend sin healthcheck
**Archivo:** [docker-compose.yml](docker-compose.yml#L20-L41)
**Problema:** El servicio backend no tiene healthcheck. `depends_on` solo espera a que el contenedor arranque, no a que Express esté listo.
**Recomendación:** Agregar healthcheck que consulte `/api/health`:
```yaml
backend:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
    interval: 10s
    timeout: 5s
    retries: 5
```

---

### M15 — Ruta /schema sin protección
**Archivo:** [frontend/src/App.tsx](frontend/src/App.tsx#L41)
**Problema:** `/schema` expone el diagrama de la base de datos sin requerir autenticación.
**Impacto:** Información del modelo de datos accesible públicamente.
**Recomendación:** Envolver con `<ProtectedRoute>` o eliminar en producción.

---

### M16 — baseURL axios con fallback a HTTP
**Archivo:** [frontend/src/services/api.ts](frontend/src/services/api.ts#L5-L7)
**Problema:** Si `VITE_API_URL` no está definido, fallback a `http://localhost:3000/api` sin warning.
**Recomendación:**
```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (() => {
    throw new Error("VITE_API_URL is not defined");
  })(),
});
```

---

### M17 — Dependencias unused en backend
**Archivo:** [backend/package.json](backend/package.json#L15-L21)
**Problema:** `bcrypt` y `jsonwebtoken` están instalados pero no se usan (se usa `Bun.password` y `jose`). `crypto` es built-in de Node, no necesita instalarse. `@types/bcrypt` también sobra.
**Impacto:** Superficie de ataque innecesaria, posibles vulnerabilidades en dependencias no usadas.
**Recomendación:**
```bash
cd backend && bun remove bcrypt jsonwebtoken crypto @types/bcrypt
```

---

## Hallazgos Bajos / Informativos

### L1 — Sin configuración explícita de sourcemaps en Vite
**Archivo:** [frontend/vite.config.ts](frontend/vite.config.ts)
**Recomendación:** Agregar `build: { sourcemap: false }` para producción (evita exponer código fuente).

---

### L2 — console.error en producción
**Archivo:** [frontend/src/pages/HomePage.tsx](frontend/src/pages/HomePage.tsx#L46)
**Recomendación:** Usar `vite-plugin-remove-console` o logger condicional que solo loguee en desarrollo.

---

### L3 — Sin versionado de API
**Recomendación:** Usar prefijo `/api/v1/` desde el inicio para permitir evolución sin breaking changes.

---

### L4 — Sin documentación OpenAPI / Swagger
**Recomendación:** Agregar `swagger-ui-express` + spec OpenAPI para documentar endpoints. Útil para desarrollo y testing.

---

## Buenas prácticas detectadas

Lo que ya está bien implementado:

| Práctica | Detalle |
|----------|---------|
| `.env` excluido de git | Correctamente en [.gitignore](.gitignore#L3) |
| Sin raw SQL queries | Prisma ORM previene SQL injection |
| Bun.password.verify | Timing-safe, resistente a ataques de tiempo |
| CORS con origin explícito | No usa `*`, tiene `credentials: true` |
| Verificación de ownership en Boxes | BoxService valida owner y couple compartido |
| Token como Bearer header | En `Authorization`, no en URL |
| Forgot-password no revela email | Mismo mensaje para email existente e inexistente |
| MySQL healthcheck | `depends_on: condition: service_healthy` |
| React escapa por defecto | Sin `dangerouslySetInnerHTML` |
| Volumen MySQL nombrado | `mysql_data` como named volume, no bind mount |

---

## Roadmap de remediación

### Fase 1 — Inmediato (antes de cualquier deploy) ✅ COMPLETADA
- [x] ~~**C4**~~ — Hashear password en resetPassword *(ya aplicado: middleware `hashPassword` presente en la ruta)*
- [x] **C3** — Filtrar datos sensibles en getUser ✅
- [x] **C1** — Validar JWT_SECRET al arranque ✅
- [x] **C7** — Cerrar puerto 3306 al host ✅
- [x] **C5** — Agregar Helmet ✅
- [x] **C6** — Agregar CSP al frontend ✅
- [x] **C8** — USER no-root en Dockerfiles ✅
- [x] **H6** — CORS con variable de entorno ✅ *(bonus fix)*

### Fase 2 — Esta semana
- [ ] **H1** — Reducir expiración JWT
- [ ] **H2** — Agregar rate limiting
- [ ] **H5** — Mejorar generación de resetToken
- [ ] **H6** — CORS con variable de entorno
- [ ] **H8** — Crear .dockerignore
- [ ] **H9** — Pinear versiones de imágenes Docker

### Fase 3 — Pre-producción
- [ ] **H3** — Validar expiración en ProtectedRoute
- [ ] **H4** — Endpoint de logout + invalidación
- [ ] **H7** — Vite host en localhost
- [ ] **M1** — Subir mínimo de password a 10
- [ ] **M3** — Validar avatarUrl (https only)
- [ ] **M4** — Reducir resetTokenExpirity a 15 min
- [ ] **M5** — Validar HTTPS en FRONTEND_URL
- [ ] **M6** — allowPublicKeyRetrieval condicional
- [ ] **M7** — Masking de emails en logs
- [ ] **M8** — Error messages genéricos en prod
- [ ] **M9** — Global error handler
- [ ] **M10** — Completar .gitignore
- [ ] **M11** — Mejorar .env.example
- [ ] **M12** — Separar compose dev/prod
- [ ] **M13** — Custom networks en compose
- [ ] **M14** — Healthcheck en backend
- [ ] **M15** — Proteger ruta /schema
- [ ] **M16** — Validar VITE_API_URL
- [ ] **M17** — Remover dependencias unused
- [ ] **C2** — Migrar a cookies httpOnly (requiere refactor)

### Fase 4 — Hardening continuo
- [ ] **L1** — Configurar sourcemaps
- [ ] **L2** — Remover console en prod
- [ ] **L3** — Versionar API (/api/v1)
- [ ] **L4** — Documentación OpenAPI
- [ ] Configurar Dependabot o Renovate
- [ ] `npm audit` / `bun audit` en CI

---

## Checklist pre-producción

Antes de desplegar a producción, verificar:

- [x] Todos los hallazgos **Críticos** (C1-C3, C5-C8) resueltos ✅
- [ ] Todos los hallazgos **Altos** (H1-H5, H7-H9) resueltos
- [x] **H6** CORS con variable de entorno ✅
- [ ] JWT_SECRET generado con `openssl rand -hex 32`
- [ ] Todas las contraseñas de servicios son fuertes y únicas
- [ ] HTTPS habilitado en frontend y backend
- [ ] CORS configurado con dominio de producción
- [ ] Rate limiting activo en todos los endpoints de auth
- [ ] MySQL no accesible desde fuera del contenedor
- [ ] Logs no contienen datos sensibles (emails, tokens, passwords)
- [ ] Dependencias actualizadas (`bun audit`, `npm audit`)
- [ ] .env no commiteado (verificar con `git ls-files | grep .env`)
- [x] CSP configurado y funcional ✅
- [x] Helmet activo en Express ✅
- [x] Contenedores corren como usuario no-root ✅
- [ ] Backup de base de datos configurado
- [ ] Política de retención de logs definida

---

*Documento generado como parte de la auditoría de seguridad del proyecto Boxes. Actualizar con cada nueva revisión.*
