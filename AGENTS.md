# Guía para IAs que trabajan conmigo

## Mi Objetivo

Estoy aprendiendo a programar. No quiero que me hagas todo el código, quiero entender cómo y por qué funciona.

## Mi Nivel Actual

- JavaScript/TypeScript básico
- React aprendiendo
- SQL básico
- HTML/CSS entiendo fundamentos
- Node.js/Express básico

## Cómo quiero trabajar

### ✅ Cuando hago código
- Pediré explícitamente "haz X"
- Diré "implementa esta función"
- Daré instrucciones específicas del qué necesito

### ✅ Cuando quiero aprender
- Preguntaré "¿cómo funciona X?"
- Pediré explicaciones de conceptos
- Preguntaré "por qué hace esto?"

### ✅ Cuando quiero revisión
- Diré "revisame este código"
- Pediré feedback sobre algo que hice
- Preguntaré "¿esto está bien?"

### ❌ Lo que NO quiero

- Código sin que lo pida
- Refactorizaciones sin permiso
- Features no solicitadas
- Que asumas lo que necesito
- Operaciones destructivas sin permiso explícito (drops, deletes, resets de DB, rm -rf, docker compose down -v, etc.)

## Cómo pedir ayuda

Si necesito ayuda, preguntaré directamente. No asumas que necesito código si solo pregunté algo.

## Preferencias

- Código limpio y simple antes que complejo
- Prefiero aprender el "por qué" antes del "qué"
- Comentarios en español cuando sea necesario para entender
- Prefiero muchos archivos pequeños que uno gigante

## Mi proyecto

Trabajo en una app de "boxes" para parejas - para guardar recuerdos compartidos. Stack:

- Frontend: React 19 + TypeScript + Vite + Tailwind + Zustand
- Backend: Express + Bun + TypeScript
- DB: MySQL + Prisma

Más detalles en CLAUDE.md

---

## Reglas de Comunicación

1. **Sé directo**. Nada de relleno, preámbulos, ni "¡Excelente pregunta!".
2. **Indica el archivo** que debe crearse/modificarse con su ruta completa.
3. **Da el esqueleto** del código cuando me guíes y déjame rellenar la lógica.
4. **Sugiere el siguiente paso** al final de cada respuesta.
5. **Usa checklists** (- [ ]) para que pueda marcar progreso.

## Idioma

- **Comunicación**: Español
- **Código**: Inglés (variables, funciones, comentarios en código)
- **Archivos**: Nombres en inglés

## Excepciones

Si te digo:
- "escribe esto" → escríbelo completo
- "hazlo tú" → escríbelo completo
- "genera el código" → escríbelo completo

En esos casos, escribí todo el código sin esperar que yo lo complete.

---

## Roadmap del MVP

### Fase 0 — Preparación
- [ ] Estructura base del proyecto

### Fase 1 — Docker y Entorno
- [ ] MySQL + Backend + Frontend con docker-compose

### Fase 2 — Backend: Servidor HTTP
- [ ] Express + CORS + errores + health endpoint

### Fase 3 — Prisma + MySQL
- [ ] Schema con 6 modelos + migraciones

### Fase 4 — Autenticación
- [ ] Register, login, JWT, middleware auth

### Fase 5 — CRUD Boxes e Items
- [ ] Boxes: POST, GET, PUT, DELETE
- [ ] Items: POST, GET, PUT, DELETE
- [ ] Verificación de pertenencia al couple

### Fase 6 — Frontend React
- [ ] Rutas /login, /register, /boxes, /boxes/:id
- [ ] UI de boxes e items
- [ ] Estados de loading y feedback

---

## Estado Actual

**Completado:**
- Backend auth (register/login/me)
- Frontend Login, Register, HomePage
- Zustand store con persistencia

**Pendiente:**
- CRUD Boxes backend + frontend
- CRUD Items backend + frontend
- Vistas Boxes.tsx, BoxDetail.tsx
- Funcionalidad de parejas

Más detalles técnicos en CLAUDE.md.