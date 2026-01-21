---
trigger: always_on
---

# Tech Stack: Backend (iqEngi-backend)

**Activación:** Glob `iqEngi-backend/**/*`

Esta regla define la arquitectura, seguridad y estándares de código para el backend NestJS del proyecto iqEngi.

## 1. Core Stack
- **Framework:** NestJS v10 (Node.js) con TypeScript v5.7.
- **API Style:** GraphQL **Code First** (usando decoradores `@nestjs/graphql`).
- **DB:** MongoDB v6 + Mongoose v8.
- **Auth:** Passport.js (JWT Strategy + Google OAuth).
- **Email:** Resend + Nodemailer (Integración híbrida).

## 2. Arquitectura (Strict Modularity)
- **Estructura:** Cada feature es un Módulo (`src/modules/[Feature]/`).
- **Separación de Responsabilidades:**
  - `*.resolver.ts`: Solo maneja peticiones GraphQL y devuelve DTOs/Entities. NO contiene lógica de negocio.
  - `*.service.ts`: Contiene toda la lógica de negocio, llamadas a BD y orquestación.
  - `*.schema.ts`: Definición de Mongoose (`@Prop()`).
- **Inyección de Dependencias:** Usar siempre inyección en el constructor (`private readonly service: MyService`).

## 3. GraphQL & DTOs (Data Validation)
- **Code First:** Definir el esquema usando clases y decoradores (`@ObjectType`, `@InputType`).
- **Validación (CRÍTICO):**
  - Todo `@Args()` debe usar un **InputType (DTO)** específico, nunca objetos genéricos.
  - Los DTOs DEBEN usar decoradores de `class-validator` (`@IsString()`, `@IsEmail()`, `@Min(0)`).
  - Si falta validación en un Input, rechazar el código.

## 4. Base de Datos (Mongoose)
- **Modelos:** Usar `MongooseModule.forFeature` en el módulo local.
- **Consultas:** Usar `async/await`. Evitar callbacks.
- **Tipado:** Las consultas deben devolver instancias tipadas del Documento o DTOs mapeados.

## 5. Testing (Jest)
- **Unitario:** Todo Service/Resolver debe tener su `.spec.ts`.
- **Mocks:** NO conectar a MongoDB real en tests unitarios. Mockear el modelo con `useValue`.
- **E2E:** Usar `Supertest` para probar los resolvers desde fuera.

## 6. Git & Commit Standards
- **Idioma:** Español.
- **Formato:** tipo: descripción corta.
- **Ejemplo:** se agregó validación de usuarios