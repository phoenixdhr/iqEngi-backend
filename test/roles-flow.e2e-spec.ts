import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as cookieParser from 'cookie-parser';

/**
 * Pruebas e2e para el flujo de roles:
 * 1. Crear usuario con contraseña (signup)
 * 2. Login del usuario
 * 3. Actualizar rol a ADMINISTRADOR
 * 4. Consultar curso específico como admin
 */
describe('Roles Flow (e2e)', () => {
    let app: INestApplication;
    let httpServer: any;

    // Datos del usuario de prueba
    const testUser = {
        email: `test.roles.${Date.now()}@iqengi.com`,
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: 'Roles',
    };

    // Datos del admin existente para actualizar roles
    const adminCredentials = {
        email: 'henryreyesinv+admin@gmail.com',
        password: '123456',
    };

    let userId: string;
    let jwtToken: string;
    let adminToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.use(cookieParser());
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();

        httpServer = app.getHttpServer();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('1. Registro de usuario (signup)', () => {
        it('debe crear un usuario nuevo con rol ESTUDIANTE por defecto', async () => {
            const mutation = `
        mutation Signup($createUsuarioInput: CreateUsuarioInput!) {
          signup(createUsuarioInput: $createUsuarioInput) {
            _id
            email
            roles
            firstName
            lastName
          }
        }
      `;

            const response = await request(httpServer)
                .post('/graphql')
                .send({
                    query: mutation,
                    variables: {
                        createUsuarioInput: testUser,
                    },
                })
                .expect(200);

            expect(response.body.data).toBeDefined();
            expect(response.body.data.signup).toBeDefined();
            expect(response.body.data.signup.email).toBe(testUser.email.toLowerCase());
            // El rol viene en mayúsculas desde el enum GraphQL
            expect(response.body.data.signup.roles).toContain('ESTUDIANTE');

            userId = response.body.data.signup._id;
            console.log('Usuario creado con ID:', userId);
        });
    });

    describe('2. Login del usuario', () => {
        it('debe iniciar sesión y obtener JWT token', async () => {
            const mutation = `
        mutation Login($loginUserInput: LoginUserInput!) {
          login(loginUserInput: $loginUserInput) {
            _id
            email
            roles
          }
        }
      `;

            const response = await request(httpServer)
                .post('/graphql')
                .send({
                    query: mutation,
                    variables: {
                        loginUserInput: {
                            email: testUser.email,
                            password: testUser.password,
                        },
                    },
                })
                .expect(200);

            expect(response.body.data).toBeDefined();
            expect(response.body.data.login).toBeDefined();
            expect(response.body.data.login.email).toBe(testUser.email.toLowerCase());

            // Obtener el JWT token de las cookies
            const cookies = response.headers['set-cookie'] as unknown as
                | string[]
                | undefined;
            if (cookies && Array.isArray(cookies)) {
                const jwtCookie = cookies.find((cookie: string) =>
                    cookie.startsWith('jwt_token='),
                );
                if (jwtCookie) {
                    jwtToken = jwtCookie.split(';')[0].split('=')[1];
                    console.log('JWT Token obtenido');
                }
            }
        });
    });

    describe('3. Consulta de cursos (acceso público)', () => {
        it('debe poder consultar lista de cursos sin autenticación', async () => {
            const query = `
        query Cursos {
          Cursos(offset: 0, limit: 10) {
            _id
            courseTitle
          }
        }
      `;

            const response = await request(httpServer)
                .post('/graphql')
                .send({ query })
                .expect(200);

            expect(response.body.data).toBeDefined();
            expect(response.body.data.Cursos).toBeDefined();
            expect(Array.isArray(response.body.data.Cursos)).toBe(true);
            console.log('Cursos disponibles:', response.body.data.Cursos.length);
        });

        it('Curso(id) ahora requiere autenticación (sin @IsPublic)', async () => {
            // Primero obtener un curso
            const listQuery = `
        query Cursos {
          Cursos(offset: 0, limit: 1) {
            _id
            courseTitle
          }
        }
      `;

            const listResponse = await request(httpServer)
                .post('/graphql')
                .send({ query: listQuery })
                .expect(200);

            if (
                listResponse.body.data?.Cursos &&
                listResponse.body.data.Cursos.length > 0
            ) {
                const cursoId = listResponse.body.data.Cursos[0]._id;

                const detailQuery = `
          query Curso($id: ID!) {
            Curso(id: $id) {
              _id
              courseTitle
              descripcionCorta
            }
          }
        `;

                // Sin autenticación, debe fallar
                const detailResponse = await request(httpServer)
                    .post('/graphql')
                    .send({
                        query: detailQuery,
                        variables: { id: cursoId },
                    })
                    .expect(200);

                // Debe recibir error de autenticación
                expect(detailResponse.body.errors).toBeDefined();
                expect(detailResponse.body.errors.length).toBeGreaterThan(0);
                console.log(
                    'Curso(id) correctamente requiere autenticación:',
                    detailResponse.body.errors[0].message,
                );
            } else {
                console.log('No hay cursos en la base de datos para probar');
            }
        });
    });

    describe('4. Verificación de roles (acceso restringido)', () => {
        it('ESTUDIANTE no puede acceder a Curso_findAllByTitle (requiere ADMIN)', async () => {
            const query = `
        query Curso_findAllByTitle($search: String!) {
          Curso_findAllByTitle(search: $search) {
            _id
            courseTitle
          }
        }
      `;

            const response = await request(httpServer)
                .post('/graphql')
                .set('Cookie', `jwt_token=${jwtToken}`)
                .send({
                    query,
                    variables: { search: 'test' },
                });

            // GraphQL siempre devuelve 200, los errores vienen en el body
            // Debe recibir error de acceso denegado
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors.length).toBeGreaterThan(0);
            console.log(
                'Acceso correctamente denegado para ESTUDIANTE:',
                response.body.errors[0].message,
            );
        });
    });

    describe('5. Actualización de roles (require ADMIN)', () => {
        // Este test usa un usuario admin existente
        it('Admin puede actualizar roles de un usuario', async () => {
            // Primero hacer login como admin
            const loginMutation = `
        mutation Login($loginUserInput: LoginUserInput!) {
          login(loginUserInput: $loginUserInput) {
            _id
            email
            roles
          }
        }
      `;

            const adminLoginResponse = await request(httpServer)
                .post('/graphql')
                .send({
                    query: loginMutation,
                    variables: {
                        loginUserInput: adminCredentials,
                    },
                });

            if (adminLoginResponse.body.errors) {
                console.log('Admin no disponible, saltando test');
                return;
            }

            const adminCookies = adminLoginResponse.headers['set-cookie'] as unknown as
                | string[]
                | undefined;
            if (adminCookies && Array.isArray(adminCookies)) {
                const jwtCookie = adminCookies.find((cookie: string) =>
                    cookie.startsWith('jwt_token='),
                );
                if (jwtCookie) {
                    adminToken = jwtCookie.split(';')[0].split('=')[1];
                }
            }

            // Actualizar rol del usuario de prueba a ADMINISTRADOR
            const updateRolesMutation = `
        mutation Usuario_updateRoles($id: ID!, $updateRolesInput: UpdateRolesInput!) {
          usuario_updateRoles(id: $id, updateRolesInput: $updateRolesInput) {
            _id
            email
            roles
          }
        }
      `;

            const updateResponse = await request(httpServer)
                .post('/graphql')
                .set('Cookie', `jwt_token=${adminToken}`)
                .send({
                    query: updateRolesMutation,
                    variables: {
                        id: userId,
                        updateRolesInput: {
                            roles: ['ADMINISTRADOR'],
                        },
                    },
                })
                .expect(200);

            expect(updateResponse.body.data).toBeDefined();
            expect(updateResponse.body.data.usuario_updateRoles).toBeDefined();
            expect(updateResponse.body.data.usuario_updateRoles.roles).toContain(
                'ADMINISTRADOR',
            );
            console.log(
                'Rol actualizado a:',
                updateResponse.body.data.usuario_updateRoles.roles,
            );

            // PASO 2: El nuevo admin hace login para obtener un nuevo JWT con el rol actualizado
            console.log('Nuevo admin haciendo login con rol actualizado...');
            const newAdminLoginResponse = await request(httpServer)
                .post('/graphql')
                .send({
                    query: loginMutation,
                    variables: {
                        loginUserInput: {
                            email: testUser.email,
                            password: testUser.password,
                        },
                    },
                })
                .expect(200);

            expect(newAdminLoginResponse.body.data).toBeDefined();
            expect(newAdminLoginResponse.body.data.login).toBeDefined();
            console.log('Nuevo admin roles:', newAdminLoginResponse.body.data.login.roles);

            // Obtener el nuevo JWT token
            let newAdminToken = '';
            const newAdminCookies = newAdminLoginResponse.headers['set-cookie'] as unknown as
                | string[]
                | undefined;
            if (newAdminCookies && Array.isArray(newAdminCookies)) {
                const jwtCookie = newAdminCookies.find((cookie: string) =>
                    cookie.startsWith('jwt_token='),
                );
                if (jwtCookie) {
                    newAdminToken = jwtCookie.split(';')[0].split('=')[1];
                }
            }

            // PASO 3: El nuevo admin consulta un curso específico con Curso(id) - endpoint protegido
            console.log('Nuevo admin consultando curso específico (endpoint protegido)...');

            // Primero obtener un ID de curso existente
            const getCursosQuery = `
                query Cursos {
                    Cursos(offset: 0, limit: 1) {
                        _id
                        courseTitle
                    }
                }
            `;

            const cursosResponse = await request(httpServer)
                .post('/graphql')
                .send({ query: getCursosQuery })
                .expect(200);

            expect(cursosResponse.body.data).toBeDefined();
            expect(cursosResponse.body.data.Cursos).toBeDefined();
            expect(cursosResponse.body.data.Cursos.length).toBeGreaterThan(0);

            const cursoId = cursosResponse.body.data.Cursos[0]._id;
            console.log('Consultando curso con ID:', cursoId);

            // Ahora consultar el curso específico con el nuevo admin
            const protectedQuery = `
                query Curso($id: ID!) {
                    Curso(id: $id) {
                        _id
                        courseTitle
                        descripcionCorta
                    }
                }
            `;

            const protectedResponse = await request(httpServer)
                .post('/graphql')
                .set('Cookie', `jwt_token=${newAdminToken}`)
                .send({
                    query: protectedQuery,
                    variables: { id: cursoId },
                })
                .expect(200);

            // Ahora SI debe tener acceso porque tiene rol ADMINISTRADOR
            expect(protectedResponse.body.errors).toBeUndefined();
            expect(protectedResponse.body.data).toBeDefined();
            expect(protectedResponse.body.data.Curso).toBeDefined();
            console.log(
                '✅ NUEVO ADMIN pudo acceder al curso protegido:',
                protectedResponse.body.data.Curso.courseTitle,
            );
        });
    });
});
