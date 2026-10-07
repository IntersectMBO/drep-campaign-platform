import { INestApplication, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AttachmentController } from 'src/attachment/attachment.controller';
import { CommentsController } from 'src/comments/comments.controller';
import { CommentsService } from 'src/comments/comments.service';
import { DrepController } from 'src/drep/drep.controller';
import { DrepService } from 'src/drep/drep.service';
import { HealthzController } from 'src/healthz/healthz.controller';
import { MiscellaneousController } from 'src/miscellaneous/miscellaneous.controller';
import { NoteController } from 'src/note/note.controller';
import { NoteService } from 'src/note/note.service';
import { NotificationsController } from 'src/notifications/notifications.controller';
import { ProposalsController } from 'src/proposals/proposals.controller';
import { ReactionsController } from 'src/reactions/reactions.controller';
import { ReactionsService } from 'src/reactions/reactions.service';
import { VoterController } from 'src/voter/voter.controller';
import { TestWalletKey } from '../../test/test-wallet';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';

const SECRET = 'test-secret-that-is-at-least-32-characters';

const CONTROLLERS = [
  AttachmentController,
  CommentsController,
  DrepController,
  HealthzController,
  MiscellaneousController,
  NoteController,
  NotificationsController,
  ProposalsController,
  ReactionsController,
  VoterController,
];

// State-changing routes that work without a session
const PUBLIC_WRITES = ['POST /auth/login', 'POST /dreps/metadata/validate'];

type Route = { method: string; path: string };

// All routes declared on the given controllers, with sample path parameters
const collectRoutes = (controllers: any[]): Route[] =>
  controllers.flatMap((controller) => {
    const base = Reflect.getMetadata(PATH_METADATA, controller);
    return Object.getOwnPropertyNames(controller.prototype)
      .filter((name) => name !== 'constructor')
      .map((name) => controller.prototype[name])
      .filter((handler) => Reflect.hasMetadata(PATH_METADATA, handler))
      .map((handler) => {
        const path = `/${base}/${Reflect.getMetadata(PATH_METADATA, handler)}`
          .replace(/\/+/g, '/')
          .replace(/\/$/, '')
          .replace(/:[^/]+/g, '1');
        const method =
          RequestMethod[Reflect.getMetadata(METHOD_METADATA, handler)];
        return { method, path };
      });
  });

const WRITE_ROUTES = collectRoutes([...CONTROLLERS, AuthController]).filter(
  ({ method, path }) =>
    method !== 'GET' && !PUBLIC_WRITES.includes(`${method} ${path}`),
);

const send = (app: INestApplication, { method, path }: Route) =>
  request(app.getHttpServer())[method.toLowerCase()](path);

describe('AuthGuard', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let drepService: Record<string, jest.Mock>;
  let noteService: Record<string, jest.Mock>;
  let commentsService: Record<string, jest.Mock>;
  let reactionsService: Record<string, jest.Mock>;
  const stakeKey = new TestWalletKey();
  const drepKey = new TestWalletKey();

  const tokenFor = (claims: object, options = {}) =>
    jwtService.signAsync(claims, options);

  beforeAll(async () => {
    drepService = {
      registerDrep: jest.fn().mockResolvedValue({}),
      updateDrepInfo: jest.fn().mockResolvedValue({}),
      saveMetadata: jest.fn().mockResolvedValue({}),
      validateMetadata: jest.fn().mockResolvedValue({}),
    };
    noteService = {
      registerNote: jest.fn().mockResolvedValue({}),
      updateNoteInfo: jest.fn().mockResolvedValue({}),
    };
    commentsService = {
      insertComment: jest.fn().mockResolvedValue({}),
      removeComment: jest.fn().mockResolvedValue({}),
    };
    reactionsService = {
      insertReaction: jest.fn().mockResolvedValue({}),
      removeReaction: jest.fn().mockResolvedValue({}),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          load: [() => ({ JWT_SECRET: SECRET })],
        }),
        AuthModule,
      ],
      controllers: CONTROLLERS,
      providers: [
        { provide: DrepService, useValue: drepService },
        { provide: NoteService, useValue: noteService },
        { provide: CommentsService, useValue: commentsService },
        { provide: ReactionsService, useValue: reactionsService },
      ],
    })
      .useMocker(() => ({}))
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    jwtService = moduleRef.get(JwtService);
  });

  afterAll(() => app.close());

  beforeEach(() => jest.clearAllMocks());

  it('finds the state-changing routes', () => {
    expect(WRITE_ROUTES.map(({ method, path }) => `${method} ${path}`)).toEqual(
      expect.arrayContaining([
        'POST /dreps/new',
        'POST /dreps/1/update',
        'POST /dreps/metadata/save',
        'POST /notes/new',
        'POST /notes/1/update',
        'POST /comments/1/1/add',
        'POST /comments/1/1/remove',
        'POST /reactions/add',
        'POST /reactions/remove',
        'POST /attachments/add',
        'POST /attachments/ipfs/add',
      ]),
    );
  });

  it.each(WRITE_ROUTES)(
    'rejects $method $path without a session',
    async (route) => {
      await send(app, route).expect(401);
    },
  );

  it.each(WRITE_ROUTES)(
    'rejects $method $path with a token signed by another secret',
    async (route) => {
      const other = new JwtService({ secret: `${SECRET}-other` });
      const token = await other.signAsync({ sub: stakeKey.stakeAddress() });

      await send(app, route)
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    },
  );

  it('rejects an expired session', async () => {
    const token = await tokenFor(
      { sub: stakeKey.stakeAddress() },
      { expiresIn: -10 },
    );

    await request(app.getHttpServer())
      .post('/reactions/add')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
    expect(reactionsService.insertReaction).not.toHaveBeenCalled();
  });

  it('keeps read routes public', async () => {
    await request(app.getHttpServer()).get('/healthz/live').expect(200);
    await request(app.getHttpServer())
      .get('/auth/challenge')
      .expect(200)
      .expect(({ body }) => expect(body.message).toContain('Nonce: '));
  });

  it('keeps metadata validation public', async () => {
    await request(app.getHttpServer())
      .post('/dreps/metadata/validate')
      .send({ hash: 'abc', url: 'https://example.com/metadata.jsonld' })
      .expect(201);
  });

  it('records comments and reactions under the session stake address', async () => {
    const token = await tokenFor({ sub: stakeKey.stakeAddress() });
    const someoneElse = new TestWalletKey().stakeAddress();

    await request(app.getHttpServer())
      .post('/comments/7/note/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ comment: 'hello', voter: someoneElse })
      .expect(201);
    await request(app.getHttpServer())
      .post('/reactions/add')
      .set('Authorization', `Bearer ${token}`)
      .send({
        parentId: 7,
        parentEntity: 'note',
        type: 'like',
        voter: someoneElse,
      })
      .expect(201);

    expect(commentsService.insertComment).toHaveBeenCalledWith(
      '7',
      'note',
      'hello',
      stakeKey.stakeAddress(),
    );
    expect(reactionsService.insertReaction).toHaveBeenCalledWith(
      7,
      'note',
      'like',
      stakeKey.stakeAddress(),
    );
  });

  it('passes the session to DRep profile and note writes', async () => {
    const token = await tokenFor({
      sub: stakeKey.stakeAddress(),
      drepId: drepKey.drepId(),
    });
    const principal = {
      stakeAddress: stakeKey.stakeAddress(),
      drepId: drepKey.drepId(),
    };

    await request(app.getHttpServer())
      .post('/dreps/new')
      .set('Authorization', `Bearer ${token}`)
      .send({ voter_id: 'drep1someoneelse' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/notes/new')
      .set('Authorization', `Bearer ${token}`)
      .send({ note_title: 'title', voter: 'drep1someoneelse' })
      .expect(201);

    expect(drepService.registerDrep).toHaveBeenCalledWith(
      { voter_id: 'drep1someoneelse' },
      principal,
    );
    expect(noteService.registerNote).toHaveBeenCalledWith(
      { note_title: 'title', voter: 'drep1someoneelse' },
      principal,
    );
  });

  it('only lets DReps pin files to IPFS', async () => {
    const token = await tokenFor({ sub: stakeKey.stakeAddress() });

    await request(app.getHttpServer())
      .post('/attachments/ipfs/add')
      .set('Authorization', `Bearer ${token}`)
      .attach('attachment', Buffer.from('image'), 'image.png')
      .expect(403);
  });

  it('logs in with signatures over a server challenge', async () => {
    const {
      body: { message },
    } = await request(app.getHttpServer()).get('/auth/challenge').expect(200);

    const {
      body: { token, drepId },
    } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        message,
        stakeAddress: stakeKey.stakeAddress(),
        stake: stakeKey.signData(message),
        drep: drepKey.signData(message),
        expiry: '24 hrs',
      })
      .expect(201);

    expect(drepId).toBe(drepKey.drepId());
    await request(app.getHttpServer())
      .post('/dreps/1/update')
      .set('Authorization', `Bearer ${token}`)
      .send({ platform_statement: 'statement' })
      .expect(201);
    expect(drepService.updateDrepInfo).toHaveBeenCalledWith(
      1,
      { platform_statement: 'statement' },
      { stakeAddress: stakeKey.stakeAddress(), drepId: drepKey.drepId() },
    );
  });

  it('rejects login requests with unexpected fields', async () => {
    const { message } = (
      await request(app.getHttpServer()).get('/auth/challenge')
    ).body;

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        message,
        stakeAddress: stakeKey.stakeAddress(),
        stake: stakeKey.signData(message),
        drepId: 'drep1someoneelse',
      })
      .expect(400);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ message, stakeAddress: stakeKey.stakeAddress() })
      .expect(400);
  });

  it('rejects login with a signature from another wallet', async () => {
    const { message } = (
      await request(app.getHttpServer()).get('/auth/challenge')
    ).body;

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        message,
        stakeAddress: stakeKey.stakeAddress(),
        stake: new TestWalletKey().signData(message),
      })
      .expect(401);
  });
});
