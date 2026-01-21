# Tech Stack: Backend (iqEngi-backend)

**Activación:** Glob `iqEngi-backend/**/*`

Esta regla define la arquitectura, seguridad y estándares de código para el backend NestJS del proyecto iqEngi.

---

## 1. Core Stack

| Tecnología | Versión | Notas |
|------------|---------|-------|
| **Framework** | NestJS v10 | Node.js con TypeScript |
| **TypeScript** | v5.7+ | Configuración estricta |
| **API Style** | GraphQL Code First | Decoradores `@nestjs/graphql` con Apollo Server v4 |
| **Database** | MongoDB v6 | Motor principal |
| **ODM** | Mongoose v8 | Esquemas tipados |
| **Auth** | Passport.js | JWT Strategy + Google OAuth |
| **Email** | Resend + Nodemailer | Integración híbrida |
| **Validation** | class-validator + class-transformer | DTOs tipados |

---

## 2. Arquitectura (Strict Modularity)

### Estructura de Módulos
Cada feature es un Módulo independiente en `src/modules/[Feature]/`:

```
src/modules/[Feature]/
├── [feature].module.ts         # Definición del módulo
├── entities/                   # Entidades/Schemas (combinados)
│   └── [feature].entity.ts
├── dtos/                       # DTOs (Input/Output/Args)
│   ├── create-[feature].input.ts
│   ├── update-[feature].input.ts
│   └── [feature].output.ts
├── resolvers/                  # Resolvers GraphQL
│   └── [feature].resolver.ts
├── services/                   # Lógica de negocio
│   └── [feature].service.ts
├── interfaces/                 # Interfaces TypeScript
└── controllers/                # (Opcional) REST endpoints
```

### Separación de Responsabilidades

| Componente | Responsabilidad | Prohibiciones |
|------------|-----------------|---------------|
| `*.resolver.ts` | Maneja peticiones GraphQL, valida permisos con decoradores | NO contiene lógica de negocio |
| `*.service.ts` | Lógica de negocio, llamadas a BD, orquestación | NO maneja request/response directamente |
| `*.entity.ts` | Define esquema Mongoose + tipo GraphQL (combinado) | NO contiene lógica |

### Inyección de Dependencias
```typescript
// ✅ CORRECTO
constructor(private readonly cursoService: CursoService) {}

// ❌ INCORRECTO - No usar inyección manual
```

---

## 3. BaseService (Patrón Obligatorio)

> [!IMPORTANT]
> Todo Service **DEBE** extender de una clase base para operaciones CRUD estándar.

### Clases Base Disponibles

| Clase | Uso |
|-------|-----|
| `BaseService<T, W, U>` | CRUD simple |
| `BaseArrayService` | Entidades con arrays de subdocumentos |
| `BaseNestedArrayService` | Arrays anidados (subdocumentos dentro de subdocumentos) |
| `BasePushPullService` | Operaciones de push/pull en arrays |

### Implementación Típica
```typescript
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class CursoService extends BaseService<Curso, UpdateCursoInput, CreateCursoInput> {
  constructor(@InjectModel(Curso.name) cursoModel: Model<Curso>) {
    super(cursoModel);
  }

  // Métodos heredados automáticamente:
  // - create(), findAll(), findById(), update(), softDelete(), hardDelete(), restore()
  
  // Agregar solo métodos específicos del dominio
  async findByInstructor(instructorId: Types.ObjectId): Promise<Curso[]> {
    // Lógica específica
  }
}
```

---

## 4. Entidades y AuditFields

### Definición Combinada (Entity + Schema)
Las entidades combinan decoradores de GraphQL (`@ObjectType`) y Mongoose (`@Schema`, `@Prop`):

```typescript
import { AuditFields } from 'src/common/clases/audit-fields.class';

@ObjectType()
@Schema({ timestamps: true })
export class Curso extends AuditFields implements ICurso {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  courseTitle: string;

  @Field()
  @Prop({ default: false })
  deleted: boolean;  // Obligatorio para soft-delete
}

export const CursoSchema = SchemaFactory.createForClass(Curso);
```

### AuditFields (Obligatorio)
Todas las entidades **DEBEN** extender `AuditFields`:

```typescript
// Campos incluidos automáticamente:
// - createdBy: Types.ObjectId
// - updatedBy: Types.ObjectId  
// - deletedBy: Types.ObjectId
// - deletedAt: Date
// - deleted: boolean
```

---

## 5. GraphQL & DTOs (Validación CRÍTICA)

### Code First Approach
```typescript
// Input para creación
@InputType()
export class CreateCursoInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  courseTitle: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number;
}

// Output tipado
@ObjectType()
export class CursoOutput extends Curso {}
```

### Reglas de Validación

> [!CAUTION]
> **TODO `@Args()` debe usar un InputType (DTO) específico** con validadores de `class-validator`.

```typescript
// ✅ CORRECTO
@Mutation(() => CursoOutput)
async create(@Args('createCursoInput') input: CreateCursoInput) {}

// ❌ INCORRECTO - Objeto genérico sin validación
@Mutation(() => Curso)
async create(@Args('data') data: Record<string, any>) {}
```

### Pipes Comunes
- `IdPipe`: Convierte string ID a `Types.ObjectId`
- `ValidationPipe`: Valida DTOs automáticamente (configurado globalmente)

---

## 6. Seguridad (Guards y Decoradores)

### Guards Globales
```typescript
// Configurados en app.module.ts
providers: [
  { provide: APP_GUARD, useClass: JwtAuthGuard },    // Auth JWT
  { provide: APP_GUARD, useClass: RolesGuard },      // Autorización por roles
]
```

### Decoradores de Acceso

| Decorador | Efecto |
|-----------|--------|
| `@IsPublic()` | Bypass de autenticación JWT |
| `@RolesDec(RolEnum.ADMINISTRADOR)` | Requiere rol específico |
| `@CurrentUser()` | Inyecta usuario autenticado |

### Patrones de Uso
```typescript
@Resolver(() => Curso)
export class CursoResolver {
  // Público - Sin autenticación
  @Query(() => [CursoOutput], { name: 'Cursos' })
  @IsPublic()
  async findAll() {}

  // Protegido - Solo admins
  @Mutation(() => CursoOutput)
  @RolesDec(RolEnum.ADMINISTRADOR)
  async create(@CurrentUser() user: UserRequest) {}

  // Protegido - Usuario autenticado (cualquier rol)
  @Query(() => CursoOutput)
  async findById(@CurrentUser() user: UserRequest) {}
}
```

> [!WARNING]
> **NUNCA** combinar `@IsPublic()` con `@RolesDec()` en el mismo endpoint.

---

## 7. Base de Datos (Mongoose)

### Registro de Modelos
```typescript
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Curso.name, schema: CursoSchema },
    ]),
  ],
})
export class CursoModule {}
```

### Consultas
- Usar **`async/await`** siempre
- Evitar callbacks
- Las consultas deben devolver tipos correctos

### Soft Delete (Patrón Estándar)
```typescript
// Middleware automático configurado en schemas
addSoftDeleteMiddleware<Curso, Curso>(CursoSchema);

// Los métodos de BaseService manejan soft-delete automáticamente:
// - softDelete(id, userId)
// - hardDelete(id) - Requiere deleted: true
// - restore(id, userId)
// - findSoftDeleted(pagination)
```

---

## 8. Testing (Jest)

### Tests Unitarios
- Ubicación: `src/modules/[feature]/*.spec.ts`
- **NUNCA** conectar a MongoDB real
- Mockear modelos con `useValue`

```typescript
describe('CursoService', () => {
  let service: CursoService;
  let model: Model<Curso>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CursoService,
        {
          provide: getModelToken(Curso.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            // ... mocks
          },
        },
      ],
    }).compile();

    service = module.get<CursoService>(CursoService);
  });
});
```

### Tests E2E
- Ubicación: `test/*.e2e-spec.ts`
- Usar `Supertest` con `AppModule` real
- Configuración: `test/jest-e2e.json`

```typescript
describe('Curso (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  it('debe consultar cursos públicos', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `query { Cursos(offset: 0, limit: 10) { _id courseTitle } }`,
      });

    expect(response.body.data.Cursos).toBeDefined();
  });
});
```

### Comandos de Testing
```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:cov
```

---

## 9. Estructura Común (`src/common/`)

| Directorio | Contenido |
|------------|-----------|
| `clases/` | `AuditFields`, `SearchField` |
| `decorators/` | Decoradores reutilizables |
| `dtos/` | DTOs comunes (`PaginationArgs`, `IdInput`) |
| `enums/` | Enums compartidos (`RolEnum`, `Nivel`, `Coleccion`) |
| `interfaces/` | Interfaces comunes (`IResolverBase`) |
| `middlewares/` | Middleware de soft-delete, sync |
| `pipes/` | Pipes de validación (`IdPipe`) |
| `services/` | Clases base (`BaseService`, etc.) |

---

## 10. Checklist de Revisión de Código

- [ ] ¿El Service extiende de una clase Base apropiada?
- [ ] ¿La Entity extiende `AuditFields` y tiene `deleted: boolean`?
- [ ] ¿Los DTOs tienen validadores de `class-validator`?
- [ ] ¿Los endpoints públicos usan `@IsPublic()`?
- [ ] ¿Los endpoints protegidos usan `@RolesDec()` o verifican `@CurrentUser()`?
- [ ] ¿Hay tests unitarios para el Service/Resolver?
- [ ] ¿Se usó `async/await` en lugar de callbacks?
