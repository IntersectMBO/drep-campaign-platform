import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Drep } from './entities/drep.entity';
import { Attachment } from './entities/attachment.entity';
import { Reaction } from './entities/reaction.entity';
import { Note } from './entities/note.entity';
import { Comment } from './entities/comment.entity';
import { Signature } from './entities/signatures.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'default',
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'web_db'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USERNAME', 'voltaire'),
        password: configService.get('DATABASE_PASSWORD', 'postgres'),
        database: configService.get('DATABASE_NAME', '1694'),
        entities: [Drep, Note, Attachment, Comment, Reaction, Signature],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'dbsync',
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST_DBSYNC', 'dbsync_db'),
        port: configService.get('DATABASE_PORT_DBSYNC', 5432),
        username: configService.get('DATABASE_USERNAME_DBSYNC', 'postgres'),
        password: configService.get('DATABASE_PASSWORD_DBSYNC'),
        database: configService.get('DATABASE_NAME_DBSYNC', 'cexplorer'),
      }),
    }),
  ],
})
export class DbModule {}
