import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as cookieParser from 'cookie-parser';

/**
 * Test simple para verificar cuántas categorías hay en el sistema
 */
describe('Categorias Count (e2e)', () => {
    let app: INestApplication;
    let httpServer: any;
    let adminToken: string;

    const adminCredentials = {
        email: 'henryreyesinv+admin@gmail.com',
        password: '123456',
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

        // Login como admin
        const loginMutation = `
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
                query: loginMutation,
                variables: { loginUserInput: adminCredentials },
            });

        const cookies = response.headers['set-cookie'] as unknown as string[] | undefined;
        if (cookies && Array.isArray(cookies)) {
            const jwtCookie = cookies.find((cookie: string) => cookie.startsWith('jwt_token='));
            if (jwtCookie) {
                adminToken = jwtCookie.split(';')[0].split('=')[1];
            }
        }
    });

    afterAll(async () => {
        await app.close();
    });

    it('debe retornar la cantidad de categorías existentes', async () => {
        const query = `
            query Categorias {
                Categorias(offset: 0, limit: 100) {
                    _id
                    nombreCategoria
                    descripcion
                }
            }
        `;

        const response = await request(httpServer)
            .post('/graphql')
            .set('Cookie', `jwt_token=${adminToken}`)
            .send({ query })
            .expect(200);

        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.Categorias).toBeDefined();

        const categorias = response.body.data.Categorias;
        console.log('\n========================================');
        console.log(`📊 CANTIDAD DE CATEGORÍAS: ${categorias.length}`);
        console.log('========================================');

        if (categorias.length > 0) {
            console.log('\n📁 Lista de categorías:');
            categorias.forEach((cat: any, index: number) => {
                console.log(`   ${index + 1}. ${cat.nombreCategoria}`);
                if (cat.descripcion) {
                    console.log(`      └─ ${cat.descripcion}`);
                }
            });
        } else {
            console.log('\n⚠️ No hay categorías en el sistema');
        }
        console.log('========================================\n');

        expect(Array.isArray(categorias)).toBe(true);
    });
});
