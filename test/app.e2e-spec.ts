import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { like } from 'pactum-matchers';
/*
=== OPEN PRISMA STUDIO ON "TEST" DATABASE ===
npx dotenv -e .env.test -- prisma studio

=== OPEN PRISMA STUDIO ON "DEV" DATABASE ===
npx dotenv -e .env -- prisma studio
*/

const PORT = 3003;

describe('App e2e test', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    await app.listen(PORT);

    prismaService = app.get(PrismaService);
    await prismaService.cleanDatabase();
    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  describe('Test Authentication', () => {
    describe('Register', () => {
      it('should register a new user successfully', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: 'testemail01@awesome.com',
            password: '123456',
            firstname: 'Test',
            lastname: 'Doe',
          })
          .expectStatus(201)
          .inspect();
      });
      it('should return error when email is empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: '',
            password: '123456',
            firstname: 'Test',
            lastname: 'Doe',
          })
          .expectStatus(400)
          .inspect();
      });
      it('should return error when email is invalid', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: 'testemail01@awesome',
            password: '123456',
            firstname: 'Test',
            lastname: 'Doe',
          })
          .expectStatus(400)
          .inspect();
      });
      it('should return error when password is empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: 'testemail01@awesome',
            password: '',
            firstname: 'Test',
            lastname: 'Doe',
          })
          .expectStatus(400)
          .inspect();
      });
      it('should return error when firstname is empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: 'testemail01@awesome',
            password: '123456',
            firstname: '',
            lastname: 'Doe',
          })
          .expectStatus(400)
          .inspect();
      });
    });
    describe('Signin', () => {
      it('should signin user successfully', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'testemail01@awesome.com',
            password: '123456',
          })
          .expectStatus(201)
          .inspect()
          .stores('accessToken', 'accessToken');
      });
    });

    describe('User', () => {
      describe('Get User Detail', () => {
        it('should return user detail successfully', () => {
          return pactum
            .spec()
            .get('/users/me')
            .withHeaders({
              Authorization: 'Bearer $S{accessToken}',
            })
            .expectStatus(200)
            .inspect();
        });
      });
    });
  });

  afterAll(async () => {
    app.close();
  });

  it.todo('should pass');
});
