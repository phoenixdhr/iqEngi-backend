import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as cookieParser from 'cookie-parser';

/**
 * Test e2e para verificar la consulta de todos los cursos con categorías populadas
 * Verifica que la query Cursos devuelva los cursos con sus categorías correctamente
 */
describe('Cursos con Categorías (e2e)', () => {
    let app: INestApplication;
    let httpServer: any;

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

    describe('Consulta pública de Cursos', () => {
        it('debe retornar cursos con categorías populadas (acceso público)', async () => {
            const query = `
                query Cursos($offset: Int, $limit: Int) {
                    Cursos(offset: $offset, limit: $limit) {
                        _id
                        courseTitle
                        descripcionCorta
                        descripcionLarga
                        nivel
                        instructor {
                            _id
                        }
                        duracionHoras
                        imagenURL {
                            url
                            alt
                        }
                        precio
                        currency
                        descuento
                        calificacionPromedio
                        numeroCalificaciones
                        aprenderas
                        objetivos
                        dirigidoA
                        modulosIds
                        fechaLanzamiento
                        cuestionarioId {
                            _id
                        }
                        slug
                        deleted
                        categorias {
                            _id
                            nombreCategoria
                            descripcion
                            deleted
                        }
                    }
                }
            `;

            const response = await request(httpServer)
                .post('/graphql')
                .send({
                    query,
                    variables: {
                        offset: 0,
                        limit: 30,
                    },
                })
                .expect(200);

            // Verificar que no hay errores
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data).toBeDefined();
            expect(response.body.data.Cursos).toBeDefined();

            const cursos = response.body.data.Cursos;
            console.log('\n========================================');
            console.log(`📚 CANTIDAD DE CURSOS: ${cursos.length}`);
            console.log('========================================');

            if (cursos.length > 0) {
                console.log('\n📋 Lista de cursos con sus categorías:\n');

                cursos.forEach((curso: any, index: number) => {
                    console.log(`${index + 1}. ${curso.courseTitle}`);
                    console.log(`   ID: ${curso._id}`);
                    console.log(`   Precio: ${curso.precio ? `${curso.currency || 'USD'} ${curso.precio}` : 'No definido'}`);
                    console.log(`   Nivel: ${curso.nivel || 'No especificado'}`);

                    if (curso.categorias && curso.categorias.length > 0) {
                        console.log(`   📁 Categorías (${curso.categorias.length}):`);
                        curso.categorias.forEach((cat: any) => {
                            console.log(`      - ${cat.nombreCategoria} (ID: ${cat._id})`);
                        });
                    } else {
                        console.log('   📁 Sin categorías asignadas');
                    }
                    console.log('');
                });

                // Estadísticas
                const cursosConCategorias = cursos.filter((c: any) => c.categorias && c.categorias.length > 0).length;
                const cursosSinCategorias = cursos.filter((c: any) => !c.categorias || c.categorias.length === 0).length;
                const totalCategorias = cursos.reduce((acc: number, c: any) => acc + (c.categorias?.length || 0), 0);

                console.log('========================================');
                console.log('📊 ESTADÍSTICAS:');
                console.log(`   Cursos con categorías: ${cursosConCategorias}`);
                console.log(`   Cursos sin categorías: ${cursosSinCategorias}`);
                console.log(`   Total asignaciones de categorías: ${totalCategorias}`);
                console.log('========================================\n');
            } else {
                console.log('\n⚠️ No hay cursos en el sistema\n');
            }

            // Validaciones
            expect(Array.isArray(cursos)).toBe(true);

            // Si hay cursos, verificar la estructura
            if (cursos.length > 0) {
                const primerCurso = cursos[0];
                expect(primerCurso._id).toBeDefined();
                expect(primerCurso.courseTitle).toBeDefined();

                // Verificar que categorias es un array (puede estar vacío)
                expect(Array.isArray(primerCurso.categorias)).toBe(true);

                // Si tiene categorías, verificar que están populadas correctamente
                if (primerCurso.categorias.length > 0) {
                    const primeraCategoria = primerCurso.categorias[0];
                    expect(primeraCategoria._id).toBeDefined();
                    expect(primeraCategoria.nombreCategoria).toBeDefined();
                    // La categoria no debe ser null
                    expect(primeraCategoria._id).not.toBeNull();
                }
            }
        });

        it('debe manejar paginación correctamente', async () => {
            const query = `
                query Cursos($offset: Int, $limit: Int) {
                    Cursos(offset: $offset, limit: $limit) {
                        _id
                        courseTitle
                        categorias {
                            _id
                            nombreCategoria
                        }
                    }
                }
            `;

            // Consultar solo 5 cursos
            const response = await request(httpServer)
                .post('/graphql')
                .send({
                    query,
                    variables: {
                        offset: 0,
                        limit: 5,
                    },
                })
                .expect(200);

            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.Cursos).toBeDefined();
            expect(response.body.data.Cursos.length).toBeLessThanOrEqual(5);

            console.log(`✅ Paginación correcta: Solicitados 5, recibidos ${response.body.data.Cursos.length}`);
        });

        it('debe retornar array vacío si offset es mayor que el total', async () => {
            const query = `
                query Cursos($offset: Int, $limit: Int) {
                    Cursos(offset: $offset, limit: $limit) {
                        _id
                        courseTitle
                    }
                }
            `;

            const response = await request(httpServer)
                .post('/graphql')
                .send({
                    query,
                    variables: {
                        offset: 10000, // Offset muy alto
                        limit: 10,
                    },
                })
                .expect(200);

            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.Cursos).toBeDefined();
            expect(response.body.data.Cursos.length).toBe(0);

            console.log('✅ Offset alto retorna array vacío correctamente');
        });
    });
});
