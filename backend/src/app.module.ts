import { Module } from '@nestjs/common';
import { DrepModule } from './drep/drep.module';
import { NoteModule } from './note/note.module';
import { AttachmentModule } from './attachment/attachment.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db.module';
import { HealthzModule } from './healthz/healthz.module';
import { AuthModule } from './auth/auth.module';
import { VoterModule } from './voter/voter.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionsModule } from './reactions/reactions.module';
import { AuthService } from './auth/auth.service';
import { ProposalsModule } from './proposals/proposals.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import {NotificationsModule} from "./notifications/notifications.module";
import { BlockfrostModule } from './blockfrost/blockfrost.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
    DrepModule,
    DbModule,
    NoteModule,
    AttachmentModule,
    HealthzModule,
    AuthModule,
    VoterModule,
    CommentsModule,
    ReactionsModule,
    ProposalsModule,
    MiscellaneousModule,
    NotificationsModule,
    BlockfrostModule
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
