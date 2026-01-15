import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as cookieParser from 'cookie-parser';

/**
 * Pruebas e2e para el flujo de Cursos y Categorías:
 * 1. Login como administrador
 * 2. Crear categorías de prueba
 * 3. Crear un curso sin categorías
 * 4. Agregar categorías usando Curso_addCategorias
 * 5. Eliminar categorías usando Curso_removeCategorias
 * 6. Verificar que los cambios se aplicaron correctamente
 * 7. Limpieza: eliminar curso y categorías de prueba
 */
describe('Curso-Categorias Flow (e2e)', () => {
    let app: INestApplication;
    let httpServer: any;
    let adminToken: string;

    // IDs de recursos creados para cleanup
    let categoria1Id: string;
    let categoria2Id: string;
    let categoria3Id: string;
    let cursoId: string;

    // Credenciales del administrador existente
    const adminCredentials = {
        email: 'henryreyesinv+admin@gmail.com',
        password: '123456',
    };

    // Datos de categorías de prueba
    const testCategoria1 = {
        nombreCategoria: `Test_Categoria_Mecanica_${Date.now()}`,
        descripcion: 'Categoría de prueba para cursos de mecánica',
    };

    const testCategoria2 = {
        nombreCategoria: `Test_Categoria_Procesos_${Date.now()}`,
        descripcion: 'Categoría de prueba para cursos de procesos',
    };

    const testCategoria3 = {
        nombreCategoria: `Test_Categoria_Seguridad_${Date.now()}`,
        descripcion: 'Categoría de prueba para cursos de seguridad industrial',
    };

    // Datos del curso de prueba
    const testCurso = {
        courseTitle: `Test_Curso_Categorias_${Date.now()}`,
        descripcionCorta: 'Curso de prueba para validar gestión de categorías',
        descripcionLarga: 'Este curso se utiliza para probar las operaciones de agregar, modificar y eliminar categorías.',
        precio: 99.99,
    };

    // Helper para obtener curso con categorías populadas
    const fetchCursoWithCategorias = async (id: string) => {
        const query = `
            query Curso($id: ID!) {
                Curso(id: $id) {
                    _id
                    courseTitle
                    categorias {
                        _id
                        nombreCategoria
                    }
                }
            }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .set('Cookie', `jwt_token=${adminToken}`)
            .send({
                query,
                variables: { id },
            });

        return response.body;
    };

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

    describe('1. Login como Administrador', () => {
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
                        loginUserInput: adminCredentials,
                    },
                });

            if (response.body.errors) {
                console.log('❌ Admin no disponible. Verifica que exista el usuario admin con las credenciales correctas.');
                console.log('Error:', response.body.errors[0].message);
                throw new Error('Admin login failed - cannot continue tests');
            }

            expect(response.body.data).toBeDefined();
            expect(response.body.data.login).toBeDefined();
            expect(response.body.data.login.roles).toContain('ADMINISTRADOR');

            // Obtener el JWT token de las cookies
            const cookies = response.headers['set-cookie'] as unknown as string[] | undefined;
            if (cookies && Array.isArray(cookies)) {
                const jwtCookie = cookies.find((cookie: string) =>
                    cookie.startsWith('jwt_token='),
                );
                if (jwtCookie) {
                    adminToken = jwtCookie.split(';')[0].split('=')[1];
                    console.log('✅ JWT Token de admin obtenido');
                }
            }

            expect(adminToken).toBeDefined();
        });
    });

    describe('2. Crear Categorías de Prueba', () => {
        it('debe crear la primera categoría (Mecánica)', async () => {
            const mutation = `
                mutation Categorias_create($createCategoriaInput: CreateCategoriaInput!) {
                    Categorias_create(createCategoriaInput: $createCategoriaInput) {
                        _id
                        nombreCategoria
                        descripcion
                    }
                }
            `;

            const response = await request(httpServer)
                .post('/graphql')
                .set('Cookie', `jwt_token=${adminToken}`)
                .send({
                    query: mutation,
                    variables: {
                        createCategoriaInput: testCategoria1,
                    },
                })
                .expect(200);

            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.Categorias_create).toBeDefined();
            expect(response.body.data.Categorias_create.nombreCategoria).toBe(testCategoria1.nombreCategoria);

            categoria1Id = response.body.data.Categorias_create._id;
            console.log('✅ Categoría 1 creada:', categoria1Id);
        });

        it('debe crear la segunda categoría (Procesos)', async () => {
            const mutation = `
                mutation Categorias_create($createCategoriaInput: CreateCategoriaInput!) {
                    Categorias_create(createCategoriaInput: $createCategoriaInput) {
                        _id
                        nombreCategoria
                        descripcion
                    }
                }
            `;

            const response = await request(httpServer)
                .post('/graphql')
                .set('Cookie', `jwt_token=${adminToken}`)
                .send({
                    query: mutation,
                    variables: {
                        createCategoriaInput: testCategoria2,
                    },
                })
                .expect(200);

            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.Categorias_create).toBeDefined();

            categoria2Id = response.body.data.Categorias_create._id;
            console.log('✅ Categoría 2 creada:', categoria2Id);
        });

        it('debe crear la tercera categoría (Seguridad)', async () => {
            const mutation = `
                mutation Categorias_create($createCategoriaInput: CreateCategoriaInput!) {
                    Categorias_create(createCategoriaInput: $createCategoriaInput) {
                        _id
                        nombreCategoria
                        descripcion
                    }
                }
            `;

            const response = await request(httpServer)
                .post('/graphql')
                .set('Cookie', `jwt_token=${adminToken}`)
                .send({
                    query: mutation,
                    variables: {
                        createCategoriaInput: testCategoria3,
                    },
                })
                .expect(200);

            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.Categorias_create).toBeDefined();

            categoria3Id = response.body.data.Categorias_create._id;
            console.log('✅ Categoría 3 creada:', categoria3Id);
        });
    });

    describe('3. Crear Curso sin Categorías', () => {
        it('debe crear un curso sin categorías iniciales', async () => {
            const mutation = `
                mutation Curso_create($createCursoInput: CreateCursoInput!) {
                    Curso_create(createCursoInput: $createCursoInput) {
                        _id
                        courseTitle
                        descripcionCorta
                    }
                }
            `;

            const response = await request(httpServer)
                .post('/graphql')
                .set('Cookie', `jwt_token=${adminToken}`)
                .send({
                    query: mutation,
                    variables: {
                        createCursoInput: testCurso,
                    },
                })
                .expect(200);

            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.Curso_create).toBeDefined();
            expect(response.body.data.Curso_create.courseTitle).toBe(testCurso.courseTitle);

            cursoId = response.body.data.Curso_create._id;
            console.log('✅ Curso creado:', cursoId);
        });
    });

    describe('4. Agregar Categorías con Curso_addCategorias', () => {
        it('debe agregar una categoría al curso', async () => {
            const mutation = `
                mutation Curso_addCategorias($cursoId: ID!, $categoriaIds: [ID!]!) {
                    Curso_addCategorias(cursoId: $cursoId, categoriaIds: $categoriaIds) {
                        _id
                        courseTitle
                        categorias {
                            _id
                            nombreCategoria
                        }
                    }
                }
            `;

            const response = await request(httpServer)
                .post('/graphql')
                .set('Cookie', `jwt_token=${adminToken}`)
                .send({
                    query: mutation,
                    variables: {
                        cursoId: cursoId,
                        categoriaIds: [categoria1Id],
                    },
                })
                .expect(200);

            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.Curso_addCategorias).toBeDefined();
            expect(response.body.data.Curso_addCategorias.categorias).toHaveLength(1);
            expect(response.body.data.Curso_addCategorias.categorias[0]._id).toBe(categoria1Id);

            console.log('✅ Categoría 1 agregada al curso');
        });

        it('debe agregar múltiples categorías al curso', async () => {
            const mutation = `
                mutation Curso_addCategorias($cursoId: ID!, $categoriaIds: [ID!]!) {
                    Curso_addCategorias(cursoId: $cursoId, categoriaIds: $categoriaIds) {
                        _id
                        courseTitle
                        categorias {
                            _id
                            nombreCategoria
                        }
                    }
                }
            `;

            const response = await request(httpServer)
                .post('/graphql')
                .set('Cookie', `jwt_token=${adminToken}`)
                .send({
                    query: mutation,
                    variables: {
                        cursoId: cursoId,
                        categoriaIds: [categoria2Id, categoria3Id],
                    },
                })
                .expect(200);

            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.Curso_addCategorias).toBeDefined();
            expect(response.body.data.Curso_addCategorias.categorias).toHaveLength(3);

            console.log('✅ Categorías 2 y 3 agregadas al curso');
            console.log('   Total categorías:', response.body.data.Curso_addCategorias.categorias.length);
        });

        it('no debe duplicar categorías ya existentes', async () => {
            const mutation = `
                mutation Curso_addCategorias($cursoId: ID!, $categoriaIds: [ID!]!) {
                    Curso_addCategorias(cursoId: $cursoId, categoriaIds: $categoriaIds) {
                        _id
                        categorias {
                            _id
                            nombreCategoria
                        }
                    }
                }
            `;

            const response = await request(httpServer)
                .post('/graphql')
                .set('Cookie', `jwt_token=${adminToken}`)
                .send({
                    query: mutation,
                    variables: {
                        cursoId: cursoId,
                        categoriaIds: [categoria1Id], // Ya existe
                    },
                })
                .expect(200);

            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.Curso_addCategorias.categorias).toHaveLength(3); // Sigue siendo 3

            console.log('✅ No se duplicó la categoría existente');
        });
    });

    describe('5. Eliminar Categorías con Curso_removeCategorias', () => {
        it('debe eliminar una categoría del curso', async () => {
            const mutation = `
                mutation Curso_removeCategorias($cursoId: ID!, $categoriaIds: [ID!]!) {
                    Curso_removeCategorias(cursoId: $cursoId, categoriaIds: $categoriaIds) {
                        _id
                        courseTitle
                        categorias {
                            _id
                            nombreCategoria
                        }
                    }
                }
            `;

            const response = await request(httpServer)
                .post('/graphql')
                .set('Cookie', `jwt_token=${adminToken}`)
                .send({
                    query: mutation,
                    variables: {
                        cursoId: cursoId,
                        categoriaIds: [categoria2Id], // Eliminar Procesos
                    },
                })
                .expect(200);

            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.Curso_removeCategorias).toBeDefined();
            expect(response.body.data.Curso_removeCategorias.categorias).toHaveLength(2);

            // Verificar que Procesos fue eliminada
            const categoryIds = response.body.data.Curso_removeCategorias.categorias.map((c: any) => c._id);
            expect(categoryIds).not.toContain(categoria2Id);

            console.log('✅ Categoría "Procesos" eliminada del curso');
        });

        it('debe eliminar múltiples categorías del curso', async () => {
            const mutation = `
                mutation Curso_removeCategorias($cursoId: ID!, $categoriaIds: [ID!]!) {
                    Curso_removeCategorias(cursoId: $cursoId, categoriaIds: $categoriaIds) {
                        _id
                        categorias {
                            _id
                            nombreCategoria
                        }
                    }
                }
            `;

            const response = await request(httpServer)
                .post('/graphql')
                .set('Cookie', `jwt_token=${adminToken}`)
                .send({
                    query: mutation,
                    variables: {
                        cursoId: cursoId,
                        categoriaIds: [categoria1Id, categoria3Id], // Eliminar las restantes
                    },
                })
                .expect(200);

            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.Curso_removeCategorias.categorias).toHaveLength(0);

            console.log('✅ Todas las categorías eliminadas del curso');
        });
    });

    describe('6. Verificar Consulta del Curso', () => {
        beforeAll(async () => {
            // Agregar categorías para la verificación final
            const mutation = `
                mutation Curso_addCategorias($cursoId: ID!, $categoriaIds: [ID!]!) {
                    Curso_addCategorias(cursoId: $cursoId, categoriaIds: $categoriaIds) {
                        _id
                    }
                }
            `;

            await request(httpServer)
                .post('/graphql')
                .set('Cookie', `jwt_token=${adminToken}`)
                .send({
                    query: mutation,
                    variables: {
                        cursoId: cursoId,
                        categoriaIds: [categoria1Id, categoria3Id],
                    },
                });
        });

        it('debe retornar las categorías populadas al consultar el curso', async () => {
            const cursoData = await fetchCursoWithCategorias(cursoId);

            expect(cursoData.errors).toBeUndefined();
            expect(cursoData.data.Curso).toBeDefined();
            expect(cursoData.data.Curso.categorias).toHaveLength(2);

            // Verificar que las categorías tienen todos los campos
            cursoData.data.Curso.categorias.forEach((cat: any) => {
                expect(cat._id).toBeDefined();
                expect(cat.nombreCategoria).toBeDefined();
            });

            console.log('✅ Consulta de curso con categorías populadas exitosa');
            console.log('   Categorías:', cursoData.data.Curso.categorias.map((c: any) => c.nombreCategoria));
        });
    });

    describe('7. Cleanup - Eliminar recursos de prueba', () => {
        it('debe eliminar el curso de prueba (softDelete)', async () => {
            if (!cursoId) {
                console.log('⚠️ No hay curso para eliminar');
                return;
            }

            const mutation = `
                mutation Curso_softDelete($idRemove: ID!) {
                    Curso_softDelete(idRemove: $idRemove) {
                        _id
                        deleted
                    }
                }
            `;

            const response = await request(httpServer)
                .post('/graphql')
                .set('Cookie', `jwt_token=${adminToken}`)
                .send({
                    query: mutation,
                    variables: { idRemove: cursoId },
                })
                .expect(200);

            expect(response.body.errors).toBeUndefined();
            console.log('✅ Curso de prueba eliminado (soft delete)');
        });

        it('debe eliminar las categorías de prueba (softDelete)', async () => {
            const mutation = `
                mutation Categorias_softDelete($idRemove: ID!) {
                    Categorias_softDelete(idRemove: $idRemove) {
                        _id
                        deleted
                    }
                }
            `;

            const categoriasToDelete = [categoria1Id, categoria2Id, categoria3Id].filter(id => id);

            for (const catId of categoriasToDelete) {
                const response = await request(httpServer)
                    .post('/graphql')
                    .set('Cookie', `jwt_token=${adminToken}`)
                    .send({
                        query: mutation,
                        variables: { idRemove: catId },
                    })
                    .expect(200);

                if (response.body.errors) {
                    console.log(`⚠️ Error al eliminar categoría ${catId}:`, response.body.errors[0].message);
                }
            }

            console.log('✅ Categorías de prueba eliminadas (soft delete)');
        });
    });
});
