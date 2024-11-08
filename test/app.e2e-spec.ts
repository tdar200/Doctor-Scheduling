import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateAppointmentDto } from 'src/appointment/dto';
// import { PrismaService } from '../src/prisma/prisma.service';
// import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';
// import { EditUserDto } from '../src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let patientId: number;
  let doctorId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');

    const doctor = await prisma.doctor
      .create({
        data: {
          specialization: 'General Practitioner',
          user: {
            create: {
              email: 'doctor@example.com',
              hash: 'hashedPassword',
              firstName: 'John',
              lastName: 'Doe',
              role: 'DOCTOR',
            },
          },
        },
      })
      .catch((error) => {
        console.error('Failed to create doctor:', error);
        throw error;
      });
    doctorId = doctor.id;

    const patient = await prisma.patient
      .create({
        data: {
          user: {
            create: {
              email: 'patient@example.com',
              hash: 'hashedPassword',
              firstName: 'Jane',
              lastName: 'Doe',
              role: 'PATIENT',
            },
          },
        },
      })
      .catch((error) => {
        console.error('Failed to create patient:', error);
        throw error;
      });

    patientId = patient.id;

    console.log('Doctor ID before:', doctorId);
    console.log('Doctor ID type:', typeof doctorId);
    console.log('Patient ID before:', patientId);
  });

  afterAll(async () => {
    console.log('Doctor ID:', doctorId);
    console.log('Patient ID:', patientId);
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'tahseen@gmail.com',
      password: '123',
      firstName: 'tahseen',
      lastName: 'dar',
      role: 'DOCTOR',
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  // describe('User', () => {
  //   describe('Get me', () => {
  //     it('should get current user', () => {
  //       return pactum
  //         .spec()
  //         .get('/users/me')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200);
  //     });
  //   });

  //   describe('Edit user', () => {
  //     it('should edit user', () => {
  //       const dto: EditUserDto = {
  //         firstName: 'Vladimir',
  //         email: 'vlad@codewithvlad.com',
  //       };
  //       return pactum
  //         .spec()
  //         .patch('/users')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .withBody(dto)
  //         .expectStatus(200)
  //         .expectBodyContains(dto.firstName)
  //         .expectBodyContains(dto.email);
  //     });
  //   });
  // });

  describe('Appointments', () => {
    const dto: CreateAppointmentDto = {
      status: 'SCHEDULED',
      appointmentDate: new Date(Date.now()),
      patientId: patientId,
      doctorId: doctorId,
      reason: 'Regular check-up',
    };
    describe('Get empty Appointments', () => {
      it('should get Appointments', () => {
        return pactum
          .spec()
          .get('/appointments')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create appointment', () => {
      it('should create appointment', async () => {
        await pactum
          .spec()
          .post('/appointments')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            status: 'SCHEDULED',
            appointmentDate: new Date(),
            patientId: patientId,
            doctorId: doctorId,
            reason: 'Regular check-up',
          })
          .expectStatus(201)
          .stores('appointmentId', 'id')
          .inspect();
      });
    });

    // describe('Get appointments', () => {
    //   it('should get appointments', () => {
    //     return pactum
    //       .spec()
    //       .get('/appointments')
    //       .withHeaders({
    //         Authorization: 'Bearer $S{userAt}',
    //       })
    //       .expectStatus(200)
    //       .expectJsonLength(1);
    //   });
    // });

    //   describe('Get bookmark by id', () => {
    //     it('should get bookmark by id', () => {
    //       return pactum
    //         .spec()
    //         .get('/bookmarks/{id}')
    //         .withPathParams('id', '$S{bookmarkId}')
    //         .withHeaders({
    //           Authorization: 'Bearer $S{userAt}',
    //         })
    //         .expectStatus(200)
    //         .expectBodyContains('$S{bookmarkId}'); //.expectJsonMatch({id: '$S{bookmarkId}'}) would have been the correct way of testing to prevent false positive matches with other numbers, user id etc.
    //     });
    //   });

    //   describe('Edit bookmark by id', () => {
    //     const dto: EditBookmarkDto = {
    //       title:
    //         'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
    //       description:
    //         'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
    //     };
    //     it('should edit bookmark', () => {
    //       return pactum
    //         .spec()
    //         .patch('/bookmarks/{id}')
    //         .withPathParams('id', '$S{bookmarkId}')
    //         .withHeaders({
    //           Authorization: 'Bearer $S{userAt}',
    //         })
    //         .withBody(dto)
    //         .expectStatus(200)
    //         .expectBodyContains(dto.title)
    //         .expectBodyContains(dto.description);
    //     });
    //   });

    //   describe('Delete bookmark by id', () => {
    //     it('should delete bookmark', () => {
    //       return pactum
    //         .spec()
    //         .delete('/bookmarks/{id}')
    //         .withPathParams('id', '$S{bookmarkId}')
    //         .withHeaders({
    //           Authorization: 'Bearer $S{userAt}',
    //         })
    //         .expectStatus(204);
    //     });

    //     it('should get empty bookmarks', () => {
    //       return pactum
    //         .spec()
    //         .get('/bookmarks')
    //         .withHeaders({
    //           Authorization: 'Bearer $S{userAt}',
    //         })
    //         .expectStatus(200)
    //         .expectJsonLength(0);
    //     });
    //   });
  });
});
