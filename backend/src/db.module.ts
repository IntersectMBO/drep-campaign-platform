import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'default',
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'web_db'),
        port: +configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USERNAME', 'postgres'),
        password: configService.get('DATABASE_PASSWORD', 'postgres'),
        database: configService.get('DATABASE_NAME', '1694'),
        entities: [__dirname + '/entities/*.entity.{ts,js}'],
        synchronize: false,
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        extra: {
          charset: 'utf8mb4_unicode_ci',
        },
        migrationsRun: true,
        logging: true,
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
